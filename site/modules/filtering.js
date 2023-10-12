import { useEffect, useRef, useState } from "react";

function FilterOpt(props) {
    'use client';

    const [s, setS] = useState(false);

    useEffect(() => {
        setS(props.get.includes(props.text));
    }, [props.text])

    return <div className='w-fit'>
        <div className={'sm:text-base m-0.5 text-sm md:px-2 my-1 px-1.5 p-0.5 border-[1px] rounded-full duration-300 cursor-pointer bg-amber-100 border-b-l ' + (s ? 'bg-b-l text-black font-medium':'hover:drop-shadow-md font-light')} onClick={() => {
            props.set(!s, props.text);
            setS(!s);
        }}>
            {props.text}
        </div>
    </div>
}

export function FilterOptions(props) {
    'use client';

    const ref = useRef(null);

    const [showMenu, setShowMenu] = useState(false);

    const [filters, setFilters] = useState([]);
    const [selected, setSelected] = useState([]);
    const [change, setChange] = useState(false);

    const getFilters = (p) => {
        let f = new Set();
        p.forEach((v) => {
            v['specs'].forEach((v) => {
                if (v.length == 0) return;
                f.add(v);
            });
        });

        f = Array.from(f);
        f.sort();

        return f;
    }

    useEffect(() => {
        let p = props.products;
        if (!change) return;
        setChange(false); 

        p = p.filter((v) => {
            let valid = false;

            for (let i = 0; i < selected.length; i++) {
                if (v['specs'].includes(selected[i])) {
                    valid = true;
                    break;
                }
            }

            return valid || selected.length == 0;
        });

        // let new_filters = getFilters(p);
        
        // setFilters(new_filters);
        props.set(p);
    }, [change]);

    useEffect(() => {
        let f = getFilters(props.products);

        setFilters(f);
    }, [props.products]);

    useEffect(() => {
        document.addEventListener("mousedown", (e) => {
            if (ref.current && !ref.current.contains(e.target)) 
                setShowMenu(false);
        });
    }, []);

    return <div className='m-auto'>
        <div className='border-[1px] rounded-full border-b-l flex m-4' ref={ref}>
            <div className='flex cursor-pointer px-3 p-1 bg-b-d text-white rounded-full hover:drop-shadow-lg duration-300' onClick={() => setShowMenu(!showMenu)}>
                <div className='font-semibold'>
                    Selector
                </div>
                <div className='ml-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
                    </svg>
                </div>
            </div>
            <div className='m-auto mx-2 whitespace-nowrap'>
                {selected.length} selected
            </div>
            <div className={'p-3 bg-amber-100 border-[1px] border-b-l mt-10 rounded-xl drop-shadow-lg z-50 flex flex-wrap left-1 ' + (showMenu ? 'absolute':'hidden')}>
                {   
                    ...filters.map((v, i) => {
                        return <FilterOpt key={i} set={(b, t) => {b ? selected.push(t) : selected.splice(selected.indexOf(t), 1); setSelected(selected); setChange(true)}} get={selected} text={v} />
                    })
                }
            </div>
        </div>
    </div>;
}