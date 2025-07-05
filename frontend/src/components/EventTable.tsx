import React from 'react'
import type { EventTableProps } from '../interfaces/interface'
import { assets } from '../utils/assets';
import toast from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';

const EventTable: React.FC<EventTableProps> = ({ eventData, fetchEvents }) => { 
    const { title, description, date, location, link, physical, isApproved, createdAt, _id } = eventData;

    const { axios } = useAppContext()
    const approveEvent = async () => {
        try {
            const { data } = await axios.post(`/api/profile/approve-event/${_id}`);
            if (data.success) {
                toast.success(data.message);
                await fetchEvents()
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
            const { data } = await axios.post(`/api/profile/delete-event/${_id}`);
            if (data.success) {
                toast.success(data.message);
                await fetchEvents()
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
                <b className='font-medium text-gray-600'>Event</b>: {title}
                <br />
                <br />
                <b className='font-medium text-gray-600'>Description</b>: {description}
                <br />
                <b className='font-medium text-gray-600'>Date</b>: {new Date(date).toLocaleString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                })}
                <br />
                <b className='font-medium text-gray-600'>Location/Link</b>: {physical ? location : link}
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

export default EventTable