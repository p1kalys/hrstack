import React, { useEffect, useRef, useState } from 'react'
import { assets, blogCategories } from '../../utils/assets'
import Quill from 'quill'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { parse } from 'marked'

const AddBlog = () => {
  const { axios } = useAppContext();
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const editorRef = useRef(null);
  const quillRef = useRef<Quill>(null);

  const [image, setImage] = useState<Blob>();
  const [title, setTitle] = useState<string>('');
  const [subTitle, setSubTitle] = useState<string>('');
  const [category, setCategory] = useState<string[]>([]);
  const [isPublished, setIsPublished] = useState<boolean>(false);

  const generateContent = async () => {
    if (!title) return toast.error('Please enter a title')
    try {
      setLoading(true);
      const { data } = await axios.post('/api/blog/generate', { prompt: title })
      if (data.success) {
        const parsedContent = parse(data.message);
        if (quillRef.current && typeof parsedContent === 'string') {
          quillRef.current.root.innerHTML = parsedContent;
        }
      } else {
        toast.error(data.message)
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false);
    }
  }

  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsAdding(true);
      const blog = { title, subTitle, description: quillRef.current?.root.innerHTML, category, isPublished }
      const formData = new FormData();
      formData.append('blog', JSON.stringify(blog));
      if (image) {
        formData.append('image', image);
      }

      const { data } = await axios.post('/api/blog/add-blog', formData);
      if (data.success) {
        toast.success(data.message);
        setImage(undefined);
        setTitle('');
        if (quillRef.current) { quillRef.current.root.innerHTML = ''; }
        setCategory([])
        setSubTitle('')
        setIsPublished(false);
      } else {
        toast.error(data.message);
      }

    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsAdding(false);
    }
  }

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: 'snow' });
    }
  }, [])

  return (
    <form onSubmit={onSubmitHandler} className='flex-1 bg-blue-50/50 text-gray-600 h-full overflow-scroll'>
      <div className='bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded'>

        <p>Upload thumbnail</p>
        <label htmlFor='image'>
          <img src={!image ? assets.upload_area : URL.createObjectURL(image)} alt='Upload Image' className='mt-2 h-16 rounded cursor-pointer' />
          <input
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setImage(e.target.files[0]);
              }
            }} type='file' id='image' hidden required />
        </label>

        <p className='mt-4'>Blog title</p>
        <input type='text' placeholder='Type here' required className='w-full max-w-lg p-2 mt-2 border border-gray-300 outline-none rounded' onChange={(e) => setTitle(e.target.value)} value={title} />

        <p className='mt-4'>Sub title</p>
        <input type='text' placeholder='Type here' required className='w-full max-w-lg p-2 mt-2 border border-gray-300 outline-none rounded' onChange={(e) => setSubTitle(e.target.value)} value={subTitle} />

        <p className='mt-4'>Blog Description</p>
        <div className='max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative'>
          <div ref={editorRef}></div>
          {loading && <div className='absolute right-0 top-0 bottom-0 left-0 flex items-center justify-center bg-black/10 mt-2'>
            <div className='w-8 h-8 rounded border-2 border-black/50 animate-spin z-20'></div></div>}
          <button type='button' disabled={loading} onClick={generateContent} className='absolute bottom-1 right-2 ml-2 text-xs text-white bg-primary/90 px-4 py-1.5 rounded hover:underline cursor-pointer'>{loading ? 'Generating...' :'Generate with AI'}</button>
        </div>

        <p className='mt-4 mb-2'>Blog category</p>
        <div className='flex flex-wrap gap-3'>
          {blogCategories.slice(1,).map((item, index) => {
            const isSelected = category.includes(item);

            return (
              <div
                key={index}
                onClick={() => {
                  setCategory((prev) =>
                    isSelected
                      ? prev.filter((cat) => cat !== item)
                      : [...prev, item]
                  );
                }}
                className={`cursor-pointer px-3 py-1 rounded-full border transition-all text-sm
          ${isSelected ? 'bg-primary text-white border-primary' : 'bg-gray-100 text-gray-600 border-gray-300'}
        `}
              >
                {item}
              </div>
            );
          })}
        </div>


        <div className='flex gap-2 mt-4'>
          <p>Publish Now</p>
          <input type='checkbox' checked={isPublished} className='scale-125 cursor-pointer' onChange={e => setIsPublished(e.target.checked)} />
        </div>

        <button disabled={isAdding} type="submit" className='mt-8 w-40 h-10 bg-primary text-white rounded cursor-pointer text-sm'>{isAdding ? 'Adding...' : 'Add Blog'}</button>
      </div>
    </form>
  )
}

export default AddBlog