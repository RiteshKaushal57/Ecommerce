import { emphasize } from "@mui/material";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
const UserContext = createContext()

export const UserContextProvider = ({ children }) => {


    const [user, setUser] = useState(null);
    const [isLogin, setIsLogin] = useState(false);

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
            return { success: true, message: 'You logged out successfully' }
        } catch (error) {
            return { success: false, message: 'Logout failed at UserContext. Please try again' }
        }
    }

    const googleLogin = async () =>{
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

    return (
        <UserContext.Provider value={{ user, setUser, isLogin, setIsLogin, register, login, logout, googleLogin }}>
            {children}
        </UserContext.Provider>
    )
}


export const useUserContext = () => {
    return useContext(UserContext);
}

