import React from 'react';
import { Link } from 'react-router-dom';

function SquareCard({ image, title, logotext, logoImage, description, timestamp, path }) {
    return (
        <article className="group flex flex-col rounded-xl overflow-hidden hover:-translate-y-1 transition-all duration-300 ease-in-out 
        dark:bg-neutral-700/20 bg-white p-1.5 border border-neutral-200 dark:border-neutral-700">
            <Link to={path} className="w-full aspect-[4/3] rounded-lg overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="h-full w-full object-cover"
                />
            </Link>
            <div className="p-4 flex flex-col flex-grow">
                <Link to={path} className="flex-grow">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 line-clamp-2">
                        {title}
                    </h3>
                    <p className='mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-3'>
                        {description}
                    </p>
                </Link>

                <div className="mt-4 pt-3 border-t border-slate-200/40 dark:border-neutral-700/40 w-full flex justify-between items-center">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2">
                        <img className='h-5 w-5 rounded-full' src={logoImage} alt="logoimage" />
                        {logotext}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {timestamp}
                    </span>
                </div>
            </div>
        </article>
    );
}

export default SquareCard;