import { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import type { RssFeedItem } from '../interfaces/interface';

const Feed = () => {
    const { axios } = useAppContext();
    const [feed, setFeed] = useState<RssFeedItem[]>([]);

    const fetchExternalBlogs = async () => {
        try {
            const { data } = await axios.get('/api/blog/rss');
            if (data.success) {
                setFeed(data.feed.items);
                console.log('Fetched feed:', data.feed.items);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        fetchExternalBlogs();
    }, [])

    return (
        <div className="p-4 max-w-7xl mb-20 mx-auto">
            <h2 className="md:text-4xl text-2xl font-bold mt-16 mb-4 text-center text-primary">Read More Top Stories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 flex-wrap">
                {feed.map((item, index) => (
                    <a
                        key={index}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full rounded-lg overflow-hidden shadow hover:scale-102 hover:shadow-primary/25 duration-300 cursor-pointer"
                    >
                        <div className="p-5">
                            <h5 className="mb-2 font-medium text-primary/90">{item.title}</h5>
                            <p className="text-xs text-gray-600">
                                {item.contentSnippet?.slice(0, 150) + '...'}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                Published on: {new Date(item.isoDate).toLocaleString()}
                            </p>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    )
}

export default Feed