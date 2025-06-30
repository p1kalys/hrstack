import { useEffect, useState } from 'react'
import { assets } from '../../utils/assets'
import type { DashboardData } from '../../interfaces/interface'
import Table from '../../components/BlogTable'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { PropagateLoader } from 'react-spinners'

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    blogs: 0,
    comments: 0,
    drafts: 0,
    recentBlogs: []
  })
  const [loading, setLoading] = useState<boolean>(false);

  const { axios } = useAppContext();

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/profile/dashboard`);
      data.success ? setDashboardData(data.dashboardData) : toast.error(data.message)

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  return (loading ? <div className="flex items-center justify-center h-screen w-screen">
    <PropagateLoader color='#2563eb' />
  </div> :
    <div className='flex-1 p-4 md:p-10 bg-blue-50/50'>
      <div className='flex flexx-wrap gap-4'>
        <div className='flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all'>
          <img src={assets.dashboard_icon_1} alt='Dashboard Icon 1' className='w-12 h-12 p-3 bg-gray-50 rounded-lg' />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashboardData.blogs}</p>
            <p className='text-gray-400 font-light'>Blogs</p>
          </div>
        </div>

        <div className='flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all'>
          <img src={assets.dashboard_icon_2} alt='Dashboard Icon 1' className='w-12 h-12 p-3 bg-gray-50 rounded-lg' />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashboardData.comments}</p>
            <p className='text-gray-400 font-light'>Comments</p>
          </div>
        </div>

        <div className='flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all'>
          <img src={assets.dashboard_icon_3} alt='Dashboard Icon 1' className='w-12 h-12 p-3 bg-gray-50 rounded-lg' />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashboardData.drafts}</p>
            <p className='text-gray-400 font-light'>Drafts</p>
          </div>
        </div>
      </div>
      <div>
        <div className='flex items-center gap-3 m-4 mt-6 text-gray-600'>
          <img src={assets.dashboard_icon_4} alt='Dashboard Icon 4' className='w-5 h-5' />
          <p>Latest Blogs</p>
        </div>

        <div className='relative max-w-4xl overflow-x-auto shadow rounded-lg scrollbar-hide bg-white'>
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
              {dashboardData.recentBlogs.map((blog, index) => {
                return <Table key={blog._id} blog={blog} fetchBlogs={fetchDashboard} index={index + 1} />
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

export default Dashboard