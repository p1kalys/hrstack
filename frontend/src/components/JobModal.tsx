import { useState, useEffect } from 'react';
import axios from 'axios';
import type { JobModalProps } from '../interfaces/interface';
import toast from 'react-hot-toast';
import { assets } from '../utils/assets';

const JobModal: React.FC<JobModalProps> = ({ isOpen, onClose, mode, initialData, jobId, onSuccess }) => {
    const [title, setTitle] = useState('');
    const [company, setCompany] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [applyLink, setApplyLink] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (mode === 'update' && initialData) {
            setTitle(initialData.title || '');
            setCompany(initialData.company || '');
            setLocation(initialData.location || '');
            setDescription(initialData.description || '');
            setApplyLink(initialData.link || '');
        } else {
            setTitle('');
            setCompany('');
            setLocation('');
            setDescription('');
            setApplyLink('');
            setImage(null);
        }
    }, [mode, initialData, isOpen]);

    const isFormEmpty =
        !title && !company && !location && !description && !applyLink && !image;

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            if (title) formData.append('title', title.trim());
            if (company) formData.append('company', company.trim());
            if (location) formData.append('location', location.trim());
            if (description) formData.append('description', description.trim());
            if (applyLink) formData.append('link', applyLink.trim());
            if (image) formData.append('image', image);

            if (mode === 'create') {
                await axios.post('/api/job/create-job', formData);
            } else {
                await axios.put(`/api/job/update-job/${jobId}`, formData);
            }

            onSuccess();
            onClose();
        } catch (err: any) {
            console.error(`${mode} job failed:`, err);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 p-4 backdrop-blur-sm bg-black/20 flex items-center justify-center">
            <div className="bg-white w-full max-w-lg rounded-lg p-4 shadow-lg max-h-[80vh] overflow-y-auto relative">
                <h2 className="text-md sm:text-xl font-semibold text-primary mb-4 py-2 border-b border-gray-200">
                    {mode === 'create' ? 'Post New Job' : 'Update Job'}
                </h2>

                <p>Upload Image</p>
                <label htmlFor='image'>
                    <img src={!image ? assets.upload_area : URL.createObjectURL(image)} alt='Upload Image' className='mt-2 h-16 mb-2 rounded cursor-pointer' />
                    <input
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                setImage(e.target.files[0]);
                            }
                        }} type='file' id='image' hidden required />
                </label>

                <label className="block mb-1 text-sm font-medium">Job Role</label>
                <input
                    type="text"
                    className="w-full sm:p-2 border p-1 text-sm border-gray-300 rounded mb-2"
                    value={title}
                    placeholder="Enter Job Role"
                    onChange={(e) => setTitle(e.target.value)}
                />

                <label className="block mb-1 text-sm font-medium">Company</label>
                <input
                    type="text"
                    className="w-full sm:p-2 border p-1 text-sm border-gray-300 rounded mb-2"
                    value={company}
                    placeholder="Enter Company" 
                    onChange={(e) => setCompany(e.target.value)}
                />

                <label className="block mb-1 text-sm font-medium">Location</label>
                <input
                    type="text"
                    className="w-full sm:p-2 border p-1 text-sm border-gray-300 rounded mb-2"
                    value={location}
                    placeholder="Enter Location"
                    onChange={(e) => setLocation(e.target.value)}
                />

                <label className="block mb-1 text-sm font-medium">Description</label>
                <textarea
                    className="w-full sm:p-2 border p-1 text-sm border-gray-300 rounded mb-2 resize-none"
                    rows={3}
                    value={description}
                    placeholder="Enter Job Description"
                    onChange={(e) => setDescription(e.target.value)}
                />

                <label className="block mb-1 text-sm font-medium">Apply Link</label>
                <input
                    type="text"
                    className="w-full sm:p-2 border p-1 text-sm border-gray-300 rounded mb-2"
                    value={applyLink}
                    placeholder="Enter Link to Apply"
                    onChange={(e) => setApplyLink(e.target.value)}
                />

                <div className="flex justify-end gap-3 mt-4">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 sm:px-10 py-1.5 sm:py-2.5 text-xs sm:text-sm bg-gray-200 text-gray-700 rounded cursor-pointer hover:bg-gray-300 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isFormEmpty || loading}
                        className={`px-4 sm:px-10 py-1.5 sm:py-2.5 cursor-pointer text-xs sm:text-sm bg-primary text-white rounded transition ${isFormEmpty || loading
                            ? 'opacity-50 cursor-not-allowed'
                            : ' hover:bg-primary/90'
                            }`}
                    >
                        {loading
                            ? mode === 'create'
                                ? 'Creating...'
                                : 'Updating...'
                            : mode === 'create'
                                ? 'Create'
                                : 'Update'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JobModal;
