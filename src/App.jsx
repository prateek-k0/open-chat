import { useSelector } from 'react-redux'
import { userDetailsSelector } from './store/slices/UserDetailsSlice'
import Header from './components/Header/Header.jsx'
import { Outlet, Routes, Route, Navigate } from 'react-router'
import Login from './components/Login/Login.jsx'
import Signup from './components/Signup/Signup.jsx'
import Home from './components/Home/Home.jsx'
import ChatList from './components/ChatList/ChatList.jsx'
import Error404 from './components/Error404/Error404.jsx'

const ProtectedRouteOutlet = ({ condition = false }) => {
  if(condition) return <Outlet />;
  return <Navigate to="/" />
}

const App = () => {
  const userDetails = useSelector(userDetailsSelector);

  const Layout = (
    <div className="h-screen overflow-hidden">
      <Header />
      <div className='text-white bg-slate-900 content' style={{ height: 'calc(100vh - 64px)', maxHeight: 'calc(100vh - 64px)' }}>
        <Outlet />
      </div>
    </div>
  )
  return (
    <Routes>
      <Route path="/" element={Layout}>
        <Route index={true} element={<Home />}></Route>
        <Route path="signup" element={<Signup />}></Route>
        <Route element={<ProtectedRouteOutlet condition={userDetails !== null} />}>
          <Route path='/chat' element={<ChatList />} />
        </Route>
        <Route path="*" element={<Error404 />} />
      </Route>
    </Routes>
  )
}

export default App