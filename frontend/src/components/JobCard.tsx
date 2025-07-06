import React, { useState } from 'react';
import type { JobData } from '../interfaces/interface';

const JobCard: React.FC<{ job: JobData }> = ({ job }) => {
    const hasImage = !!job.imageUrl;
    const [isImageOpen, setIsImageOpen] = useState(false);

    return (
        <div className="w-full max-w-md rounded-xl overflow-hidden shadow-md bg-white hover:shadow-lg transition-shadow duration-300">
            <div className="p-4">
                {hasImage && (
                    <div className="h-48 w-full overflow-hidden cursor-pointer" onClick={() => setIsImageOpen(true)}>
                        <img
                            src={job.imageUrl}
                            alt={'Job image'}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}
                {isImageOpen && (
                    <div
                        className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
                        onClick={() => setIsImageOpen(false)}
                    >
                        <img
                            src={job.imageUrl}
                            alt="Full Job Image"
                            className="max-h-[90vh] max-w-[90vw] object-contain rounded shadow-lg"
                        />
                    </div>
                )}
                {job.title && <h2 className="text-xl font-semibold text-primary">{job.title}</h2>}
                {job.company && (
                    <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Company:</span> {job.company}
                    </p>
                )}
                {job.location && (
                    <p className="text-sm text-gray-600">
                        <span className="font-medium">Location:</span> {job.location}
                    </p>
                )}
                {job.description && (
                    <p className="mt-2 text-sm text-gray-700 line-clamp-3">{job.description}</p>
                )}
                {job.link && (
                    <a
                        href={job.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-4 text-sm text-blue-600 font-semibold hover:scale-105 transition-all duration-300" 
                    >
                        View Job →
                    </a>
                )}
            </div>
        </div>
    );
};

export default JobCard;
