import { useState } from "react";
import { useSelector } from 'react-redux';
import { userDetailsSelector } from "../../store/slices/UserDetailsSlice";
import { useJoinRoomMutation } from "../../api/MessageApi";

const JoinChat = ({ onComplete = () => {} }) => {
  const userDetails = useSelector(userDetailsSelector);
  const [roomId, setRoomId] = useState('');
  const [joinRoomTrigger, { error, isLoading: isJoinRoomLoading }] = useJoinRoomMutation();

  const joinRoomHandler = async () => {
    if(roomId !== '') {
      try {
        await joinRoomTrigger({ roomId, userId: userDetails.userId }).unwrap();
        setRoomId('');
        onComplete();
      } catch(err) {
        console.log(err);
      }
    }
  }

  return (
    <div className='flex flex-col gap-4 text-white min-w-96 w-8/12'>
      <p className='font-semibold font-sans text-2xl mb-2'>Join Existing Room</p>
      <div className='flex flex-col gap-6'>
      {error && <div className=' text-red-500 font-mono text-xl font-semibold text-center'>Error: {error?.message || 'Error'}</div>}
        <input type='text' id="create-new-room" 
          className='border h-10 w-full px-4 outline-none rounded-md font-mono text-black'  
          placeholder="Enter Room ID" 
          value={roomId} onChange={(e) => setRoomId(e.target.value)} 
        />
        <button 
          className='ml-auto rounded-md w-max whitespace-nowrap border h-10 text-slate-800 bg-white font-semibold hover:bg-slate-800 hover:text-white px-4 py-2 disabled:bg-slate-300 disabled:text-slate-500'
          onClick={joinRoomHandler} 
          disabled={roomId === '' || isJoinRoomLoading === true}
        >Join</button>
      </div>
    </div>
  )
}

export default JoinChat