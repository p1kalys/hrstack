import { assets } from '../utils/assets'
import { useAppContext } from '../context/AppContext';
import { useMemo } from 'react';

const Navbar = () => {
    const { navigate, token } = useAppContext();
    const activePage = useMemo(() => {
        if (location.pathname.includes('/events')) return 'Events';
        return 'News';
    }, [location.pathname]);

    const handleClick = (page: string) => {
        if (page === 'News') {
            navigate('/')
        } else {
            navigate(`/${page.toLowerCase()}`);
        }
    }

    return (
        <>
            <div className='flex justify-between items-center py-5 mx-4 sm:mx-20 xl:mx-32'>
                <h1 onClick={() => navigate('/')} className="text-2xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 to-blue-700 text-transparent bg-clip-text drop-shadow-lg">HR Stack</h1>
                <button onClick={() => navigate('/profile')} className='flex items-center gap-2 rounded-full text-xs sm:text-sm cursor-pointer bg-primary font-medium text-white px-5 sm:px-10 py-1.5 sm:py-2.5'>{token !== null ? 'Dashboard' : 'Login'}<img src={assets.arrow} className='w-3' alt='arrow' /></button>
            </div>
            <div className='w-screen flex items-center sticky top-4 justify-center z-20'>
                <div className='flex bg-white px-1 py-1 border border-primary/30 shadow-md rounded-full gap-2'>
                    {['News', 'Events'].map((it) => (
                        <div
                            key={it}
                            onClick={() => handleClick(it)}
                            className={`text-xs sm:text-base font-medium px-3 sm:px-4 py-1.5 rounded-full cursor-pointer transition-all shadow-sm
                                ${activePage === it
                                    ? 'bg-primary text-white hover:bg-primary/90'
                                    : 'bg-white text-primary border border-primary/30 hover:bg-primary/10'}`}
                        >
                            {it}
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Navbar