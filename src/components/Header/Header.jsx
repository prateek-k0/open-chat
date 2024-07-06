import { useSelector } from 'react-redux'
import { userDetailsSelector } from '../../store/slices/UserDetailsSlice'
import { useLogoutMutation } from '../../api/UserAuthApi'
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Modal from '../Modal/Modal';
import CreateNewChat from '../CreateNewChat/CreateNewChat';
import JoinChat from '../JoinChat/JoinChat';
import CreateNewDM from '../CreatNewDM/CreateNewDM';
import IconPersonCircle from '../../common/Icons/IconPersonCircle';

const Header = () => {
  const userDetails = useSelector(userDetailsSelector);
  const [logoutTrigger] = useLogoutMutation();
  const [profilePopupState, setProfilePopupState] = useState(false);
  const [modalState, setModalState] = useState(false);
  const [isCreateRoomContent, setIsCreateRoomContent] = useState(true);
  const [isCreateDM, setIsCreateDM] = useState(false);

  const logoutHandler = () => {
    logoutTrigger({ email: userDetails?.email || '' });
    setProfilePopupState(false);
  }

  const createRoomHandler = () => {
    setIsCreateRoomContent(true);
    setIsCreateDM(false);
    setModalState(true);
  }
  const createDMHandler = () => {
    setIsCreateRoomContent(true);
    setIsCreateDM(true);
    setModalState(true);
  }

  const joinRoomHandler = () => {
    setIsCreateRoomContent(false);
    setModalState(true);
  }

  return (
    <div 
      className='relative flex px-8 py-2 bg-slate-800 text-white items-center justify-between font-mono header' 
      style={{ height: '64px', maxHeight: '64px' }}
      onClick={(event) => {
        if(!event.target.closest('.profile-button')) {
          setProfilePopupState(false);
        } else {
          // 
        }
      }}
    >
      <Link to="/">
        <p className='text-2xl  font-semibold hover:text-gray-300 hover:transition-all'>
          Open Chat
        </p>
      </Link>
      {userDetails !== null && <button 
        className='text-white hover:bg-slate-600 rounded-full px-1 py-1 transition-colors profile-button'
        onClick={() => setProfilePopupState(p => !p)}
        >
          <IconPersonCircle width="28" height="28" />
        </button>}
      {profilePopupState === true && (
        <ul className='absolute bg-slate-800 text-white py-2 px-2 flex flex-col items-start right-8 top-14 border border-gray-500 w-56 transition-all'>
          <li 
            onClick={logoutHandler}
            className='px-2 hover:text-gray-300  cursor-pointer hover:border-gray-500 w-full text-right border-b border-transparent'
          >
            Logout
          </li>
          <li 
            onClick={createRoomHandler}
            className='px-2 hover:text-gray-300  cursor-pointer hover:border-gray-500 w-full text-right border-b border-transparent'
          >
            Create New Room
          </li>
          <li 
            onClick={joinRoomHandler}
            className='px-2 hover:text-gray-300  cursor-pointer hover:border-gray-500 w-full text-right border-b border-transparent'
          >
            Join Existing Room
          </li>
          <li 
            onClick={createDMHandler}
            className='px-2 hover:text-gray-300  cursor-pointer hover:border-gray-500 w-full text-right border-b border-transparent'
          >
            Create DM
          </li>
        </ul>
      )}
      {modalState === true && <Modal onClose={() => setModalState(false)}>
        {isCreateRoomContent === true ? 
          isCreateDM === true ? <CreateNewDM onComplete={() => setModalState(false)} /> : <CreateNewChat onComplete={() => setModalState(false)}/> 
          : <JoinChat onComplete={() => setModalState(false)} />
        }  
      </Modal>}
    </div>
  )
}

export default Header