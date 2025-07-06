import { NavLink } from 'react-router-dom'
import { assets } from '../utils/assets'
import { useAppContext } from '../context/AppContext'
import { BriefcaseBusiness, ComponentIcon, LucideBookMarked, LucideSquarePlus, MessageCircleMoreIcon } from 'lucide-react';

const Sidebar = () => {
    const { role } = useAppContext();
    const isAdmin = role === 'admin';

    return (
        <div className='flex flex-col border-r border-gray-200 min-h-full pt-6'>
            <NavLink end={true} to="/profile" className={({ isActive }) => `flex items-center gap-3 px-3 py-3.5 md:px-9 md:min-w-64 cursor-pointer ${isActive && 'bg-primary/10 border-r-4 text-primary border-primary'}`}>
                <img src={assets.home_icon} alt="Home" className='w-5 min-w-4' />
                <p className='hidden md:inline-block'>Dashboard</p>
            </NavLink>

            <NavLink to="/profile/addBlog" className={({ isActive }) => `flex items-center gap-3 px-3 py-3.5 md:px-9 md:min-w-64 cursor-pointer ${isActive && 'bg-primary/10 border-r-4 text-primary border-primary'}`}>
                <LucideSquarePlus className='w-5 min-w-4' />
                <p className='hidden md:inline-block'>Add blogs</p>
            </NavLink>

            <NavLink to="/profile/blogsVault" className={({ isActive }) => `flex items-center gap-3 px-3 py-3.5 md:px-9 md:min-w-64 cursor-pointer ${isActive && 'bg-primary/10 border-r-4 text-primary border-primary'}`}>
                <LucideBookMarked className='w-5 min-w-4' />
                <p className='hidden md:inline-block'>Blogs Vault</p>
            </NavLink>

            <NavLink to="/profile/comments" className={({ isActive }) => `flex items-center gap-3 px-3 py-3.5 md:px-9 md:min-w-64 cursor-pointer ${isActive && 'bg-primary/10 border-r-4 text-primary border-primary'}`}>
                <MessageCircleMoreIcon className='w-5 min-w-4' />
                <p className='hidden md:inline-block'>Comments</p>
            </NavLink>
            {isAdmin && <NavLink to="/profile/events" className={({ isActive }) => `flex items-center gap-3 px-3 py-3.5 md:px-9 md:min-w-64 cursor-pointer ${isActive && 'bg-primary/10 border-r-4 text-primary border-primary'}`}>
                <ComponentIcon className='w-5 min-w-4' />
                <p className='hidden md:inline-block'>Events</p>
            </NavLink>}
            {isAdmin && <NavLink to="/profile/jobs" className={({ isActive }) => `flex items-center gap-3 px-3 py-3.5 md:px-9 md:min-w-64 cursor-pointer ${isActive && 'bg-primary/10 border-r-4 text-primary border-primary'}`}>
                <BriefcaseBusiness className='w-5 min-w-4' />
                <p className='hidden md:inline-block'>Jobs</p>
            </NavLink>}
        </div>
    )
}

export default Sidebar