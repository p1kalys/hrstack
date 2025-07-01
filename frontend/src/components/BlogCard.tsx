import React from 'react'
import type { BlogCardProps } from '../interfaces/interface';
import { useNavigate } from 'react-router-dom';

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
    const { title, description, createdAt, _id } = blog;
    const navigate = useNavigate();

    return (
        <div onClick={() => navigate(`/blog/${_id}`)} className='w-full rounded-lg shadow overflow-hidden hover:scale-102 hover:shadow-primary/25 duration-300 cursor-pointer'>
            <div className='p-5'>
                <h5 className='mb-2 font-medium text-primary/90'>{title}</h5>
                <p className='text-xs text-gray-600' dangerouslySetInnerHTML={{ "__html": description.slice(0, 70) + '...' }}></p>
                <p className='text-xs text-red-400'>Read more</p>
                <p className="text-xs text-gray-500 mt-1">
                    Published on: {new Date(createdAt).toLocaleDateString('en-GB')}
                </p>
            </div>
        </div>
    )
}

export default BlogCard