import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const NewsLetter = () => {
  const [email, setEmail] = useState<string>('');
  const { axios } = useAppContext();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/blog/subscribe', { email });
      if (data.success) {
        toast.success(data.message);
        setEmail('');
      } else {
        toast.error(data.message);
      }
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    }
  };

  return (
    <div className='flex flex-col items-center justify-center text-center space-y-2 my-32'>
      <h1 className='md:text-4xl text-2xl font-semibold'>Never Miss Updates!</h1>
      <p className='md:text-lg text-gray-500/70 pb-8'>Subscribe to get the latest blog, articles and exclusive news about HR Industry.</p>
      <form onSubmit={handleSubscribe} className='flex items-center justify-between max-w-2xl w-full md:h-13 h-12'>
        <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-gray-300 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-500' type="text" placeholder='Enter your email id' required />
        <button type='submit' className='md:px-12 px-8 h-full text-white bg-primary/80 hover:bg-primary transition-all cursor-pointer rounded-md'>Subscibe</button>
      </form>
    </div>
  )
}

export default NewsLetter