import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { useAppContext } from '../context/AppContext';
import { assets } from '../utils/assets';
import { Briefcase } from 'lucide-react';
import type { JobData } from '../interfaces/interface';
import JobModal from '../components/JobModal';
import toast from 'react-hot-toast';
import JobCard from '../components/JobCard';
import { PropagateLoader } from 'react-spinners';

const Jobs = () => {
    const { axios } = useAppContext();
    const [jobs, setJobs] = useState<JobData[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            const { data } = await axios.get('/api/job/all');
            if (data.success) {
                setJobs(data.jobs);
            }
            setLoading(false);
        };
        fetchJobs();
    }, []);
    return (
        <>
            <Navbar />
            <div className='h-screen w-screen flex relative mx-auto my-10 mt-2 justify-center'>
                <img
                    src={assets.gradientBackground}
                    className='absolute -top-50 -z-1 opacity-50'
                    alt='gradient background'
                />
                <div className="w-5xl px-4 sm:px-20 py-4">
                    <div className='relative'>
                        <div className='text-center mb-4'>
                            <div className='mx-6 sm:mx-16 xl:mx-24'>
                                <div className="inline-flex items-center mt-4 justify-center gap-3 px-5 py-1.5 mb-4 border border-primary/10 rounded-full text-xs sm:text-sm text-primary bg-primary/5">
                                    <Briefcase className="w-4 h-4" />
                                    <span>New: Job Board Now Live</span>
                                </div>
                                <h1 className='text-3xl sm:text-6xl font-semibold text-gray-700'>
                                    Explore <span className='text-primary'>HR Job Opportunities</span>
                                </h1>
                                <p className='mt-4 sm:mt-6 max-w-2xl mx-auto text-sm sm:text-base text-gray-500'>
                                    Browse full-time, part-time, and remote HR positions across industries. Whether you're hiring or applying for a job, HR Stack has you covered.
                                </p>
                                <button onClick={() => setIsAdding(true)} className="rounded-full mt-4 text-xs sm:text-sm cursor-pointer bg-primary font-medium text-white px-12 sm:px-25 py-2 sm:py-2.5 hover:bg-primary/90 transition-all shadow">
                                    Post Job
                                </button>
                            </div>
                        </div>
                    </div>
                    {isAdding && <JobModal isOpen={isAdding} onClose={() => setIsAdding(false)} mode='create' onSuccess={() => { setIsAdding(false); toast.success('Job added under review') }} />}
                    <div className="grid gap-6 justify-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {loading ? (
                            <div className="col-span-full flex items-center justify-center min-h-[300px]">
                                <PropagateLoader color='#2563eb' />
                            </div>
                        ) : jobs.length ? (
                            jobs.map((job) => (
                                <JobCard key={job._id} job={job} />))
                        ) : (
                            <p>No Jobs found.</p>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Jobs;
