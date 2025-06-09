import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUserContext } from '../../context/UserContext.jsx'
import {toast} from 'react-hot-toast'
import { Navigate } from 'react-router-dom'

const Register = () => {

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const { register } = useUserContext()

    const navigate = useNavigate()


    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const user = await register(firstName, lastName, email, password)
            if (!user.success) {
                setError(user.message)
                console.log('user already exist');
                toast.error('User already exist')
            } else {
                setError('')
                navigate('/login')
                toast.success('User created. please login')
            }
        } catch (error) {
            console.log('Error occurred while registering user');
            setError('An unexpected error occurred. Please try again.');
        }

        
    }

    return (
        <div className='flex items-center justify-center mt-10'>
            <form onSubmit={handleSubmit} class="bg-white text-gray-500 w-full max-w-[340px] mx-4 md:p-6 p-4 py-8 text-left text-sm rounded-lg shadow-[0px_0px_10px_0px] shadow-black/10">
                <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>

                <input id="firstName" class="w-full border mt-1 bg-indigo-500/5 mb-2 border-gray-500/10 outline-none rounded py-2.5 px-3" type="text" placeholder="firstName" name='firstName' value={firstName} onChange={e => setFirstName(e.target.value)} required />

                <input id="lastName" class="w-full border mt-1 bg-indigo-500/5 mb-2 border-gray-500/10 outline-none rounded py-2.5 px-3" type="text" placeholder="lastName" name='lastName' value={lastName} onChange={e => setLastName(e.target.value)} required />

                <input id="email" class="w-full border mt-1 bg-indigo-500/5 mb-2 border-gray-500/10 outline-none rounded py-2.5 px-3" type="email" placeholder="Email" name='email' value={email} onChange={e => setEmail(e.target.value)} required />

                <input id="password" class="w-full border mt-1 bg-indigo-500/5 mb-7 border-gray-500/10 outline-none rounded py-2.5 px-3" type="text" placeholder="Password" name='password' value={password} onChange={e => setPassword(e.target.value)} required />

                <button class="w-full mb-3 bg-indigo-500 hover:bg-indigo-600 transition-all active:scale-95 py-2.5 rounded text-white font-medium">Create Account</button>

                <Link to='/login'>
                    <p class="text-center mt-4">Already have an account? Log In</p>
                </Link>
            </form>

        </div>
    )
}

export default Register
