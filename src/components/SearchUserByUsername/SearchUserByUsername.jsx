import { useState, useEffect } from 'react'
import { useLazyFetchUserFromUsernameQuery } from '../../api/UserAuthApi';

const SearchUserByUsername = ({ onClick = () => {}, excludeUsers = [] }) => {
  const [usernameQuery, setUsernameQuery] = useState('');
  const [searchUsernameQuery, { data, isFetching, error }] = useLazyFetchUserFromUsernameQuery();
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if(usernameQuery !== '') {
      searchUsernameQuery(usernameQuery);
      setShowSuggestions(true);
    }
  }, [usernameQuery, searchUsernameQuery]);

  const onSuggestionClick = (user) => {
    setShowSuggestions(false);
    onClick(user);
  }

  const viewData = data !== undefined ? data.users.filter((user) => excludeUsers.includes(user.userId) === false) : [];

  const usersHTML = viewData.map((user) => (
    <div key={user.userId} 
      onClick={() => onSuggestionClick(user)}
      className='px-4 py-1 w-full hover:bg-slate-500 cursor-pointer flex items-center justify-between'>
      {user.username}
      <p className='m-0 text-gray-300 w-40 text-sm text-ellipsis overflow-hidden whitespace-nowrap'>ID: {user.userId}</p>
    </div>)
  );

  return (
    <div className='relative container'>
      <input type="text" id="username-query"
          className='border h-10 w-full px-4 outline-none rounded-md font-mono text-black' 
          placeholder="Enter username to search"
          value={usernameQuery} onChange={(e) => setUsernameQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
        />
      {isFetching === true && <div>Loading</div>}
      {showSuggestions === true && usernameQuery !== '' && data !== undefined && !isFetching && !error && (
        <div className='absolute suggestions w-full border border-gray-100 bg-slate-600 max-h-32 overflow-auto'>
          {viewData.length > 0 ? usersHTML : 'No Users Found!'}
        </div>
      )}
    </div>
  )
}

export default SearchUserByUsername