import React from 'react'
import type { BlogCardProps } from '../interfaces/interface';
import { useNavigate } from 'react-router-dom';

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
    const { title, description, category, _id } = blog;
    const navigate = useNavigate();

    return (
        <div onClick={() => navigate(`/blog/${_id}`)} className='w-full rounded-lg overflow-hidden pb-6 shadow hover:scale-102 hover:shadow-primary/25 duration-300 cursor-pointer'>
            {blog?.image && <img src={blog?.image} alt="Blog Image" className="aspect-video" />}
            <div className='p-5'>
                <h5 className='mb-2 font-medium text-gray-900'>{title}</h5>
                <p className='text-xs text-gray-600' dangerouslySetInnerHTML={{"__html": description.slice(0,80)}}></p>
            </div>
            <div className='flex items-center gap-3 mx-2 flex-wrap mt-1'>
                {category.map((cat, index) => <span key={index} className='ml-2 px-3 py-1 inline-block bg-primary/10 rounded-full text-primary text-xs'>{cat}</span>)}
            </div>
        </div>
    )
}

export default BlogCard