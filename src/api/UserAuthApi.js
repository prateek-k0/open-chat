import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { updateToken, updateUser } from '../store/slices/UserDetailsSlice';

/*
General template for extending rtk query's fetchBaseQuery:

const rawBaseQuery = fetchBaseQuery({ baseUrl });

const extendedBaseQuery = (args, api, extraOptions) => {
  const results = rawBaseQuery(args, api, extraOptions);
  // do something with the results
  return results;
}
*/

/*
The server, on signup and login sends back 2 tokens: 
1. access token - expiry of around 10-15 mins, sent back in response
2. refresh token - expiry of days, sent back as a response cookie

so for /refresh, we dont need to send credentials to generate a new access token, if
the refresh token is not expired, a new access token can be generated from the refresh token
itself.
*/

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:3500'; // 127.0.0.1, since loclhost has issues with using cookies

// dynamically constructing baseQuery, to include updated token for each call
const rawBaseQuery = fetchBaseQuery({ 
  baseUrl: BASE_URL,
  credentials: 'include', // to allow to set cookies
  prepareHeaders: (headers, { getState }) => {  // will be called on every call of rawBaseQuery, to get updated values of userDetails
    // headers.set('Access-Control-Allow-Origin', '*'); // doesnt allow to use cookies
    if(getState().user.userDetails !== null) {
      headers.set('Authorization', `Bearer ${getState().user.userDetails.token}`);
    }
    return headers
  }
});

const baseQueryWithTokenAuth = async (args, api, extraOptions) => {
  const argObject = typeof args === 'string' ? { url: args } : args;
  console.log(argObject);
  // try fetching once  
  let results = await rawBaseQuery(argObject, api, extraOptions);
  // check if there is error due to invalid token (generally errorcode is 401 / 403)
  if(results.error && results.error.status === 403) {
    // try fetching a new token
    const token = await rawBaseQuery(
      { ...argObject, url: '/refresh', method: 'GET' },
      api,
      extraOptions
    );
    if(token.error === undefined) { // if no error in fetching a new token, save the new token
      api.dispatch(updateToken(token.data.token));
      // refetch results with new token
      results = await rawBaseQuery(argObject, api, extraOptions);
    } else {
      // logout
      api.dispatch(updateUser(null));
    }
  }
  return results;
}

export const UserAuthApiSlice = createApi({
  reducerPath: 'userAuthApi',
  baseQuery: baseQueryWithTokenAuth,
  endpoints: (builder) => ({})
});

UserAuthApiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    signUp: builder.mutation({
      query: ({ username, email, password }) => ({
        url: '/signup',
        method: 'POST',
        body: { username, email, password }
      }),
      onQueryStarted: async (args, { queryFulfilled, getState, dispatch }) => {
        try {
          const response = await queryFulfilled;
          console.log(response);
        } catch (err) {
          console.log(err.error?.data || err.error);
        }
      },
    }),
    login: builder.mutation({
      query: ({ email, password }) => ({
        method: 'POST',
        url: '/login',
        body: { email, password }
      }),
      onQueryStarted: async (args, { queryFulfilled, getState, dispatch }) => {
        try {
          const response = await queryFulfilled;
          console.log(response);
          dispatch(updateUser(response.data.user));
        } catch (err) {
          console.log(err.error?.data || err.error);
        }
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/logout',
        method: 'GET',
      }),
      onQueryStarted: async (args, { queryFulfilled, getState, dispatch }) => {
        try {
          const result = await queryFulfilled;
          console.log(result);
        } catch (err) {
          console.log(err);
        } finally {
          dispatch(updateUser(null));
        }
      },
    }),
    testToken: builder.mutation({
      query: () => ({
        url: '/test',
        method: 'GET',
      }),
      onQueryStarted: async (args, { queryFulfilled, getState, dispatch }) => {
        try {
          const result = await queryFulfilled;
          console.log(result);
        } catch (err) {
          console.log(err);
        }
      },
    }),
    fetchUserFromUsername: builder.query({
      query: (userNameQuery) => ({
        url: `/users?q=${userNameQuery}`,
        method: 'GET',
      }),
      onQueryStarted: async (args, { queryFulfilled, getState, dispatch }) => {
        try {
          const result = await queryFulfilled;
          // console.log(result);
        } catch (err) {
          console.log(err);
        }
      },
    }),
    fetchUserDetails: builder.query({
      query: (userId) => ({
        url: `/user?id=${userId}`,
        method: 'GET'
      }),
      providesTags: (result, error, arg) => [{ type: 'User', id: arg }],
      onQueryStarted: async (args, { queryFulfilled, getState, dispatch }) => {
        try {
          const result = await queryFulfilled;
          // console.log(result);
        } catch (err) {
          console.log(err);
        }
      },
    })
  })
});

export const {
  useSignUpMutation,
  useLoginMutation,
  useLogoutMutation,
  useTestTokenMutation,
  useLazyFetchUserFromUsernameQuery,
  useFetchUserDetailsQuery,
} = UserAuthApiSlice