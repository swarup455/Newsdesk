const InterestTag = ({ children }) => {
    return (
        <li className='px-3 py-1.5 text-xs sm:text-sm text-red-500 dark:text-violet-200 bg-red-100 dark:bg-red-500/40 font-semibold rounded-full'>
            {children}
        </li>
    );
};

export default InterestTag;