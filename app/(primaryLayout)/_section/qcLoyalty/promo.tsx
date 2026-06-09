import Image from 'next/image';
import { useState } from 'react';
import { Autoplay, Keyboard, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { promoInterface } from '@/types/promoInterface';
import Modal from '@/components/modal';

type propsInterface = {
    className: string;
    promo: promoInterface[];
};

export default function Promo({ className, promo }: propsInterface) {
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
            <div className={className}>
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
                            slidesPerView: 3,
                            spaceBetween: 70,
                        },
                    }}
                    keyboard
                    modules={[Autoplay, Keyboard, Pagination]}
                    pagination
                    className="bannerSwiper swiper-bottom-pagination"
                >
                    {promo.map((item) => (
                        <SwiperSlide key={item.id} className="cursor-pointer">
                            <div className="flex gap-4 md:shadow-lg p-3 md:rounded-lg justify-center">
                                <div className="lg:basis-1/2 lg:flex items-center hidden">
                                    <div>
                                        <h3 className="text-[#29328d] font-bold text-xl mb-3 text-center lg:text-start">{item.nama}</h3>
                                        <p className="text-gray-500 leading-tight text-sm">{item.deskripsi}</p>
                                        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                                        <div
                                            className="rounded-full bg-[#29328d] py-1.5 px-3 w-fit text-white text-xs my-2 cursor-pointer"
                                            onClick={() => openModal(item)}
                                        >
                                            Read More
                                        </div>
                                    </div>
                                </div>
                                <div className="lg:basis-1/2">
                                    {item.image && <Image src={item.image} className="rounded-xl w-auto" alt="tenant" width={200} height={200} />}
                                    <div className="lg:basis-1/2 items-center block lg:hidden my-3">
                                        <p className="text-gray-500 leading-tight text-sm">{item.simpleDescription}</p>
                                        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                                        <div className="text-[#29328d] my-1 cursor-pointer text-sm font-semibold" onClick={() => openModal(item)}>
                                            Read More
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <Modal title="" isOpen={isOpen} closeModal={closeModal} className="max-w-md bg-black/80 p-8 rounded-tr-3xl rounded-bl-3xl">
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
