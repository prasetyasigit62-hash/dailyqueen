/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable prettier/prettier */
/* eslint-disable @next/next/no-img-element */

'use client';

import Image from 'next/image';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Keyboard, Navigation, Pagination } from 'swiper/modules';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { bannerInterface } from '@/types/bannerInterface';

export default function HeroImage({ banner }: bannerInterface) {
    return (
        <section id="home" className="h-1/4">
            <Swiper
                // @ts-ignore
                autoplay={{
                    delay: 10000,
                    disableOnInteraction: false,
                }}
                keyboard={true}
                navigation={true}
                pagination={true}
                modules={[Autoplay, Pagination, Navigation, Keyboard]}
                className="bannerSwiper"
            >
                {banner.map((item) => (
                    <SwiperSlide key={item.id}>
                        <Image src={item.image} alt={item.title} width="0" height="0" sizes="100vw" className="w-full h-auto" priority />
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}
