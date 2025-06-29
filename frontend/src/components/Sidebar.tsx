import { NavLink } from 'react-router-dom'
import { assets } from '../utils/assets'

const Sidebar = () => {
    return (
        <div className='flex flex-col border-r border-gray-200 min-h-full pt-6'>
            <NavLink end={true} to="/profile" className={({ isActive }) => `flex items-center gap-3 px-3 py-3.5 md:px-9 md:min-w-64 cursor-pointer ${isActive && 'bg-primary/10 border-r-4 border-primary'}`}>
                <img src={assets.home_icon} alt="Home" className='w-5 min-w-4' />
                <p className='hidden md:inline-block'>Dashboard</p>
            </NavLink>

            <NavLink to="/profile/addBlog" className={({ isActive }) => `flex items-center gap-3 px-3 py-3.5 md:px-9 md:min-w-64 cursor-pointer ${isActive && 'bg-primary/10 border-r-4 border-primary'}`}>
                <img src={assets.add_icon} alt="Add blog icon" className='w-5 min-w-4' />
                <p className='hidden md:inline-block'>Add blogs</p>
            </NavLink>

            <NavLink to="/profile/blogsVault" className={({ isActive }) => `flex items-center gap-3 px-3 py-3.5 md:px-9 md:min-w-64 cursor-pointer ${isActive && 'bg-primary/10 border-r-4 border-primary'}`}>
                <img src={assets.list_icon} alt="List icon" className='w-5 min-w-4' />
                <p className='hidden md:inline-block'>Blogs Vault</p>
            </NavLink>

            <NavLink to="/profile/comments" className={({ isActive }) => `flex items-center gap-3 px-3 py-3.5 md:px-9 md:min-w-64 cursor-pointer ${isActive && 'bg-primary/10 border-r-4 border-primary'}`}>
                <img src={assets.comment_icon} alt="Comment" className='w-5 min-w-4' />
                <p className='hidden md:inline-block'>Comments</p>
            </NavLink>
        </div>
    )
}

export default Sidebar