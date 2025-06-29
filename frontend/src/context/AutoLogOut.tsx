import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAutoLogout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const expiry = Number(localStorage.getItem('tokenExpiry'));
        const now = Date.now();

        if (expiry && expiry < now) {
            localStorage.removeItem('token');
            localStorage.removeItem('tokenExpiry');
            navigate('/profile');
        } else if (expiry) {
            const timeout = setTimeout(() => {
                localStorage.removeItem('token');
                localStorage.removeItem('tokenExpiry');
                navigate('/profile');
            }, expiry - now);

            return () => clearTimeout(timeout);
        }
    }, []);
};

export default useAutoLogout;
