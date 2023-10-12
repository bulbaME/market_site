import Image from "next/image";
import Link from "next/link";

const IMAGE_MAP = {
    1: '/img/darwin_md.png',
    2: '/img/enter_md.png',
    3: '/img/accent_md.png',
    4: '/img/maximum_md.png'
};

export function ProductCard(props) {
    let data = props.data

    data['specs'] = data['specs'].filter((v) => v.length > 0)

    return <div className='mx-auto md:p-4 p-2 duration-300 md:py-8 py-4 sm:w-auto w-[45%]'><Link href={data['link']} rel='noopener noreferrer' target='_blank'>
        <div className='rounded-xl md:w-[15rem] sm:w-[12rem] relative cursor-pointer border-[1px] border-b-l bg-amber-100 hover:drop-shadow-lg duration-300 '>
            <div className='absolute w-8 -translate-y-1/3 right-0 translate-x-1/3 bg-white rounded-lg'>
                <Image alt='shop icon' src={IMAGE_MAP[data['shop_id']]} width={50} height={50} className='rounded-lg' />
            </div>
            <div className='bg-white rounded-t-xl'>
                <div className='rounded-md m-auto w-fit p-4'>
                    <Image alt={data['name']} src={data['image_url']} width={200} height={200} className='w-auto' />
                </div>
            </div>
            <div className='p-4'>
                <div className='md:text-lg sm:text-base text-sm font-semibold'>
                    {data['name']}
                </div>
                <div className='my-2 font-light sm:text-sm text-xs'>
                    {data['description']}
                </div>
                <div className='flex flex-wrap'>
                    {
                        data['specs'].map((v, i) => {
                            return <div key={i} className='m-auto'>
                                <div className='px-2 p-1 rounded-full drop-shadow-sm sm:text-sm text-xs font-medium text-center bg-b-l m-1'>
                                    {v}
                                </div>
                            </div>
                        })
                    }
                </div>
                <div className='mt-8 md:text-lg sm:text-base text-sm text-center font-medium px-2 p-1 border-[1px] hover:border-g hover:text-g border-b-l duration-300 rounded-full w-fit m-auto flex'>
                    <div className='m-auto whitespace-nowrap'>
                        {data['price']} MDL
                    </div>
                    <div className='ml-2 m-auto'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="sm:w-6 sm:h-6 w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    </Link></div>;
}