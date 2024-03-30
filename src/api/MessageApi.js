import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { io } from 'socket.io-client';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:3500';

// Socket.io events
const CREATE_NEW_ROOM = 'createNewRoom';
const EMIT_ROOM_DATA = 'editRoomData';
const EMIT_NEW_ROOM_DATA = 'editNewRoomData';
const SYS_MESSAGE = 'sysMessage';
const CONNECT = 'connect';
const CONNECT_ERROR = 'connect_error';
const JOIN_ROOM = 'join-room';
const LEAVE_ROOM = 'leave-room';
const SEND_MESSAGE = 'send-message';
const SEND_ROOM_ACKNOWLEDGEMENT = 'send-room-acknowledgement';
const CREATE_NEW_DM = 'create-new-dm';

let socket = null;
function getSocket(userId) {
  if (!socket) {
    socket = io(BASE_URL, {
      withCredentials: true,
      retries: 5,
      auth: {
        userId,
      }
    });
  }
  return socket;
}

export const messageApi = createApi({
  reducerPath: 'messages',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: 'include',
  }),
  endpoints: (builder) => ({})
});

messageApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getMessages: builder.query({
      queryFn: () => ({ data: {} }),
      onCacheEntryAdded: async (arg, { getState, cacheDataLoaded, cacheEntryRemoved, updateCachedData }) => {
        try {
          if(getState().user.userDetails === null) throw new Error('not logged in');
          console.log('cache entry added');
          const userDetails = getState().user.userDetails;
          await cacheDataLoaded;
          const socket = getSocket(userDetails.userId);
          socket.on(CONNECT, () => {
            console.log('client - socketID:', socket.id);
          });
          socket.on(SYS_MESSAGE, (message) => {
            console.log(message);
          })
          socket.on(CONNECT_ERROR, (err) => {
            // will be invoked by the middleware if the user is not found
            console.log(err);
            socket.disconnect();
          });
          // event on recieving room data
          socket.on(EMIT_ROOM_DATA, (roomData) => {
            updateCachedData((draft) => {
              draft[roomData.roomId] = roomData 
            });
          });
          // event on recieving message
          socket.on(SEND_MESSAGE, (newMessage) => {
            const { roomId } = newMessage;
            updateCachedData((draft) => {
              draft[roomId].lastUpdateAt = newMessage.sentAt;
              draft[roomId].messages.push(newMessage);
            })
          })
          await cacheEntryRemoved;
          console.log('cache entry removed');
        } catch(err) {
          // if cacheEntryRemoved resolved before cacheDataLoaded, cacheDataLoaded throws
          console.log('error', err);
        }
      }
    }),
    createRoom: builder.mutation({
      queryFn: ({ userId, participatingUsers, roomName }) => new Promise((resolve, reject) => {
        const socket = getSocket(userId);
        socket.emit(CREATE_NEW_ROOM, { participatingUsers, roomName, timestamp: Date.now() }, (err, messageObject) => {
          if(err) reject(err.error);
          else resolve({ data: messageObject });
        });
      }),
      onQueryStarted: async ({ userId, roomName }, { getState, queryFulfilled }) => {
        try {
          const result = await queryFulfilled;
          console.log(result);
        } catch (err) {
          console.log(err);
        }
      }
    }),
    createDM: builder.mutation({
      queryFn: ({ userId, toUserId }) => new Promise((resolve, reject) => {
        const socket = getSocket(userId);
        socket.emit(CREATE_NEW_DM, { userId, toUserId, timestamp: Date.now() }, (err, message) => {
          if(err) reject(err.error);
          else resolve({ data: message });
        });
      }),
      onQueryStarted: async ({ userId, toUserId }, { getState, queryFulfilled }) => {
        try {
          const result = await queryFulfilled;
          console.log(result);
        } catch (err) {
          console.log(err);
        }
      }
    }),
    sendMessage: builder.mutation({
      queryFn: ({ message, userId, roomId }) => new Promise((resolve, reject) => {
        const socket = getSocket(userId);
        socket.emit(SEND_MESSAGE, { message, roomId, timestamp: Date.now() }, (err, message) => {
          if(err) reject(err.error);
          else resolve({ data: message });
        });
      }),
      onQueryStarted: async ({ roomId }, { queryFulfilled, getState, dispatch }) => {
        try {
          const { data: message } = await queryFulfilled;
          // pessimistic addition of new message sent by this user
          dispatch(
            messageApi.util.updateQueryData('getMessages', undefined, (draft) => {
              draft[roomId].lastUpdateAt = message.sentAt;
              draft[roomId].messages.push(message);
            })
          )
        } catch (err) {
          console.log(err);
        }
      }
    }),
    joinRoom: builder.mutation({
      queryFn: ({ userId, roomId }) => new Promise((resolve, reject) => {
        const socket = getSocket(userId);
        socket.emit(JOIN_ROOM, { roomId }, (err, message) => {
          if(err) reject(err.error);
          else resolve({ data: message });
        });
      }),
      onQueryStarted: async (args, { getState, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log(data);
        } catch(err) {
          console.log(err);
        }
      }
    }),
    openRoomAcknowledge: builder.mutation({
      queryFn: ({ roomId, userId }) => new Promise((resolve, reject) => {
        const socket = getSocket(userId);
        socket.emit(SEND_ROOM_ACKNOWLEDGEMENT, { roomId, timestamp: Date.now() }, (err, message) => {
          if(err) reject(err.error);
          else resolve({ data: message });
        })
      }),
      onQueryStarted: async ({ roomId }, { getState, dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log(data);
          dispatch(
            messageApi.util.updateQueryData('getMessages', undefined, (draft) => {
              draft[roomId].lastOpenedAt = data.timestamp;
            })
          );
        } catch(err) {
          console.log(err);
        }
      }
    })
  })
})

export const {
  useGetMessagesQuery,
  useCreateRoomMutation,
  useSendMessageMutation,
  useJoinRoomMutation,
  useOpenRoomAcknowledgeMutation,
  useCreateDMMutation,
} = messageApi;