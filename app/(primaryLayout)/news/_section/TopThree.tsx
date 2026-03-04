'use client';

import Image from 'next/image';
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

export default function TopThree(props: newProps) {
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
            {data.slice(0, slice).map((item: newsType) => (
                <div key={item.id} className="block rounded-lg bg-white shadow-sm border">
                    {item.image && (
                        <div className="relative overflow-hidden bg-cover bg-no-repeat">
                            <Image
                                src={item.image}
                                height="0"
                                width="0"
                                sizes="100vw"
                                className="w-full h-auto rounded-t-lg"
                                alt={item.title}
                                loading="eager"
                            />
                            <a href={`/news/${item.slug}`}>
                                <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[hsla(0,0%,98%,0.15)] bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100" />
                            </a>
                        </div>
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
