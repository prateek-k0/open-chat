import React from 'react'
import { useTestTokenMutation } from '../../api/UserAuthApi'
import { userDetailsSelector } from '../../store/slices/UserDetailsSlice';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Login from '../Login/Login';

const Home = () => {
  const userDetails = useSelector(userDetailsSelector);
  const [testTrigger] = useTestTokenMutation();

  const onClickHandler = () => {
    userDetails !== null && testTrigger({ email: userDetails.email });
  }

  // jsx for testing token
  const testJSX = <button onClick={onClickHandler}>Test Token</button>;
  
  return (
    <div className='py-20 flex justify-center font-mono gap-y-8'>
      {/* {userDetails !== null && testJSX} */}
      <div className='flex items-center flex-col login-banner'>
        <p className="text-5xl font-semibold mb-8 text-center title">
          Welcome to Open Chat!
        </p>
        <p className="text-center text-2xl font-light text-gray-200 description">
          Please login to continue.
        </p>
        <Link className='border-b border-transparent hover:border-slate-500 hover:text-slate-200 text-slate-500 text-lg w-fit' to="/signup">
          or signup instead
        </Link>
        <Login />
        
      </div>
    </div>
  )
}

export default Home