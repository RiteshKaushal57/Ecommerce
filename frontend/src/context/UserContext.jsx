import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const UserContext = createContext()

export const UserContextProvider = ({ children }) => {


    const [user, setUser] = useState(null);
    const [isLogin, setIsLogin] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const axiosResponse = await axios.get('http://localhost:4000/user/auth',
                    { withCredentials: true }
                )
                if (axiosResponse.data.user) {
                    setUser(axiosResponse.data.user)
                    setIsLogin(true)
                }
            } catch (error) {
                setUser(null)
                setIsLogin(false)
            }
        }
        checkAuth()
    }, [])

    //Register function

    const register = async (firstName, lastName, email, password) => {

        try {
            const axiosResponse = await axios.post('http://localhost:4000/user/register',
                { firstName, lastName, email, password },
                { withCredentials: true }
            )
            return { success: true, data: axiosResponse.data }

        } catch (error) {
            return { success: false, message: 'Registration failed at UserContext. Please try again' }
        }
    }

    //Login function

    const login = async (email, password) => {
        try {
            const axiosResponse = await axios.post('http://localhost:4000/user/login',
                { email, password },
                { withCredentials: true }
            )
            if (axiosResponse.data.user) {
                setUser(axiosResponse.data.user);
                setIsLogin(true);
            }
            return { success: true, data: axiosResponse.data }
        } catch (error) {
            return { success: false, message: 'Login failed at UserContext. Please try again' }
        }
    }

    const logout = async () => {
        try {
            const axiosResponse = await axios.post('http://localhost:4000/user/logout', {}, { withCredentials: true }
            )
            setUser(null)
            setIsLogin(false)
            toast.success('You logged out successfully')
            navigate('/')
            return { success: true, message: 'You logged out successfully' }
        } catch (error) {
            return { success: false, message: 'Logout failed at UserContext. Please try again' }
        }
    }

    const googleLogin = async () => {
        try {
            const axiosResponse = await axios.get('http://localhost:4000/auth/google', { withCredentials: true });
            if (axiosResponse.data.user) {
                setUser(axiosResponse.data.user);
                setIsLogin(true);
            }
        } catch (error) {
            console.error('Google login failed:', error);
            setUser(null);
            setIsLogin(false);
        }
    }

    // Handler for "Login as Seller"
    const handleLoginAsSeller = async () => {
        try {
            // Make API call to update isseller to true
            const res = await axios.patch('http://localhost:4000/user/become-seller', {
            }, { withCredentials: true });

            if (res.data.success) {
                // Update user context
                setUser({ ...user, isSeller: true });
                toast.success('You are now a seller!');
            } else {
                toast.error('Failed to become a seller.');
            }
        } catch (error) {
            toast.error('Error updating seller status.');
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser, isLogin, setIsLogin, register, login, logout, googleLogin, handleLoginAsSeller }}>
            {children}
        </UserContext.Provider>
    )
}


export const useUserContext = () => {
    return useContext(UserContext);
}

