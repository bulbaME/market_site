import { useEffect, useRef, useState } from "react";

export const SORT_OPTIONS = [
    {
        inner: "By shop",
        func: (a) => a.sort(cmp_shop)
    },
    {
        inner: <div className='flex'>
            By price
            <div className='m-auto ml-1'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75" />
                </svg>
            </div>
        </div>,
        func: (a) => a.sort(cmp_price_dec)
    },
    {
        inner: <div className='flex'>
            By price
            <div className='m-auto ml-1'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75" />
                </svg>
            </div>
        </div>,
        func: (a) => a.sort(cmp_price_inc)
    }
]

const cmp_price_inc = (p1, p2) => {
    if (Number(p1['price']) > Number(p2['price'])) return -1;
    else return 1;
}

const cmp_price_dec = (p1, p2) => {
    if (Number(p1['price']) < Number(p2['price'])) return -1;
    else return 1;
}

const cmp_shop = (p1, p2) => {
    if (Number(p1['shop_id']) < Number(p2['shop_id'])) return -1;
    else return 1;
}

export function SortOptions(props) {
    'use client';

    const ref = useRef(null);

    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        document.addEventListener("mousedown", (e) => {
            if (ref.current && !ref.current.contains(e.target)) 
                setShowMenu(false);
        });
    }, []);

    return <div className='m-auto'> 
        <div className='border-[1px] rounded-full border-b-l flex relative m-4' ref={ref}>
            <div className='flex cursor-pointer px-3 p-1 bg-b-d text-white rounded-full hover:drop-shadow-lg duration-300' onClick={() => setShowMenu(!showMenu)}>
                <div className='font-semibold'>
                    Sort
                </div>
                <div className='ml-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" />
                    </svg>
                </div>
            </div>
            <div className='m-auto mx-2 whitespace-nowrap'>
                {SORT_OPTIONS[props.get].inner}
            </div>
            {
                showMenu ? 
                <div className='absolute p-2 bg-amber-100 border-[1px] border-b-l mt-10 rounded-xl drop-shadow-lg z-50'>
                    {
                        ...SORT_OPTIONS.map((v, i) => {
                            return <div key={i} className={'my-2 cursor-pointer px-2 hover:pl-4 hover:pr-0 duration-300 ' + (i == props.get ? 'font-medium':' font-light')} onClick={() => props.set(i)}>
                                {v.inner}
                            </div>
                        })
                    }
                </div>
                : ''
            }
        </div>
    </div>;
}