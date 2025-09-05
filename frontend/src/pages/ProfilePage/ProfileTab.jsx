const ProfileTabs = ({ activeTab, setActiveTab }) => {
    const tabs = ['Liked', 'Bookmarked'];

    const getTabClassName = (tabName) => {
        const isActive = activeTab === tabName.toLowerCase();
        return `
            sm:px-10 px-8 sm:py-5 py-3  font-semibold text-sm sm:text-base cursor-pointer transition-all duration-300
            border-b-3 
            ${isActive
                ? 'border-red-600 text-red-600 dark:text-red-500 dark:border-red-500 '
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }
        `;
    };
    return (
        <div className='border-b border-neutral-200 dark:border-neutral-700'>
            <ul className='flex flex-row justify-start sm:justify-center items-center'>
                {tabs.map(tab => (
                    <li key={tab} onClick={() => setActiveTab(tab.toLowerCase())} className={getTabClassName(tab)}>
                        {tab}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProfileTabs;