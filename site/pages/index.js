import { FilterOptions } from "@/modules/filtering";
import { ProductCard } from "@/modules/product_card";
import searchAction from "@/modules/search_action";
import { SearchBar } from "@/modules/search_bar"
import searchTop from "@/modules/search_top_action";
import { SORT_OPTIONS, SortOptions } from "@/modules/sorting";
import { FeaturedSearchB } from "@/modules/top_searches"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react";

export default function X() {
    'use client';

    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [productsShow, setProductsShow] = useState([]);
    const [topSearches, setTopSearches] = useState([]);

    const [sortType, setSortType] = useState(0);

    const [showTopBtn, setShowTopBtn] = useState(false);

    useEffect(() => {
        SORT_OPTIONS[sortType].func(productsShow);
        setProductsShow(productsShow);
    }, [sortType, productsShow.length, productsShow]);

    useEffect(() => {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                setShowTopBtn(true);
            } else {
                setShowTopBtn(false);
            }
        });
    }, []);

    const goToTop = () => {
        window.scrollTo({
            top: 0,
        });
    };

    useEffect(() => {
        if (!loading) return;
        setProducts([]);
        if (loading) return;
        setLoading(true);

        searchAction(query).then((v) => {
            setLoading(false);
            setProducts(v);
        });
    }, [query, loading]);

    useEffect(() => {
        searchTop().then((v) => {
            setTopSearches(v)
        });
    }, []);

    useEffect(() => {
        setProductsShow(products)
    }, [products.length, products]);

    return <>
        <div className={'fixed w-full bg-amber-100 z-50 duration-300 ' + (showTopBtn ? 'drop-shadow-lg':'')}>
            <Link href='/' className='flex w-fit m-auto my-4'>
                <div className='my-auto sm:w-12 w-8 mr-6 mb-2'>
                    <Image src='/img/icon.png' alt='icon' width={250} height={250} />
                </div>
                <div className='my-auto sm:text-4xl text-2xl font-bold'>
                    eMarket
                </div>
            </Link>
        </div>
        <div className='sm:py-12 py-6 relative'>
        </div>

        <div className='max-w-xl m-auto lg:my-36 sm:my-24 my-16'>
            <div className='text-center sm:text-2xl text-lg font-medium'>
                Top Searches
            </div>
            <div className='flex flex-wrap sm:my-8 my-4'>
                {
                    ...topSearches.map((v, i) => {
                        return <FeaturedSearchB key={i} q={v} set={setQuery} />
                    })
                }
            </div>
        </div>

        <div className='m-auto max-w-xl px-4'>
            <SearchBar get={query} set={setQuery} />
        </div>

        { products.length > 0 ?
            <div className='max-w-xl m-auto px-4 relative'>
                <div className='text-center my-4 font-light opacity-80 sm:text-base text-sm'>
                    {products.length} products found for &quot;{query}&quot; query
                </div>
                <div className='w-fit m-auto my-8 flex flex-wrap'>
                    <SortOptions set={setSortType} get={sortType} />
                    <FilterOptions products={products} set={setProductsShow} />
                </div>
            </div>
            : ''
        }
        { loading ? 
            <div className='flex animate-bounce w-fit m-auto my-24 text-black opacity-40'>
                <div className='mr-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div>
                    Searching
                </div>
            </div> 
            :
            <div className='max-w-6xl flex flex-wrap m-auto mt-12'>
                {
                    ...productsShow.map((v, i) => {
                        return <ProductCard data={v} key={i} />;
                    })
                }
            </div>
        }
            { showTopBtn ? 
                <div onClick={goToTop} className='fixed bottom-4 right-4 duration-300 sm:right-5 bg-amber-100 border-[1px] border-b-l text-black rounded-full z-50 cursor-pointer p-3 hover:drop-shadow-md'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                    </svg>
                </div> : ''
            }
    </>
}