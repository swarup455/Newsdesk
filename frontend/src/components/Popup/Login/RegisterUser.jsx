import { FcGoogle } from "react-icons/fc";
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { signInWithGoogle, signUpWithEmailAndPassword } from '../../../redux-toolkit/Auth/authSlice.js';
import { CgSpinner } from "react-icons/cg";
import { clearError } from "../../../redux-toolkit/Auth/authSlice.js";
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

function RegisterUser({ isOpen, onClose, switchToLogin }) {
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [password, setPassword] = useState("");
    const [notMatch, setNotMatch] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const { user, status, error } = useSelector((state) => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (currentPassword !== password) {
            setNotMatch(true);
            return;
        }
        setNotMatch(false);
        dispatch(signUpWithEmailAndPassword({ email, password }));
    };
    const handleGoogleSignIn = () => {
        dispatch(signInWithGoogle());
    };
    //handle error
    useEffect(() => {
        if (error) {
            alert(error);
            dispatch(clearError()); // reset the error in Redux
        }
    }, [error, dispatch]);

    useEffect(() => {
        if (user) {
            onClose();
        }
    }, [user, onClose]);
    if (!isOpen) return null;

    return (
        <div className="fixed px-5 sm:px-10 inset-0 z-50 flex items-center justify-center bg-neutral-950/60">
            <div className="w-full max-w-md bg-white dark:bg-neutral-800 rounded-sm shadow-xl px-8 py-5 relative">
                <h2 className="text-2xl sm:mt-10 font-semibold text-center text-gray-800 dark:text-white">
                    Sign up to continue
                </h2>
                <p className="text-xs text-center text-gray-500 dark:text-neutral-400 mt-2 mb-10">
                    Create an account to get started.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-3">
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-neutral-500" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                className="text-sm w-full pl-10 pr-4 py-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl focus:outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-neutral-500"
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-neutral-500" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="New password"
                                className="text-sm w-full pl-10 pr-10 py-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl focus:outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-neutral-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-neutral-500" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder={notMatch ? "Password do not match" : "Confirm Password"}
                                className="text-sm w-full pl-10 pr-10 py-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl focus:outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-neutral-500"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="text-sm w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 flex items-center justify-center gap-2"
                    >
                        {status == "loading" &&
                            <CgSpinner size={20} className="animate-spin" />
                        }
                        Sign up
                    </button>
                </form>

                <p className='w-full p-4 gap-2 flex justify-center items-center text-sm'>
                    Already have an account?
                    <button onClick={switchToLogin} className='cursor-pointer font-semibold text-red-500'>
                        Login
                    </button>
                </p>

                <div className="my-6 flex items-center">
                    <hr className="flex-grow border-gray-400" />
                    <span className="px-3 text-gray-500 text-sm">OR</span>
                    <hr className="flex-grow border-gray-400" />
                </div>

                <button
                    onClick={handleGoogleSignIn}
                    className="w-full flex items-center justify-center gap-2 border border-gray-200 text-sm text-gray-700 py-3 sm:mb-10 rounded-lg cursor-pointer"
                >
                    <FcGoogle size={22} />
                    Continue with Google
                </button>
            </div>
        </div>
    )
}

export default RegisterUser