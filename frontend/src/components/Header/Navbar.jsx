import { MdOutlineLightMode } from "react-icons/md";
import { CiLogin } from "react-icons/ci";
import { GoSearch } from "react-icons/go";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import categories from "../../data/mockCategories";
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import useScrollDirection from '../../customHooks/scrollDirection';
import useTheme from '../../context/ThemeSwitcher';
import { useSelector } from 'react-redux';
import LoginPopup from '../Popup/Login/LoginPopup';
import { useState } from 'react';
import ProfileMenu from "../../components/Popup/Profile/ProfileMenu";
import { GiNightSleep } from "react-icons/gi";
import { RxCross2 } from "react-icons/rx";
import { Newspaper } from 'lucide-react';

function Header() {
    const menuRef = useRef();
    const scrollRef = useRef();

    const scrollLeft = () => {
        scrollRef.current.scrollBy({ left: -80, behavior: 'smooth' });
    };
    const scrollRight = () => {
        scrollRef.current.scrollBy({ left: 80, behavior: 'smooth' });
    };
    const scroll = useScrollDirection();

    const { themeMode, lightTheme, darkTheme } = useTheme();
    const user = useSelector((state) => state.auth.user);

    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false)

    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = () => {
        if (!query.trim()) return;
        navigate(`/search?query=${query}`);
    };
    const removeQuery = () => {
        setQuery("")
    }
    useEffect(() => {
        const handleClickOutsideMenu = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setProfileMenuOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutsideMenu)
        return () => document.removeEventListener("mousedown", handleClickOutsideMenu)
    }, [setProfileMenuOpen])

    useEffect(() => {
        let timer;
        if (!user) {
            timer = setTimeout(() => {
                setIsLoginOpen(true);
            }, 3000);
        } else {
            setIsLoginOpen(false);
            clearTimeout(timer);
        }
        return () => clearTimeout(timer);
    }, [user]);

    return (
        <div className='w-full max-w-5xl mx-auto bg-white dark:bg-neutral-950 z-50 sticky top-0'>
            <div className={`overflow-hidden w-full flex justify-between items-center transition-all duration-150 ease-in-out
                ${scroll === 'down' ? 'h-0' : 'h-18 sm:h-23'}`}>
                <div className="flex items-center gap-2 py-3 m-3 sm:m-4 cursor-pointer">
                    <Newspaper className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-red-500" strokeWidth={2} />
                    <span className="text-xl sm:text-2xl md:text-3xl text-gray-700 dark:text-gray-100 font-bold font-newscycle tracking-tight">
                        NEWSDESK
                    </span>
                </div>
                <div className="hidden sm:flex w-1/3 px-3 bg-neutral-100 dark:bg-neutral-800/50 rounded-full m-4 justify-center items-center 
                border border-transparent focus-within:border-neutral-300 dark:focus-within:border-neutral-600 
                focus-within:bg-white dark:focus-within:bg-neutral-800 transition-colors">
                    <button onClick={handleSearch} className="cursor-pointer shrink-0">
                        <GoSearch className='text-neutral-400 dark:text-neutral-500' size={16} />
                    </button>
                    <input
                        type="text"
                        placeholder="Search here"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleSearch();
                            }
                        }}
                        className="placeholder-gray-400 dark:text-white text-black w-full px-3 py-2.5 text-sm bg-transparent focus:outline-none"
                    />
                    <button
                        onClick={removeQuery}
                        className={`shrink-0 cursor-pointer text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors ${!query.trim() && "hidden"}`}>
                        <RxCross2 size={16} />
                    </button>
                </div>
                <div ref={menuRef} className="ml-4 py-5 flex justify-between items-center gap-x-4 sm:gap-x-6 text-lg sm:text-xl
                 text-gray-700 dark:text-gray-400 cursor-pointer">
                    <Link to={"/search-page"}><GoSearch className='sm:hidden cursor-pointer' /></Link>
                    <GiNightSleep
                        className={`${themeMode === "light" ? "hidden" : "block"}`}
                        onClick={() => themeMode === "light" ? darkTheme() : lightTheme()} />
                    <MdOutlineLightMode
                        className={`${themeMode === "dark" ? "hidden" : "block"}`}
                        onClick={() => themeMode === "light" ? darkTheme() : lightTheme()} />
                    {user ? (
                        <div onClick={() => {
                            setProfileMenuOpen(prev => !prev)
                        }}
                            className="w-5 h-5 sm:w-7 sm:h-7 rounded-full overflow-hidden">
                            <img
                                src={user?.avatar || "/defaultProfileImage.jpg"}
                                alt="profile"
                                className='w-full h-full object-cover'
                            />
                        </div>
                    ) : (
                        <CiLogin />
                    )}
                    <ProfileMenu isOpen={profileMenuOpen} onClose={() => setProfileMenuOpen(false)} />
                    <LoginPopup isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
                </div>
            </div>
            <div className="w-full flex items-center gap-2 rounded-2xl p-2 bg-white dark:bg-neutral-700/30 border 
            border-neutral-200 dark:border-neutral-700">
                <IoIosArrowBack onClick={scrollLeft} className='text-gray-600 dark:text-gray-200 text-2xl cursor-pointer 
                hover:text-black transition' />
                <ul ref={scrollRef} className="flex justify-between w-full whitespace-nowrap overflow-x-auto no-scrollbar">
                    {categories.map(({ id, title, link }) => (
                        <li key={id} className="px-4 py-4 lg:px-10 font-semibold text-[12px] sm:text-[16px]">
                            <NavLink to={link}
                                className={({ isActive }) => `${isActive ? "text-red-600 dark:text-red-500" : "text-gray-700 dark:text-gray-400"}`}>
                                {title}
                            </NavLink>
                        </li>
                    ))}
                </ul>
                <IoIosArrowForward onClick={scrollRight} className='text-gray-600 dark:text-gray-200 text-2xl cursor-pointer hover:text-black transition' />
            </div>
        </div>
    )
}

export default Header