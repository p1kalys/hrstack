import React from 'react'
import type { JobTableProps } from '../interfaces/interface'
import { assets } from '../utils/assets';
import toast from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';

const JobTable: React.FC<JobTableProps> = ({ jobData, fetchJobs }) => {
    const { title, description, company, location, link, imageUrl, isApproved, createdAt, _id } = jobData;

    const { axios, role } = useAppContext()
    const approveEvent = async () => {
        try {
            const { data } = await axios.post(`/api/${role}/approve-job/${_id}`);
            if (data.success) {
                toast.success(data.message);
                await fetchJobs()
            } else {
                toast.error(data.message)
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    const deleteEvent = async () => {
        try {
            const confirm = window.confirm('Are you sure you want to delete this event?');
            if (!confirm) return;
            const { data } = await axios.post(`/api/${role}/delete-job/${_id}`);
            if (data.success) {
                toast.success(data.message);
                await fetchJobs()
            } else {
                toast.error(data.message)
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    return (
        <tr className='border-y border-gray-300'>
            <td className='px-6 py-4 max-w-[300px]'>
                {title && (
                    <>
                        <b className='font-medium text-gray-600'>Job Role</b>: {title}
                        <br />
                    </>
                )}
                {company && (
                    <>
                        <b className='font-medium text-gray-600'>Company</b>: {company}
                        <br />
                    </>
                )}
                {location && (
                    <>
                        <b className='font-medium text-gray-600'>Location</b>: {location}
                        <br />
                    </>
                )}
                {description && (
                    <>
                        <b className='font-medium text-gray-600'>Description</b>: {description}
                        <br />
                    </>
                )}
                {link && (
                    <>
                        <b className='font-medium text-gray-600'>Application Link</b>:<a href={imageUrl} target='_blank' rel='noopener noreferrer' className='inline-block break-all text-sm text-blue-600 hover:underline cursor-pointer'>
                            {link}</a>
                        <br />
                    </>
                )}
                {imageUrl && (
                    <>
                        <b className='font-medium text-gray-600'>Image</b>:<a href={imageUrl} target='_blank' rel='noopener noreferrer' className='inline-block mt-4 break-all text-sm text-blue-600 hover:underline cursor-pointer'>
                            {imageUrl}</a>
                        <br />
                    </>
                )}
            </td>
            <td className='px-6 py-4 max-sm:hidden'>
                {new Date(createdAt).toLocaleDateString()}
            </td>
            <td className='px-6 py-4'>
                <div className='flex items-center gap-4'>
                    {!isApproved ? <img onClick={approveEvent} src={assets.tick_icon} alt='Approved' className='w-5 hover:scale-110 transition-all cursor-pointer' /> : <p className='text-xs border border-green-600 bg-green-100 text-green-600 rounded-full px-3 py-1'>Approved</p>}
                    <img onClick={deleteEvent} src={assets.bin_icon} alt='Delete' className='w-5 hover:scale-110 transition-all cursor-pointer' />
                </div>
            </td>
        </tr>
    )
}

export default JobTable