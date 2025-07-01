import { useEffect, useState } from 'react';
import { blogCategories } from '../utils/assets';
import { motion } from "motion/react"
import BlogCard from './BlogCard';
import { useAppContext } from '../context/AppContext';
import type { MergedFeed, RssFeedItem } from '../interfaces/interface';
import toast from 'react-hot-toast';
import { PropagateLoader } from 'react-spinners';

const BlogList = () => {
    const [menu, setMenu] = useState('All');
    const { blogs, input, axios } = useAppContext();
    const [feed, setFeed] = useState<RssFeedItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchExternalBlogs = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/api/blog/rss');
            if (data.success) {
                setFeed(data.feed.items);
                console.log('Fetched feed:', data.feed.items);
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchExternalBlogs();
    }, [])

    const filteredBlogs = () => {
        if (!input.trim()) return blogs;

        const query = input.toLowerCase();

        return blogs.filter((blog) =>
            blog.title.toLowerCase().includes(query) ||
            blog.category.some((cat: string) => cat.toLowerCase().includes(query))
        );
    };

    const mergedAndSortedItems: MergedFeed[] = [
        ...filteredBlogs().map(blog => ({
            type: "internal" as const,
            date: new Date(blog.createdAt),
            data: blog
        })),
        ...(feed.map(item => ({
            type: "rss" as const,
            date: new Date(item.isoDate),
            data: item
        })))
    ].sort((a, b) => b.date.getTime() - a.date.getTime());

    return (loading ? <div className="flex items-center justify-center h-screen w-screen">
        <PropagateLoader color='#2563eb' />
    </div> :
        <div>
            <div className="overflow-x-auto scrollbar-hide w-full">
                <div className='flex justify-start sm:justify-center gap-4 sm:gap-6 my-4 mx-4 flex-nowrap min-w-max'>
                    {blogCategories.map((category, index) => (
                        <div key={index} className='relative'>
                            <button onClick={() => setMenu(category)} className={`cursor-pointer text-xs sm:text-base text-gray-500 ${menu === category && 'text-white px-2 sm:px-4 pt-0.5'}`}>
                                {category}
                                {menu === category && <motion.div layoutId='underline' transition={{ type: 'spring', stiffness: 500, damping: 30 }} className='absolute left-0 right-0 top-1 sm:top-0 h-5 sm:h-7 -z-1 bg-primary rounded-full'></motion.div>}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-6 mb-18 mx-8 sm:mx-16 xl:mx-40'>
                {menu === 'All' && mergedAndSortedItems.map((item, index) => {
                    if (item.type === 'internal') {
                        return <BlogCard key={item.data._id} blog={item.data} />;
                    } else {
                        return (
                            <a
                                key={index}
                                href={item.data.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full rounded-lg overflow-hidden shadow hover:scale-102 hover:shadow-primary/25 duration-300 cursor-pointer"
                            >
                                <div className="p-5">
                                    <h5 className="mb-2 font-medium text-primary/90">{item.data.title}</h5>
                                    <p className="text-xs text-gray-600">
                                        {item.data.contentSnippet?.slice(0, 64) + '...'}
                                    </p>
                                    <p className='text-xs text-red-400 font-medium'>Read more</p>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Published on: {item.date.toLocaleDateString('en-GB')}
                                    </p>
                                </div>
                            </a>
                        );
                    }
                })}
                {menu !== 'All' && filteredBlogs().filter((blog) => blog.category.includes(menu)).map((blog) => <BlogCard key={blog._id} blog={blog} />)}
            </div>
        </div>
    )
}

export default BlogList