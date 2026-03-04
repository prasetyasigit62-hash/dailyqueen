import Image from 'next/image';
import React from 'react';
import { aboutUsInterface } from '@/types/aboutUsInterface';

interface CardProps {
    nama: string;
    image: string;
}

function CardService(props: CardProps) {
    const { nama, image } = props;
    return (
        <div className="bg-[#29328d] rounded-xl shadow flex justify-between items-center relative overflow-hidden">
            <div className="text-white px-6 py-4">{nama}</div>
            <div className="bg-[#0c112e] translate-x-4 -skew-x-[20deg] transform py-4 px-20">
                <div className="skew-x-[20deg]">
                    <Image src={image} alt={nama} height="0" width="0" sizes="100vw" className="w-full h-16" loading="eager" />
                </div>
            </div>
        </div>
    );
}

export default function OurServices(props: aboutUsInterface) {
    const { service, color } = props;
    return (
        <section id="our-services">
            <div className="text-white px-5 py-8" style={{ backgroundColor: color }}>
                <h2 className="font-bold text-4xl md:text-5xl text-white text-center">Our Services</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:px-5 py-8">
                    {service.map((serv, index: number) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <CardService key={`service-${index}`} nama={serv.nama} image={serv.image} />
                    ))}
                </div>
            </div>
        </section>
    );
}
