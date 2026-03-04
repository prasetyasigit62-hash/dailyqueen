'use client';

import { useEffect, useState } from 'react';
import { sanitize } from 'isomorphic-dompurify';

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

type eventType = {
    id: number;
    nama_event: string;
    deskripsi: string;
    gambar: string;
    tanggal_mulai: string;
    tanggal_berakhir: string;
};

type eventProps = {
    data: eventType[];
};

export default function ListNews(props: eventProps) {
    const { data } = props;
    const { width } = useWindowDimensions();
    const [slice, setSlice] = useState(4);
    useEffect(() => {
        if (width <= 750) {
            setSlice(3);
        }
    }, [width, slice]);
    return (
        <>
            {data.map((item: eventType) => (
                <div key={item.id} className="w-full lg:max-w-full lg:flex space-4 py-4 ps-4 md:ps-8 pe-4 border-b">
                    {item.gambar ? (
                        <div
                            className="h-48 lg:h-auto lg:w-72 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
                            style={{ backgroundImage: `url(${item.gambar})`, backgroundPosition: 'center' }}
                        />
                    ) : (
                        <div
                            className="h-48 lg:h-auto lg:w-72 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
                            style={{ backgroundImage: `url('/no_image_placeholder.png')`, backgroundPosition: 'center' }}
                        />
                    )}

                    <div className="p-6">
                        <h5 className="mb-2 text-xl font-medium leading-tight text-neutral-800">{item.nama_event}</h5>
                        <p
                            className="mb-4 text-base text-neutral-600"
                            // eslint-disable-next-line react/no-danger
                            dangerouslySetInnerHTML={{ __html: sanitize(item.deskripsi.replace(/\n/g, '<br />')) }}
                        />
                        <div className="inline-block rounded bg-[#29328d] px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-sm transition duration-150 ease-in-out">
                            Periode :{' '}
                            {new Date(`${item.tanggal_mulai}T00:00:00Z`).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                            })}
                            {' - '}
                            {new Date(`${item.tanggal_berakhir}T00:00:00Z`).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                            })}
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}
