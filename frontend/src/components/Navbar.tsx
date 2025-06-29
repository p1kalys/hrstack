import { assets } from '../utils/assets'
import { useAppContext } from '../context/AppContext';

const Navbar = () => {
    const { navigate, token } = useAppContext();

    return (
        <div className='flex justify-between items-center py-5 mx-8 sm:mx-20 xl:mx-32'>
            <img onClick={() => navigate('/')} src={assets.logo} alt="Logo" className='w-22 sm:w-36 cursor-pointer' />
            {token && <button onClick={() => navigate('/profile')} className='flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-10 py-2.5'>{'Dashboard'}<img src={assets.arrow} className='w-3' alt='arrow' /></button>}
        </div>
    )
}

export default Navbar