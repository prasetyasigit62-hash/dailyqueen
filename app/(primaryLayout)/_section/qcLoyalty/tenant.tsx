import Image from 'next/image';
import { useState } from 'react';
import { Autoplay, Keyboard, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { tenantInterface } from '@/types/tenantInterface';
import Modal from '@/components/modal';

type propsInterface = {
    tenant: tenantInterface[];
    className: string;
};

export default function Tenant({ tenant, className }: propsInterface) {
    const [isOpen, setIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState({
        nama: '' as string,
        nama_mall: '' as string,
        lantai: '' as string,
        gambarTenant: '' as string,
        deskripsi: '' as string,
    });
    const closeModal = () => {
        setIsOpen(false);
    };
    const openModal = (data: any) => {
        setModalContent({
            nama: data.nama,
            nama_mall: data.lokasi.nama_mall,
            lantai: data.lantai.nama,
            gambarTenant: data.gambarTenant,
            deskripsi: data.description,
        });
        setIsOpen(true);
    };
    return (
        <>
            <div className={className}>
                <h3 className="text-[#29328d] font-bold text-xl lg:mb-3 mb-10 text-center lg:text-start">More Tenant</h3>
                <div className="lg:mx-7 relative">
                    <Swiper
                        autoplay={{
                            delay: 10000,
                            disableOnInteraction: false,
                        }}
                        breakpoints={{
                            200: {
                                slidesPerView: 2,
                                spaceBetween: 10,
                            },
                            540: {
                                slidesPerView: 4,
                                spaceBetween: 20,
                            },
                        }}
                        keyboard
                        navigation
                        modules={[Autoplay, Pagination, Navigation, Keyboard]}
                        className="bannerMoreFeatures"
                    >
                        {tenant.map((item) => (
                            <SwiperSlide key={item.id} className="cursor-pointer flex w-full items-center" onClick={() => openModal(item)}>
                                <div className="flex items-center justify-center">
                                    <Image
                                        src={item.thumbnail}
                                        className="shadow-md mb-2 lg:rounded-full 2xl:w-40 2xl:h-40 xl:w-36 xl:h-36 w-40 h-40 p-2 bg-slate-100 rounded-full"
                                        alt="tenant"
                                        width={0}
                                        height={0}
                                        sizes="100vw"
                                        priority
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
            <Modal title="" isOpen={isOpen} closeModal={closeModal} className="max-w-md bg-black/80 p-8 rounded-tr-3xl rounded-bl-3xl">
                <div>
                    {/* eslint-disable-next-line jsx-a11y/alt-text, jsx-a11y/alt-text */}
                    <Image src={modalContent.gambarTenant} className="w-auto rounded-xl" alt="detailtenant" width={400} height={200} priority />
                    <h3 className="text-xl font-bold text-white my-1">{modalContent.nama}</h3>
                    <p className="text-md text-white font-medium">
                        Location : {modalContent.nama_mall} {modalContent.lantai}
                    </p>
                    <p className="text-md text-white font-bold mb-2">Get More Rewards Point</p>
                    <p className="text-sm font-medium text-white">{modalContent.deskripsi}</p>
                </div>
            </Modal>
        </>
    );
}
