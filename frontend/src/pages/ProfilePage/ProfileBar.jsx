import InterestTag from './IntrestBtn';
import { MdEdit } from "react-icons/md";

const ProfileHeader = ({currOpen, user }) => {
    const interests = user.intrest;
    
    return (
        <header className='bg-white dark:bg-neutral-700/30 rounded-2xl p-6 sm:p-8 transition-colors duration-300 border 
        border-neutral-200 dark:border-neutral-700'>
            <div className='flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8'>
                <div className='flex-shrink-0'>
                    <img
                        className='h-28 w-28 sm:h-32 sm:w-32 rounded-full object-cover ring-4 ring-red-500 ring-offset-4 ring-offset-white dark:ring-offset-slate-800'
                        src={user?.avatar || "/defaultProfileImage.jpg"}
                        alt="User avatar"
                    />
                </div>

                <div className='flex flex-col items-center sm:items-start flex-1 w-full text-center sm:text-left'>
                    <div className="flex gap-2 items-center justify-center">
                        <p className='text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100'>
                            {user?.fullname}
                        </p>
                        <button onClick={() => currOpen(true)} className="cursor-pointer">
                            <MdEdit className="dark:text-neutral-300 text-neutral-700" />
                        </button>
                    </div>
                    <p className='text-red-500 dark:text-red-400 font-medium mt-1'>
                        {user?.email || "no-email@gmail.com"}
                    </p>
                    <p className='text-slate-600 dark:text-slate-400 text-sm sm:text-base my-4 max-w-2xl'>
                        {user?.about}
                    </p>

                    <ul className='flex flex-wrap items-center justify-center gap-2 mt-2'>
                        {interests?.map(interest => <InterestTag key={interest}>{interest}</InterestTag>)}
                    </ul>
                </div>
            </div>
        </header>
    );
};

export default ProfileHeader;