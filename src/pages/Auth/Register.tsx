import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

import API from '@/provider/API';

const Register = () => {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');

    const Register = async () => {
        try {
            const registerRes = await API.auth.register({
                name,
                email,
                password: password,
                confPassword: confPassword
            })
            if(registerRes.data.msg === "Registration Successful"){
                navigate("/login");
            }
        } catch (error) {
        }
    }

    return (
        <div className="bg-grey-lighter min-h-screen flex flex-col">
            <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
                <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
                    <h1 className="mb-8 text-3xl text-center">Sign up</h1>
                    <input
                        type="text"
                        value={name} onChange={(e) => setName(e.target.value)}
                        className="block border border-grey-light w-full p-3 rounded mb-4"
                        name="fullname"
                        placeholder="Full Name" />

                    <input
                        type="text"
                        value={email} onChange={(e) => setEmail(e.target.value)}
                        className="block border border-grey-light w-full p-3 rounded mb-4"
                        name="email"
                        placeholder="Email" />

                    <input
                        type="password"
                        value={password} onChange={(e) => setPassword(e.target.value)}
                        className="block border border-grey-light w-full p-3 rounded mb-4"
                        name="password"
                        placeholder="Password" />
                    <input
                        type="password"
                        value={confPassword} onChange={(e) => setConfPassword(e.target.value)}
                        className="block border border-grey-light w-full p-3 rounded mb-4"
                        name="confirm_password"
                        placeholder="Confirm Password" />

                    <button
                        type="submit"
                        onClick={Register}
                        className="w-full text-center py-3 rounded bg-button-green text-white focus:outline-none my-1"
                    >Create Account</button>
                </div>

                <div className="text-grey-dark dark:text-white mt-6">
                    Already have an account?
                    <Link className="border-b border-blue text-blue px-5" to="/login">
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    )
}


export default Register;