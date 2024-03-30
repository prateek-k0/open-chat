import React from 'react'
import { useFetchUserDetailsQuery } from '../../api/UserAuthApi'

const FetchUserName = ({ userId }) => {
  const { data, isFetching, error } = useFetchUserDetailsQuery(userId);
  if(!data || isFetching || error) return <></>
  const { user } = data;
  return (
    <>{user.username}</>
  )
}

export default FetchUserName