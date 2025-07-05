import { useEffect, useState } from 'react'
import type { EventData } from '../../interfaces/interface'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { PropagateLoader } from 'react-spinners'
import EventTable from '../../components/EventTable'

const ManageEvents = () => {
    const [events, setEvents] = useState<EventData[]>([])
    const [filter, setFilter] = useState<string>('Not Approved')
    const [loading, setLoading] = useState<boolean>(false);

    const { axios, role } = useAppContext()

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`/api/${role}/events`)
            data.success ? setEvents(data.events) : toast.error(data.message) 
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchEvents();
    }, [])

    return (loading ? <div className="flex items-center justify-center h-screen w-screen">
        <PropagateLoader color='#2563eb' />
    </div> :
        <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50'>
            <div className='flex justify-between items-center max-w-3xl'>
                <h1>Events</h1>
                <div className='flex gap-4'>
                    <button onClick={() => setFilter('Approved')} className={`shadow-custom-sm border rounded-full px-4 py-1 cursor-pointer text-xs ${filter === 'Approved' ? 'text-primary' : 'text-gray-700'}`}>Approved</button>
                    <button onClick={() => setFilter('Not Approved')} className={`shadow-custom-sm border rounded-full px-4 py-1 cursor-pointer text-xs ${filter === 'Not Approved' ? 'text-primary' : 'text-gray-700'}`}>Not Approved</button>
                </div>
            </div>
            <div className='relative h-4/5 max-w-3xl overflow-x-auto mt-4 bg-white shadow rounded-lg scrollbar-hide'>
                <table className='w-full text-sm text-gray-500'>
                    <thead className='text-xs text-gray-700 sticky top-0 z-10 bg-white shadow-sm text-left uppercase'>
                        <tr>
                            <th scope='col' className='px-6 py-3'>Event Details</th> 
                            <th scope='col' className='px-6 py-3 max-sm:hidden'>Created At</th>
                            <th scope='col' className='px-6 py-3'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.filter((eventItem) => { 
                            if (filter === 'Approved') return eventItem.isApproved === true;
                            return eventItem.isApproved === false;
                        }).length === 0 ? (
                            <tr>
                                <td colSpan={3} className="text-center py-6 text-gray-500">
                                    No comments found.
                                </td>
                            </tr>
                        ) : (
                            events
                                .filter((eventItem) => {
                                    if (filter === 'Approved') return eventItem.isApproved === true;
                                    return eventItem.isApproved === false;
                                })
                                .map((eventItem, index) => (
                                    <EventTable key={index} eventData={eventItem} fetchEvents={fetchEvents} /> 
                                ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ManageEvents;