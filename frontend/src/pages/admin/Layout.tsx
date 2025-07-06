import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/Sidebar';
import useAutoLogout from '../../context/AutoLogOut';
import { useAppContext } from '../../context/AppContext';

const Layout = () => {
  useAutoLogout();
  const { axios, setToken, navigate } = useAppContext();

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
        <h1 onClick={() => navigate('/')} className="text-2xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 to-blue-700 text-transparent bg-clip-text cursor-pointer drop-shadow-lg">HR Stack</h1>
        <button onClick={logout} className='text-xs sm:text-sm rounded-full cursor-pointer bg-primary text-white px-5 sm:px-10 py-1.5 sm:py-2.5'>Logout</button>
      </div>
      <div className='flex  h-[calc(100vh-70px)]'>
        <Sidebar />
        <Outlet />
      </div>
    </>
  )
}

export default Layout