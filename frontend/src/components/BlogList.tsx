import { useState } from 'react';
import { blogCategories } from '../utils/assets';
import { motion } from "motion/react"
import BlogCard from './BlogCard';
import { useAppContext } from '../context/AppContext';

const BlogList = () => {
    const [menu, setMenu] = useState('All');
    const { blogs, input } = useAppContext();

    const filteredBlogs = () => {
        if (!input.trim()) return blogs;

        const query = input.toLowerCase();

        return blogs.filter((blog) =>
            blog.title.toLowerCase().includes(query) ||
            blog.category.some((cat: string) => cat.toLowerCase().includes(query))
        );
    };

    return (
        <div>
            <div className='flex justify-center gap-4 sm:gap-8 my-10 mx-4 flex-wrap relative'>
                {blogCategories.map((category, index) => (
                    <div key={index} className='relative'>
                        <button onClick={() => setMenu(category)} className={`cursor-pointer text-gray-500 ${menu === category && 'text-white px-4 pt-0.5'}`}>
                            {category}
                            {menu === category && <motion.div layoutId='underline' transition={{ type: 'spring', stiffness: 500, damping: 30 }} className='absolute left-0 right-0 top-0 h-7 -z-1 bg-primary rounded-full'></motion.div>}
                        </button>
                    </div>
                ))}
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-18 mx-8 sm:mx-16 xl:mx-40'>
                {filteredBlogs().filter((blog) => menu === 'All' ? true : blog.category.includes(menu)).map((blog) => <BlogCard key={blog._id} blog={blog} />)}
            </div>
        </div>
    )
}

export default BlogList