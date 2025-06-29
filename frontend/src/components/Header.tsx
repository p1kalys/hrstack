import { useRef } from 'react';
import { useAppContext } from '../context/AppContext'
import { assets } from '../utils/assets'

const Header = () => {
    const { setInput, input } = useAppContext();

    const inputRef = useRef<HTMLInputElement>(null);

    const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (inputRef.current) {
            setInput(inputRef.current.value);
        }
    }

    const onClear = async () => {
        setInput('')
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    }

    return (
        <div className='mx-8 sm:mx-16 xl:mx-24 relative'>
            <div className='text-center mt-20 mb-8'>
                <div className='inline-flex items-center justify-center gap-4 px-6 py-1.5 mb-4 border border-primary/10 rounded-full text-sm text-primary'>
                    <p>New: AI feature integrated</p>
                    <img src={assets.star_icon} className='w-4' alt='star icon' />
                </div>
                <h1 className='text-3xl sm:text-6xl font-semibold sm: leading-16 text-gray-700'>Your go to <span className='text-primary'>HR News.</span></h1>
                <p className='my-6 sm:my-8 max-w-2xl m-auto max-sm:text-xs text-gray-500'>Stay updated with the latest trends and insights in the HR industry. Share what matters, whether it's one word or a thousand, your story starts right here.</p>

                <form onSubmit={onSubmitHandler} className='flex justify-between max-w-lg max-sm:scale-75 mx-auto border border-gray-300 bg-white rounded overflow-hidden'>
                    <input ref={inputRef} type='text' placeholder='Search for HR news...' required className='w-full pl-4 outline-none' />
                    <button type='submit' className='bg-primary text-white px-8 py-2 m-1.5 rounded hover:scale-105 transition-all cursor-pointer'>Search</button>
                </form>
            </div>
            <div className='text-center'>
                {input && <button onClick={onClear} className='border font-light text-xs py-1 px-3 rounded-sm shadow-custom-sm cursor-pointer'>Clear Search</button>}
            </div>
            <img src={assets.gradientBackground} className='absolute -top-50 -z-1 opacity-50' alt='gradient background' />
        </div>
    )
}

export default Header