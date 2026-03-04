'use client';

import { useEffect, useState } from 'react';

function getWindowDimensions() {
    if (typeof window !== 'undefined') {
        const { innerWidth: width, innerHeight: height } = window;
        return {
            width,
            height,
        };
    }
    return {
        width: 0,
        height: 0,
    };
}

function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }
        if (typeof window !== 'undefined') {
            window.addEventListener('resize', handleResize);
        }
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
}

type newsType = {
    id: number;
    title: string;
    slug: string;
    image: string;
    meta_description: string;
};

type newProps = {
    data: newsType[];
};

export default function ListNews(props: newProps) {
    const { data } = props;
    const { width } = useWindowDimensions();
    const [slice, setSlice] = useState(3);
    useEffect(() => {
        if (width <= 750) {
            setSlice(2);
        }
    }, [width, slice]);
    return (
        <>
            {data.slice(slice).map((item: newsType) => (
                <div key={item.id} className="w-full lg:max-w-full lg:flex space-4 py-4 ps-4 md:ps-8 pe-4 border-b">
                    {item.image ? (
                        <div
                            className="h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
                            style={{ backgroundImage: `url(${item.image})` }}
                        />
                    ) : (
                        <div
                            className="h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
                            style={{ backgroundImage: `url('/no_image_placeholder.png')` }}
                        />
                    )}

                    <div className="p-6">
                        <h5 className="mb-2 text-xl font-medium leading-tight text-neutral-800">{item.title}</h5>
                        <p className="mb-4 text-base text-neutral-600">{item.meta_description}</p>
                        <div className="inline-block rounded bg-[#29328d] px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-sm transition duration-150 ease-in-out">
                            <a href={`/news/${item.slug}`}>Read More</a>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}
