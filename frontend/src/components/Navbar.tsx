import { assets } from '../utils/assets'
import { useAppContext } from '../context/AppContext';

const Navbar = () => {
    const { navigate, token } = useAppContext();

    return (
        <div className='flex justify-between items-center py-5 mx-4 sm:mx-20 xl:mx-32'>
            <h1 onClick={() => navigate('/')} className="text-2xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 to-blue-700 text-transparent bg-clip-text drop-shadow-lg">HR Stack</h1>
            <button onClick={() => navigate('/profile')} className='flex items-center gap-2 rounded-full text-xs sm:text-sm cursor-pointer bg-primary font-medium text-white px-5 sm:px-10 py-1.5 sm:py-2.5'>{token !== null ? 'Dashboard' : 'Login'}<img src={assets.arrow} className='w-3' alt='arrow' /></button>
        </div>
    )
}

export default Navbar