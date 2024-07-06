import { useState, useEffect } from 'react'
import { useGetMessagesQuery, useOpenRoomAcknowledgeMutation } from '../../api/MessageApi'
import ChatItem from '../ChatItem/ChatItem.jsx';
import ChatView from '../ChatView/ChatView.jsx';
import { useSelector } from 'react-redux';
import { userDetailsSelector } from '../../store/slices/UserDetailsSlice.js';
import IconBxArrowToRight from '../../common/Icons/IconBxArrowToRight.jsx';
import IconBxArrowToLeft from '../../common/Icons/IconBxArrowToLeft.jsx';

const ChatList = () => {
  const userDetails = useSelector(userDetailsSelector);
  const { data, error, isLoading } = useGetMessagesQuery();
  const [selectedChat, setSelectedChat] = useState(null);
  const [listBarState, setListBarState] = useState(true);
  const [sendRoomAck, { error: ackError }] = useOpenRoomAcknowledgeMutation();

  useEffect(() => {
    let intervalId = null;
    if(data !== null && selectedChat !== null && data[selectedChat.roomId].lastOpenedAt < data[selectedChat.roomId].lastUpdateAt) {
      intervalId = setInterval(() => {  // continuously update lastOpenedAt for rooms
        sendRoomAck({ roomId: selectedChat.roomId, userId: userDetails.userId });
      }, 100);
    }
    return () => {
      clearInterval(intervalId);
    }
  }, [sendRoomAck, userDetails, selectedChat, data]);

  if(isLoading === true) return <p>Loading Rooms Data</p>;
  if(error) return <div className='flex h-full font-mono text-center text-red-500 font-semibold text-xl'>Could not load Images</div>
  let roomJSX = <></>;
  const roomData = Object.values(data);
  
  const chatClickHandler = (room) => {
    setSelectedChat(room);
    sendRoomAck({ roomId: room.roomId, userId: userDetails.userId });
  }

  if(roomData.length === 0) {
    roomJSX = listBarState === false ? (<p className='text-l text-slate-500 text-center py-16 px-4'>
      Looks empty. Maybe you can start by creating a room yourself, or joining one.
    </p>) : <></>;
  } else {
    roomData.sort((roomA, roomB) => (roomB.lastUpdateAt) - (roomA.lastUpdateAt));
    roomJSX = (
      <>
        {/* <p className='text-2xl text-white px-8 py-4 w-16 font-semibold h-16'>{listBarState === true ? '' : 'Messages'}</p> */}
        <div className='max-w-full box-border px-2 py-2'>
          {roomData.map((room) => (
            <ChatItem key={`${room.roomId}#${room.lastUpdateAt}`} room={room} clickHandler={chatClickHandler} collapsed={listBarState} />
          ))}
        </div>
      </>
    );
  }

  return (
    <div className='flex h-full font-mono'>
      <div className={`${listBarState === false ? 'w-1/4 min-w-60' : 'w-16 max-w-16 min-w-16'} relative pb-16`}>
        {/* <CreateNewChat />
        <JoinChat /> */}
        <div className='overflow-y-auto overflow-x-auto max-h-full'>
          {roomJSX}
        </div>
        <button className="bottom-2 right-2 absolute trigger w-12 h-12 rounded-full bg-white text-slate-700 flex justify-center items-center font-bold text-xl" onClick={() => setListBarState(s => !s)}>
          {listBarState === true ? <IconBxArrowToRight width="24" height="24" /> : <IconBxArrowToLeft width="24" height="24" />}
        </button>
      </div>
      <div className='w-max flex-1 border-l-slate-700 border-l min-w-80'>
        {selectedChat !== null && <ChatView roomId={selectedChat.roomId} />}
      </div>
    </div>
  )
}

export default ChatList