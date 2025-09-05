import React from 'react'
import { RxCross2 } from "react-icons/rx";
import { CgProfile } from "react-icons/cg";
import { FaSignOutAlt } from "react-icons/fa";
import { logoutUser } from '../../../redux-toolkit/Auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function ProfileMenu({ isOpen, onClose }) {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch()

    const handleSignOutClick = () => {
        dispatch(logoutUser())
        onClose()
    }
    if (!isOpen) return null

    return (
        <div
            className='w-40 md:w-50 rounded-lg bg-white shadow-md dark:bg-neutral-800 absolute z-50 top-15 right-8 md:top-20 md:right-20 p-4 flex flex-col'>
            <RxCross2
                onClick={onClose}
                className='absolute right-2 top-2 text-gray-600 dark:text-gray-400'
            />
            <div className='flex flex-col items-center gap-3'>
                <img
                    className='w-2/5 aspect-square rounded-full'
                    src={user?.avatar || "/defaultProfileImage.jpg"} alt="" />
                <p className='text-sm sm:text-lg font-semibold'>welcome {user.fullname.split(" ")[0].toLowerCase()}</p>
            </div>
            <div className='mt-2 text-sm text-gray-400'>
                <ul>
                    <li
                        className='my-4 flex items-center gap-3 text-gray-600 dark:text-gray-400 font-semibold'>
                        <CgProfile />
                        <Link to={`/profile/${user._id}`}>Profile</Link>
                    </li>
                    <li
                        onClick={handleSignOutClick}
                        className='my-3 flex items-center gap-3 text-gray-600 dark:text-gray-400 font-semibold'>
                        <FaSignOutAlt />
                        Sign out
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default ProfileMenu
