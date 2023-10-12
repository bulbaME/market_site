import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/router'

export function SearchBar(props) {
    'use client';

    const [query, setQuery] = useState(props.get);
    const router = useRouter();
    const e = useRef();

    const search = () => {
        props.set(query)
    };

    const handleEnter = (e) => {
        if (e.key == 'Enter') {
            search();
        }
    };

    useEffect(() => {
        e.current.value = props.get;
    }, [props.get])

    return <div className='bg-b-l sm:p-3 p-2 rounded-lg w-full flex'>
        <input ref={e} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleEnter} className='bg-transparent outline-none sm:text-lg w-full px-1' />
        <div className='w-fit mr-0 m-auto pl-2 hover:cursor-pointer' onClick={search}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
        </div>
    </div>
}