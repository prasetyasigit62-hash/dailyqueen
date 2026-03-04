import React from 'react';
import Image from 'next/image';
import { sanitize } from 'isomorphic-dompurify';

import { aboutUsInterface } from '@/types/aboutUsInterface';

export default function AboutUsSection(props: aboutUsInterface) {
    const { about } = props;
    const data = about[0];
    return (
        <div>
            <section id="hero-image">
                <div className="flex justify-center">
                    <Image src={data.image_header} alt="hero image" height="0" width="0" sizes="100vw" className="w-full h-auto" priority />
                </div>
            </section>
            <section id="about-us">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-5 py-8">
                    <div>
                        <div className="text-center md:text-right">
                            <h1 className="font-bold text-[#29328d] text-6xl hidden md:block">
                                About
                                <br />
                                Us
                            </h1>
                            <h1 className="font-bold text-[#29328d] text-4xl block md:hidden">About Us</h1>
                        </div>
                        <div className="grid justify-items-end mt-3">
                            <div>
                                <Image src={data.image} alt="about us" height="0" width="0" sizes="100vw" className="w-96 h-auto" />
                            </div>
                        </div>
                    </div>
                    <div className="col-span-2">
                        <h2 className="font-bold text-[#29328d] text-3xl text-center md:text-left">{data.title}</h2>
                        {/* eslint-disable-next-line react/no-danger */}
                        <div className="text-sm md:text-base mt-5" dangerouslySetInnerHTML={{ __html: sanitize(data.content) }} />
                    </div>
                </div>
            </section>
        </div>
    );
}
