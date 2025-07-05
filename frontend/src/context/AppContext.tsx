import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Set base URL
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

interface AppContextType {
    axios: typeof axios;
    navigate: ReturnType<typeof useNavigate>;
    token: string | null;
    setToken: React.Dispatch<React.SetStateAction<string | null>>;
    role: string | null;
    setRole: React.Dispatch<React.SetStateAction<string | null>>;
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
    const [role, setRole] = useState<string | null>(null);
    const [input, setInput] = useState<string>('');


    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedRole = localStorage.getItem('role');
        if (storedToken) {
            setToken(storedToken);
            setRole(storedRole);
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
    }, []);

    const value: AppContextType = {
        axios,
        navigate,
        token,
        setToken,
        role,
        setRole,
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
