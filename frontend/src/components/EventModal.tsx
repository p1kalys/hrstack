import { useEffect, useState } from 'react';
import axios from 'axios';
import type { EventModalProps } from '../interfaces/interface';

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, mode, initialData, eventId, onSuccess }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [link, setLink] = useState('');
    const [date, setDate] = useState('');
    const [physical, setPhysical] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (mode === 'update' && initialData) {
            setTitle(initialData.title);
            setDescription(initialData.description);
            setLocation(initialData?.physical === true ? initialData.location || '' : '');
            setLink(initialData?.physical === false ? initialData.link || '' : '');
            setPhysical(initialData.physical);
            setDate(initialData.date);
        } else {
            setTitle('');
            setDescription('');
            setLocation('');
            setDate('');
            setLink('');
        }
    }, [mode, initialData, isOpen]);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const payload = {
                title,
                description,
                location: physical ? location : '',
                link: !physical ? link : '',
                physical,
                date,
            };

            if (mode === 'create') {
                await axios.post('/api/event/create-event', payload);
            } else {
                await axios.put(`/api/event/update-event/${eventId}`, payload);
            }

            onSuccess();
            onClose();
        } catch (err) {
            console.error(`${mode} event failed:`, err);
            alert(`Failed to ${mode} event.`);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 p-4 backdrop-blur-sm bg-black/20 flex items-center justify-center">
            <div className="bg-white w-full max-w-lg rounded-lg p-4 shadow-lg max-h-[80vh] overflow-y-auto relative">
                <h2 className="text-md sm:text-xl font-semibold text-primary mb-4 py-2 border-b border-gray-200">
                    {mode === 'create' ? 'Create Event' : 'Update Event'}
                </h2>

                <label className="block mb-1 text-sm font-medium">Title</label>
                <input
                    type="text"
                    placeholder="Enter event title"
                    className="w-full sm:p-2 border p-1 text-sm border-gray-300 rounded mb-2"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <label className="block mb-1 text-xs sm:text-sm font-medium">Description</label>
                <textarea
                    placeholder="Event description"
                    className="w-full text-sm p-1 sm:p-2 border border-gray-300 rounded resize-none mb-2"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <label className="block mb-1 text-sm font-medium">Event Type</label>
                <div className="flex gap-3 mb-2">
                    {['Physical', 'Virtual'].map((item, idx) => {
                        const isSelected = (item === 'Physical' && physical) || (item === 'Virtual' && !physical);
                        return (
                            <div
                                key={idx}
                                onClick={() => setPhysical(item === 'Physical')}
                                className={`cursor-pointer px-3 py-1 rounded-full border text-sm font-medium transition ${isSelected ? 'bg-primary text-white border-primary' : 'bg-gray-100 text-gray-700 border-gray-300'}`}
                            >
                                {item}
                            </div>
                        );
                    })}
                </div>

                {physical ? (
                    <>
                        <label className="block mb-1 text-sm font-medium">Location</label>
                        <input
                            type="text"
                            placeholder="Event location"
                            className="w-full text-sm p-1 sm:p-2 border border-gray-300 rounded mb-2"
                            required
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </>
                ) : (
                    <>
                        <label className="block mb-1 text-sm font-medium">Link</label>
                        <input
                            type="text"
                            placeholder="Event link"
                            className="w-full text-sm p-1 sm:p-2 border border-gray-300 rounded mb-2"
                            required
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                        />
                    </>
                )}

                <label className="block mb-1 text-sm font-medium">Date & Time</label>
                <input
                    type="datetime-local"
                    className="w-full text-sm p-1 sm:p-2 border border-gray-300 rounded mb-2"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />

                <div className="flex justify-end gap-3 mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded cursor-pointer hover:bg-gray-300 transition"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 text-sm bg-primary text-white cursor-pointer rounded hover:bg-primary/90 transition"
                        disabled={loading}
                    >
                        {loading ? (mode === 'create' ? 'Creating...' : 'Updating...') : mode === 'create' ? 'Create' : 'Update'}
                    </button>
                </div>
            </div>
        </div>

    );
};

export default EventModal;
