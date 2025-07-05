import { useEffect, useState } from 'react';
import { blogCategories } from '../utils/assets';
import { motion } from "motion/react"
import BlogCard from './BlogCard';
import { useAppContext } from '../context/AppContext';
import type { Blog } from '../interfaces/interface';
import toast from 'react-hot-toast';
import { PropagateLoader } from 'react-spinners';

const BlogList = () => {
    const [menu, setMenu] = useState('All');
    const { input, axios } = useAppContext();
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 30;

    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true);
            if (input.trim()) setPage(1);
            try {
                let url = `/api/blog/all?page=${page}&limit=${limit}`;
                if (input.trim()) url += `&search=${input}`;
                if (menu !== 'All') url += `&category=${menu}`;
                const { data } = await axios.get(url);
                if (data.success) {
                    setBlogs(data.blogs);
                    setTotal(data.pagination.total);
                    setTotalPages(data.pagination.totalPages);
                } else {
                    toast.error(data.message || "Failed to fetch blogs");
                }
            } catch (error: any) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [page, input, menu]);


    return (loading ? <div className="flex items-center justify-center h-screen w-screen">
        <PropagateLoader color='#2563eb' />
    </div> :
        <div>
            <div className="overflow-x-auto scrollbar-hide w-full">
                <div className='flex justify-start sm:justify-center gap-4 sm:gap-6 my-4 mx-4 flex-nowrap min-w-max'>
                    {blogCategories.map((category, index) => (
                        <div key={index} className='relative'>
                            <button onClick={() => {setMenu(category),setPage(1)}} className={`cursor-pointer text-xs sm:text-base text-gray-500 ${menu === category && 'text-white px-2 sm:px-4 pt-0.5'}`}>
                                {category}
                                {menu === category && <motion.div layoutId='underline' transition={{ type: 'spring', stiffness: 500, damping: 30 }} className='absolute left-0 right-0 top-1 sm:top-0 h-5 sm:h-7 -z-1 bg-primary rounded-full'></motion.div>}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-6 mb-18 mx-8 sm:mx-16 xl:mx-40'>
                {blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
            </div>
            <div className="flex justify-center items-center my-8 gap-4">
                <button
                    className="px-3 py-1.5 bg-primary text-white rounded disabled:opacity-50"
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                >
                    Previous
                </button>
                <span className="text-sm font-medium text-gray-600">Page {total === 0 ? 0 : page} of {totalPages}</span>
                <button
                    className="px-3 py-1.5 bg-primary text-white rounded disabled:opacity-50"
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page >= totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    )
}

export default BlogList