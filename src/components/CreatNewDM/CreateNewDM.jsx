import { useState } from 'react'
import { userDetailsSelector } from '../../store/slices/UserDetailsSlice'
import { useSelector } from 'react-redux';
import { useCreateDMMutation } from '../../api/MessageApi';
import SearchUserByUsername from '../SearchUserByUsername/SearchUserByUsername';

const CreateNewDM = ({ onComplete = () => {} }) => {
  const userDetails = useSelector(userDetailsSelector);
  const [createDMTrigger, { isLoading: createDMLoading, error }] = useCreateDMMutation();
  const [selectedUser, setSelectedUser] = useState(null);

  const createDMHandler = async () => {
    try {
      selectedUser !== null && await createDMTrigger({ userId: userDetails.userId, toUserId: selectedUser.userId }).unwrap();
      setSelectedUser(null);
      onComplete();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className='flex flex-col gap-4 text-white min-w-96 max-w-2xl'>
      <p className='font-semibold font-sans text-2xl mb-2'>Create New DM</p>
      <div className='flex flex-col gap-6'>
        {error && <div className=' text-red-500 font-mono text-xl font-semibold text-center'>Error: {error?.message || 'Error'}</div>}
        {selectedUser === null && <SearchUserByUsername onClick={(user) => setSelectedUser(user)} excludeUsers={[userDetails.userId]} />}
        {selectedUser && <div>
          <p className='font-mono text-xl mb-4'>Selected User: </p>
          <div className='flex items-center w-fit'>
            <p className='bg-slate-500 px-2 py-1'>{selectedUser.username}</p>
            <button className='bg-slate-600 w-8 h-8 text-center text-xl hover:bg-slate-800 cursor-pointer' onClick={() => setSelectedUser(null)}>&times;</button>
          </div>  
        </div>}
        <button 
          className='ml-auto rounded-md w-max whitespace-nowrap border h-10 text-slate-800 bg-white font-semibold hover:bg-slate-800 hover:text-white px-4 py-2 disabled:bg-slate-300 disabled:text-slate-500'
          onClick={createDMHandler} 
          disabled={createDMLoading || selectedUser === null}
        >Add DM</button>
      </div>
    </div>
  )
}

export default CreateNewDM