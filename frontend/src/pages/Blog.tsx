import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import type { Blog, BlogComment } from "../interfaces/interface";
import { assets } from "../utils/assets";
import Navbar from "../components/Navbar";
import moment from "moment";
import Footer from "../components/Footer";
import { PropagateLoader } from "react-spinners";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import {
  Facebook,
  Twitter,
  Linkedin,
  Share2,
  MessageCircle,
} from 'lucide-react';

const ViewBlog = () => {
  const { id } = useParams<{ id: string }>()

  const { axios } = useAppContext();

  const [data, setData] = useState<Blog>();
  const [comments, setComments] = useState<BlogComment[] | undefined>();
  const [name, setName] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const articleUrl = window.location.href;
  const encodedUrl = encodeURIComponent(articleUrl);
  const message = encodeURIComponent("Check out this article!");

  const fetchBlogData = async () => {
    try {
      const { data } = await axios.get(`/api/blog/${id}`);
      data?.success ? setData(data.blog) : toast.error(data.message);
    } catch (error: any) {
      toast.error(error.message)
    }
  }
  const fetchComments = async () => {
    try {
      const { data } = await axios.get(`/api/blog/comments/${id}`)
      data.success ? setComments(data.comments) : toast.error(data.message);
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  const addComment = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!name.trim() || !content.trim()) {
      return toast.error("Please fill out both fields properly.");
    }
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/blog/add-comment', { blog: id, name, content });
      if (data?.success) {
        toast.success(data.message);
        setName('');
        setContent('');
        await fetchComments();
      } else {
        toast.error(data.message)
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchBlogData();
    fetchComments();
  }, []);

  return (
    data ?
      (<div className="relative">
        <img src={assets.gradientBackground} alt="gradient background" className="absolute -top-50 z-[-1] opacity-50" />
        <Navbar />
        <div className="text-center mt-20 text-gray-600">
          <p className="text-primary py-4 font-medium">Published on {moment(data?.createdAt).format('MMMM Do YYYY')}</p>
          <h1 className="text-2xl sm:text-5xl font-semibold max-w-2xl mx-auto text-gray-800">{data?.title}</h1>
          <h2 className="my-5 max-w-lg truncate mx-auto">{data?.subTitle}</h2>
          <p className="inline-block py-1 px-4 rounded-full mb-6 border text-sm border-primary/35 bg-primary/5 font-medium text-primary">{data?.author?.name}</p>
        </div>

        <div className="mx-5 max-w-5xl md:mx-auto my-10 mt-6">
          {data?.image && <img loading="lazy" src={data?.image} alt="Main Image" className="rounded-3xl mb-5" />}

          <div className="rich-text max-w-3xl mx-auto" dangerouslySetInnerHTML={{ __html: data.description }}></div>

          <div className="mt-14 mb-10 max-w-3xl mx-auto">
            <p className="font-semibold mb-4">Comments ({comments?.length})</p>
            <div className="flex flex-col gap-4">
              {comments?.map((item, index) => (
                <div key={index} className="relative bg-primary/2 border border-primary/5 max-w-xl p-4 rounded text-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <img src={assets.user_icon} alt="User Icon" className="w-6" />
                    <p className="font-medium">{item?.name}</p>
                  </div>
                  <p className="text-sm max-w-md ml-8">{item?.content}</p>
                  <div className="absolute right-4 bottom-3 flex items-center gap-2 text-xs">{moment(item?.createdAt).fromNow()}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            <p className="font-semibold mb-4">Add your comment</p>
            <form onSubmit={addComment} className="flex flex-col items-start gap-4 max-w-lg">
              <input type="text" onChange={(e) => setName(e.target.value)} value={name} placeholder="Name" required className="w-full p-2 border border-gray-300 rounded outline-none" />
              <textarea placeholder="Comment" onChange={(e) => setContent(e.target.value)} value={content} required className="w-full p-2 border border-gray-300 rounded outline-none h-28 resize-none" aria-required></textarea>
              <button type="submit" className="bg-primary text-white px-8 py-2  hover:scale-102 transition-all cursor-pointer">Submit</button>
            </form>
          </div>

          <div className="my-24 max-w-3xl mx-auto">
            <p className="font-semibold my-4">Share this article on social media</p>
            <div className="flex flex-wrap gap-4">
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 bg-white p-1.5 border-gray-50 rounded-full shadow-md transition-transform" 
              >
                <Linkedin className="text-blue-700 w-4 h-4" />
              </a>

              <a
                href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${message}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 bg-white p-1.5 border-gray-50 rounded-full shadow-md transition-transform"
              >
                <Twitter className="text-sky-500 w-4 h-4" />
              </a>

              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 bg-white p-1.5 border-gray-50 rounded-full shadow-md transition-transform"
              >
                <Facebook className="text-blue-600 w-4 h-4" />
              </a>

              <a
                href={`https://api.whatsapp.com/send?text=${message}%20${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 bg-white p-1.5 border-gray-50 rounded-full shadow-md transition-transform"
              >
                <MessageCircle className="text-green-500 w-4 h-4" /> 
              </a>

              <button
                onClick={() => {navigator.clipboard.writeText(articleUrl); toast.success('Copied to clipboard!')}}
                className="hover:scale-110 cursor-pointer bg-white p-1.5 border-gray-50 rounded-full shadow-md transition-transform"
              >
                <Share2 className="text-gray-500 w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>)
      : (<div className="flex items-center justify-center h-screen">
        <PropagateLoader color='#2563eb' />
      </div>)
  )
}

export default ViewBlog