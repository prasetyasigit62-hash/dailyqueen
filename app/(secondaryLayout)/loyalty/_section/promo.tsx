/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable prettier/prettier */
/* eslint-disable @next/next/no-img-element */

'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Autoplay, Keyboard, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { promoInterface } from '@/types/promoInterface';
import Modal from '@/components/modal';

type propsInterface = {
    promo: promoInterface[];
};

function Promo({ promo }: propsInterface) {
    const [isOpen, setIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState({
        nama: '' as string,
        deskripsi: '' as string,
        image: '' as string,
    });
    const closeModal = () => {
        setIsOpen(false);
    };
    const openModal = (data: any) => {
        setModalContent({
            nama: data.nama,
            deskripsi: data.deskripsi,
            image: data.image,
        });
        setIsOpen(true);
    };
    return (
        <>
            <div className="lg:bg-white/25 lg:rounded-xl mx-2">
                <div className="container mx-auto py-5 lg:py-10">
                    {promo.length > 0 && (
                        <Swiper
                            autoplay={{
                                delay: 10000,
                                disableOnInteraction: false,
                            }}
                            breakpoints={{
                                200: {
                                    slidesPerView: 1,
                                    spaceBetween: 10,
                                },
                                540: {
                                    slidesPerView: 2,
                                    spaceBetween: 30,
                                },
                            }}
                            keyboard
                            initialSlide={0}
                            pagination={true}
                            modules={[Autoplay, Keyboard, Pagination]}
                            className="bannerSwiper swiper-bottom-pagination"
                        >
                            {promo.map((item) => (
                                <SwiperSlide key={item.id} className="cursor-pointer">
                                    <div className="flex w-full lg:gap-4">
                                        <div className="lg:basis-1/2 lg:flex items-center hidden">
                                            <div>
                                                <h3 className="text-white font-bold text-xl mb-3 text-center lg:text-start">{item.nama}</h3>
                                                <p className="text-white leading-tight text-sm">{item.deskripsi}</p>
                                                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                                                <div
                                                    className="rounded-full bg-white py-1.5 px-3 w-fit text-black text-xs my-2 cursor-pointer"
                                                    onClick={() => openModal(item)}
                                                >
                                                    Read More
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full mx-5 lg:mx-0">
                                            <h3 className="text-white font-bold text-xl lg:mb-10 mb-6 text-center lg:text-start lg:hidden">
                                                {item.nama}
                                            </h3>
                                            <Image
                                                src={item.image}
                                                className="rounded-xl w-full"
                                                alt="tenant"
                                                width={0}
                                                height={0}
                                                sizes="100vw"
                                                priority
                                            />
                                            <div className="lg:basis-1/2 items-center block lg:hidden my-3">
                                                <p className="text-white leading-tight text-sm">{item.simpleDescription}</p>
                                                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                                                <div className="text-white my-1 cursor-pointer text-sm font-semibold" onClick={() => openModal(item)}>
                                                    Read More
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
                </div>
            </div>
            <Modal title="" isOpen={isOpen} closeModal={closeModal} className="max-w-md md:mx-0 mx-5 bg-black/80 p-8 rounded-tr-3xl rounded-bl-3xl">
                <div>
                    {/* eslint-disable-next-line jsx-a11y/alt-text, jsx-a11y/alt-text */}
                    <Image
                        src={modalContent.image}
                        className="w-auto rounded-xl"
                        alt="detailtenant"
                        width={400}
                        height={200}
                        priority
                        loading="eager"
                    />
                    <h3 className="text-xl font-bold text-white my-1">{modalContent.nama}</h3>
                    <p className="text-sm font-medium text-white">{modalContent.deskripsi}</p>
                </div>
            </Modal>
        </>
    );
}

export default Promo;
