import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { assets } from '../utils/assets';
import { useAppContext } from '../context/AppContext';
import { useEffect, useState } from 'react';
import EventCard from '../components/EventCard';
import type { EventType } from '../interfaces/interface';
import EventModal from '../components/EventModal';
import toast from 'react-hot-toast';
import { PropagateLoader } from 'react-spinners';

const Events = () => {
    const [events, setEvents] = useState<EventType[]>([]);
    const [search, setSearch] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const { axios } = useAppContext();

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/event/all', {
                params: {
                    search,
                }
            });
            if (res.data.success) {
                setEvents(res.data.events);
            }
        } catch (err) {
            console.error('Failed to fetch events:', err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchEvents();
    }, []);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        fetchEvents();
    }

    return (
        <>
            <Navbar />
            <div className='h-screen w-screen flex relative mx-auto my-10 mt-2 justify-center'>
                <img src={assets.gradientBackground} className='absolute -top-50 -z-1 opacity-50' alt='gradient background' />
                <div className="w-5xl px-4 sm:px-20 py-10">
                    <div className='relative'>
                        <div className='text-center sm:mt-6 mb-4'>
                            <div className='mx-6 sm:mx-16 xl:mx-24'>
                                <h1 className='text-2xl sm:text-6xl font-semibold sm:leading-16 leading-light text-gray-700'>
                                    Discover <span className='text-primary'>HR Events</span> Near You
                                </h1>
                                <p className='my-4 sm:my-8 max-w-2xl m-auto max-sm:text-xs text-gray-500'>
                                    Find conferences, webinars, and meetups in the HR space. Whether physical or virtual—stay connected and involved.
                                </p>
                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className='flex justify-between w-full sm:max-w-lg max-sm:scale-75 mx-auto border border-gray-300 bg-white rounded overflow-hidden'
                            >
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    type='text'
                                    placeholder='Search for events...'
                                    required
                                    className='w-full pl-4 outline-none'
                                />
                                <button
                                    type='submit'
                                    className='bg-primary text-white px-4 py-1 sm:py-2 sm:px-8 m-0.5 sm:m-1.5 rounded hover:scale-105 transition-all cursor-pointer'
                                >
                                    Search
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className='flex items-center justify-end'>
                        <button onClick={() => setIsAdding(true)} className="rounded-full text-xs mb-6 sm:text-sm cursor-pointer bg-primary font-medium text-white px-5 sm:px-10 py-1.5 sm:py-2.5">
                            Add Event
                        </button>
                    </div>
                    {isAdding && <EventModal isOpen={isAdding} onClose={() => setIsAdding(false)} mode='create' onSuccess={() => { setIsAdding(false); toast.success('Event added under review') }} />}

                    <div className="grid gap-6 justify-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {loading ? (
                            <div className="col-span-full flex items-center justify-center min-h-[300px]">
                                <PropagateLoader color='#2563eb' />
                            </div>
                        ) : events.length ? (
                            events.map((event) => <EventCard key={event._id} event={event} />)
                        ) : (
                            <p>No events found.</p>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Events;