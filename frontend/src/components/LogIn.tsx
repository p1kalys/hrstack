import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { Eye } from 'lucide-react'
import { EyeOff } from 'lucide-react'
import { Label } from 'radix-ui';

const LogIn = () => {
  const [formType, setFormType] = useState<'login' | 'signup'>('login');
  const { axios, setToken, setRole } = useAppContext();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const endpoint = formType === 'login' ? 'api/profile/login' : 'api/profile/register';
      const payload = formType === 'login' ? { email, password } : { name, email, password };

      const { data } = await axios.post(endpoint, payload);

      if (data?.success) {
        setToken(data?.token);
        setRole(data.role);
        const expiryTime = Date.now() + 3 * 60 * 60 * 1000;
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('tokenExpiry', expiryTime.toString());
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      }
      else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  }
  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='w-full max-w-sm p-8 max-md:m-6 border border-primary/30 shadow-xl shadow-primary/15 rounded-lg'>
        <div className='flex flex-col items-center justify-center'>
          <div className='w-full py-4 text-center'>
            <h1 className='text-3xl font-bold'>{formType === 'login' ? 'Login' : 'SignUp'}</h1>
            <p className='font-light'>{formType === 'login' ? 'Enter your credentials to access the admin panel' : 'Enter your details to create an account'}</p>
          </div>
          <form onSubmit={handleSubmit} className='mt-4 w-full sm:max-w-md text-gray-600'>
            {formType === 'signup' && (
              <div className='flex flex-col'>
                <Label.Root htmlFor="name" className="block text-sm font-semibold mb-2 text-gray-700">
                  Name
                </Label.Root>
                <input
                  id="name"
                  type="text"
                  required
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  placeholder="Enter your name"
                  className="w-full px-3 py-2 mb-6 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
            <div className='flex flex-col'>
              <Label.Root htmlFor="email" className="block text-sm font-semibold mb-2 text-gray-700">
                Email
              </Label.Root>
              <input
                id="email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
                placeholder="Enter your email"
                className="w-full px-3 py-2 mb-6 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className=''>
              <Label.Root htmlFor="password" className="block text-sm font-semibold mb-2 text-gray-700">
                Password
              </Label.Root>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-blue-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type='submit' className='w-full mt-6 py-3 font-medium bg-primary text-white rounded cursor-pointer hover:bg-primary/90 transition-all'>{formType === 'login' ? 'Login' : 'SignUp'}</button>
            <div className='mt-4 text-sm'>
              {formType === 'login' ? (
                <>
                  Don't have an account?{' '}
                  <span className='text-primary cursor-pointer font-semibold' onClick={() => setFormType('signup')}>
                    Create one
                  </span>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <span className='text-primary cursor-pointer font-semibold' onClick={() => setFormType('login')}>
                    Login
                  </span>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LogIn