import React, { useState } from 'react'
import { useLoginMutation } from '../../api/UserAuthApi';
import { Navigate, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { userDetailsSelector } from '../../store/slices/UserDetailsSlice';

const Login = () => {
  const [email, setEmail] = useState('email@gmail.com');
  const [pass, setPass] = useState('password');
  const [signUpTrigger, { error, isSuccess, isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const submitHandler = async () => {
    try {
      await signUpTrigger({ password: pass, email }).unwrap();
      // navigate here
      setTimeout(() => {
        setEmail('');
        setPass('');
        navigate('/chat', { replace: true });
      }, 500);
    } catch (err) {
      // 
    }
  }

  return (
    <div className='flex flex-col mt-4 items-center form gap-y-4'>
      {error && <p className=' text-red-500 font-semibold text-xl error-message text-center'>
          {error?.data?.error ?? 'error'}
        </p>}
        {isSuccess && <p className="text-green-500 font-semibold text-xl success-message text-center">
          Login Successful! Redirecting ...
        </p>}
      {isLoading && <p className="text-slate-300 font-semibold text-xl success-message text-center">
          Loading ...
      </p>}
      <div className="flex flex-col items-start justify-start gap-y-2 field">
        <label htmlFor='email' className='text-slate-400 font-sans font-light text-md'>Email</label>
        <input 
          className='rounded-md px-4 py-2 text-slate-800 outline-none w-80'
          id="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Enter Email'
        />
      </div>
      <div className="flex flex-col items-start justify-start gap-y-2 field">
        <label htmlFor="password" className='text-slate-400 font-sans font-light text-md'>Password</label>
        <input 
          className='rounded-md px-4 py-2 text-slate-800 outline-none w-80'
          id="password" type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder='Enter Password'
        />
      </div>
      <button 
        className='text-white border rounded-md px-8 py-2 mt-4 hover:bg-white hover:text-slate-900 disabled:bg-gray-500 disabled:text-slate-900'
        type="submit" onClick={submitHandler} disabled={email === '' || pass === ''}
      >
        Login
      </button>
    </div>
  )
}

export default Login