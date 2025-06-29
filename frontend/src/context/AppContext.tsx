import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { Blog } from '../interfaces/interface';

// Set base URL
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

interface AppContextType {
    axios: typeof axios;
    navigate: ReturnType<typeof useNavigate>;
    token: string | null;
    setToken: React.Dispatch<React.SetStateAction<string | null>>;
    blogs: Blog[];
    setBlogs: React.Dispatch<React.SetStateAction<Blog[]>>;
    input: string;
    setInput: React.Dispatch<React.SetStateAction<string>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
    const navigate = useNavigate();
    const [token, setToken] = useState<string | null>(null);
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [input, setInput] = useState<string>('');

    const fetchBlogs = async () => {
        try {
            const { data } = await axios.get('/api/blog/all');
            data?.success ? setBlogs(data.blogs) : toast.error(data.message);
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchBlogs();
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
    }, []);

    const value: AppContextType = {
        axios,
        navigate,
        token,
        setToken,
        blogs,
        setBlogs,
        input,
        setInput,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
