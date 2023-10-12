import Link from "next/link";

export function FeaturedSearchB(props) {
    return <div className='m-auto w-fit px-3 py-1 cursor-pointer' onClick={() => props.set(props.q)}>
        <div className='sm:text-base text-sm font-medium text-white text-center bg-b-d min-w-[3rem] px-3 py-1 rounded-full hover:drop-shadow-lg duration-300'>
            {props.q}
        </div>
    </div>;
}