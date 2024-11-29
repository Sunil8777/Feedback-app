"use client";

import { useState } from "react";

const SignUpPage = () => {
    const [username, setUsername] = useState("");

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h1 className="text-xl font-bold">Sign Up</h1>
                <form className="space-y-4">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md"
                        />
                    </div>
                    <button
                        type="button"
                        className="w-full px-4 py-2 text-white bg-blue-500 rounded-md"
                    >
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignUpPage;
