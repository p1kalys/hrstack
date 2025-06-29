import { assets } from '../../utils/assets'
import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/Sidebar';
import useAutoLogout from '../../context/AutoLogOut';
import { useAppContext } from '../../context/AppContext';

const Layout = () => {
  useAutoLogout();
  const {axios, setToken, navigate} = useAppContext();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
    setToken(null);
    axios.defaults.headers.common['Authorization'] = null;
    navigate('/');
  }

  return (
    <>
      <div className='flex items-center justify-between py-2 h-[70px] px-4 sm:px-12 border-b border-gray-200'>
        <img src={assets.logo} alt="Logo" className='w-12 sm:w-20 cursor-pointer' onClick={() => navigate('/')} />
        <button onClick={logout} className='text-sm px-8 py-2 bg-primary text-white rounded-full cursor-pointer'>Logout</button>
      </div>
      <div className='flex  h-[calc(100vh-70px)]'>
        <Sidebar />
        <Outlet />
      </div>
    </>
  )
}

export default Layout