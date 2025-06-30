import { useEffect, useState } from 'react'
import type { Blog } from '../../interfaces/interface';
import Table from '../../components/BlogTable';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { PropagateLoader } from 'react-spinners';

const ListofBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const { axios } = useAppContext();
  const [loading, setLoading] = useState<boolean>(false);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/profile/blogs')
      if (data.success) {
        setBlogs(data.blogs)
      } else {
        toast.error(data.message)
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    loading ? <div className="flex items-center justify-center h-screen w-screen">
        <PropagateLoader color='#2563eb' />
      </div> :
    <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50'>
      <h1>All blogs</h1>
      <div className='relative h-4/5 max-w-4xl mt-4 overflow-x-auto shadow rounded-lg scrollbar-hide bg-white'>
        <table className='w-full text-sm text-gray-500'>
          <thead className='text-xs text-gray-600 text-left uppercase'>
            <tr>
              <th scope='col' className='px-2 py-4 xl:px-6'> # </th>
              <th scope='col' className='px-2 py-4'> Blog Title </th>
              <th scope='col' className='px-2 py-4 max-sm:hidden'> Date </th>
              <th scope='col' className='px-2 py-4 max-sm:hidden'> Status </th>
              <th scope='col' className='px-2 py-4'> Actions </th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog, index) => {
              return <Table key={blog._id} blog={blog} fetchBlogs={fetchBlogs} index={index + 1} />
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ListofBlogs