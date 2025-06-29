import React from 'react'
import type { CommentTableProps } from '../interfaces/interface'
import { assets } from '../utils/assets';
import toast from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';

const CommentTable: React.FC<CommentTableProps> = ({ comment, fetchComments }) => {
    const { blog, createdAt, _id } = comment;
    const BlogDate = new Date(createdAt);

    const { axios } = useAppContext()
    const approveComment = async () => {
        try {
            const { data } = await axios.post(`/api/profile/approve-comment/${_id}`);
            if (data.success) {
                toast.success(data.message);
                await fetchComments()
            } else {
                toast.error(data.message)
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    const deleteComment = async () => {
        try {
            const confirm = window.confirm('Are you sure you want to delete this comment?');
            if (!confirm) return;
            const { data } = await axios.post(`/api/profile/delete-comment/${_id}`);
            if (data.success) {
                toast.success(data.message);
                await fetchComments()
            } else {
                toast.error(data.message)
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    return (
        <tr className='border-y border-gray-300'>
            <td className='px-6 py-4'>
                <b className='font-medium text-gray-600'>Blog</b>: {blog.title}
                <br />
                <br />
                <b className='font-medium text-gray-600'>Name</b>: {comment.name}
                <br />
                <b className='font-medium text-gray-600'>Comment</b>: {comment.content}
            </td>
            <td className='px-6 py-4 max-sm:hidden'>
                {BlogDate.toLocaleDateString()}
            </td>
            <td className='px-6 py-4'>
                <div className='flex items-center gap-4'>
                    {!comment.isApproved ? <img onClick={approveComment} src={assets.tick_icon} alt='Approved' className='w-5 hover:scale-110 transition-all cursor-pointer' /> : <p className='text-xs border border-green-600 bg-green-100 text-green-600 rounded-full px-3 py-1'>Approved</p>}
                    <img onClick={deleteComment} src={assets.bin_icon} alt='Delete' className='w-5 hover:scale-110 transition-all cursor-pointer' />
                </div>
            </td>
        </tr>
    )
}

export default CommentTable