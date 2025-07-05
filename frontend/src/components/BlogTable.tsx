import React from 'react'
import { assets } from '../utils/assets';
import type { TableProps } from '../interfaces/interface';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Table: React.FC<TableProps> = ({ blog, fetchBlogs, index }) => {
  const {title, createdAt} = blog;
  const BlogDate = new Date(createdAt);

  const {axios} = useAppContext();

  const deleteBlog = async () => {
    const confirm = window.confirm('Are you sure you want to delete this blog?')
    if (!confirm) return;

    try {
      const { data} = await axios.post(`/api/blog/delete/${blog._id}`)
      if (data.success) {
        toast.success(data.message);
        await fetchBlogs()
      } else {
        toast.error(data.message)
      }
    } catch(error: any) {
      toast.error(error.message)
    }
  }

  const togglePublish = async () => {
    try {
      const {data} = await axios.post(`/api/blog/toggle-publish/${blog._id}`);
    if (data.success) {
        toast.success(data.message);
        await fetchBlogs()
      } else {
        toast.error(data.message)
      }
    } catch(error: any) {
      toast.error(error.message)
    }
    
  }
  return (
    <tr className='border-y border-gray-300'>
      <th className='px-2 py-4'>{index}</th>
      <td className='px-2 py-4 max-w-[220px]'>{title}</td>
      <td className='px-2 py-4 max-sm:hidden'>{BlogDate.toDateString()}</td>
      <td className='px-2 py04 max-sm:hidden'>
        <p className={`${blog.isPublished ? "text-green-600" : "text-orange-700"}`}>{blog.isPublished ? 'Published' : 'Unpublished'}</p>
      </td>
      <td className='px-2 py-4 flex text-xs gap-3'>
        <button onClick={togglePublish} className='border px-2 py-0.5 mt-1 rounded cursor-pointer'>{blog.isPublished ? 'Unpublish':'Publish'}</button>
        <img onClick={deleteBlog} src={assets.cross_icon} className='w-8 hover:scale-110 transition-all cursor-pointer' alt='Delete icon' />
      </td>
    </tr>
  )
}

export default Table