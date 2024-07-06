import { useState } from 'react'
import { userDetailsSelector } from '../../store/slices/UserDetailsSlice';
import { useSelector } from 'react-redux';
import { useCreateRoomMutation } from '../../api/MessageApi';
import SearchUserByUsername from '../SearchUserByUsername/SearchUserByUsername';

const CreateNewChat = ({ onComplete = () => {} }) => {
  const userDetails = useSelector(userDetailsSelector);
  const [createRoomTrigger, { isLoading: createRoomLoading }] = useCreateRoomMutation();
  const [newRoomName, setNewRoomName] = useState('');
  const [participatingUsersList, setParticipatingUsersList] = useState([]);

  const searchUserHandler = (user) => {
    setParticipatingUsersList((uList) => uList.concat(user));
  }
  
  const participatingUsers = participatingUsersList.map((user) => user.userId).concat(userDetails.userId);

  const createRoomHandler = async () => {
    try {
      newRoomName !== '' && await createRoomTrigger({ userId: userDetails.userId, participatingUsers, roomName: newRoomName }).unwrap();
      setNewRoomName('');
      onComplete();
    } catch(err) {
      console.log(err);
    }
  }

  const onRemoveUser = (user) => {
    setParticipatingUsersList((userList) => userList.filter(u => u.userId !== user.userId))
  }

  return (
    <div className='flex flex-col gap-4 text-white min-w-96 w-8/12'>
      <p className='font-semibold font-sans text-2xl mb-2'>Create New Room</p>
      <div className='flex flex-col gap-6'>
        <input type='text' id="create-new-room" 
          className='border h-10 w-full px-4 outline-none rounded-md font-mono text-black' 
          placeholder="Enter name for new room" 
          value={newRoomName} onChange={(e) => setNewRoomName(e.target.value)} 
        />
        <div className='flex flex-col gap-4'>
        <p className="text-xl">Add Users</p>
        <div className="flex flex-wrap gap-2 added-users">
          {participatingUsersList.map((user) => (<div key={user.userId} className='flex items-center w-fit'>
            <p className='bg-slate-500 px-2 py-1'>{user.username}</p>
            <button className='bg-slate-600 w-8 h-8 text-center text-xl hover:bg-slate-800 cursor-pointer' onClick={() => onRemoveUser(user)}>&times;</button>
          </div>))}
        </div>
        <SearchUserByUsername onClick={searchUserHandler} excludeUsers={participatingUsers} />
        </div>
        <button 
          className='ml-auto rounded-md w-max whitespace-nowrap border h-10 text-slate-800 bg-white font-semibold hover:bg-slate-800 hover:text-white px-4 py-2 disabled:bg-slate-300 disabled:text-slate-500'
          onClick={createRoomHandler} 
          disabled={newRoomName === '' || createRoomLoading === true}
        >Add Room</button>
      </div>
    </div>
  )
}

export default CreateNewChat