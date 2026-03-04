'use client';

import Image from 'next/image';
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

export default function TopThree(props: eventProps) {
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
            {data.slice(0, slice).map((item: eventType) => (
                <div key={item.id} className="block rounded-lg bg-white shadow-sm border">
                    {item.gambar && (
                        <div className="relative overflow-hidden bg-cover bg-no-repeat">
                            <Image
                                src={item.gambar}
                                height="0"
                                width="0"
                                sizes="100vw"
                                className="w-full h-auto rounded-t-lg"
                                alt={item.nama_event}
                                loading="eager"
                            />
                        </div>
                    )}

                    <div className="p-6">
                        <h5 className="mb-2 text-xl font-medium leading-tight text-neutral-800">{item.nama_event}</h5>
                        <p
                            className="mb-4 text-base text-neutral-600"
                            // eslint-disable-next-line react/no-danger
                            dangerouslySetInnerHTML={{ __html: sanitize(item.deskripsi.replace(/\n/g, '<br />')) }}
                        />
                        <div className="inline-block rounded bg-[#29328d] px-3 pb-2 pt-2.5 text-xs font-medium leading-normal text-white shadow-sm transition duration-150 ease-in-out">
                            <div className="hidden md:block">
                                Periode :{' '}
                                {new Date(`${item.tanggal_mulai}T00:00:00Z`).toLocaleDateString('en-US', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                })}
                                {' - '}
                                {new Date(`${item.tanggal_berakhir}T00:00:00Z`).toLocaleDateString('en-US', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                })}
                            </div>
                            <div className="block md:hidden">
                                from {new Date(`${item.tanggal_mulai}T00:00:00Z`).toLocaleDateString('en-US', { timeZone: 'UTC' })}
                                <br />
                                to {new Date(`${item.tanggal_berakhir}T00:00:00Z`).toLocaleDateString('en-US', { timeZone: 'UTC' })}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}
