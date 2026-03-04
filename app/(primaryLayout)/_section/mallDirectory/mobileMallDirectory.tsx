import Image from 'next/image';
import { Dispatch, SetStateAction, useState } from 'react';
import Modal from '@/components/modal';
import { Floor } from '@/types/mallDirectoryInterface';

type MallProps = {
    mall: Floor[];
    tenant: Floor['tenant'];
    setTenant: Dispatch<SetStateAction<Floor['tenant']>>;
};
function MobileMallDirectory({ mall, tenant, setTenant }: MallProps) {
    const [isOpen, setIsOpen] = useState(false as boolean);
    const [activeTenant, setActiveTenant] = useState({
        index: 0 as number,
        category: mall ? mall[0].nama : '',
    });
    const [detailTenant, setDetailTenant] = useState({
        nama: '' as string,
        lantai: '' as string,
        mall: '' as string,
        image: '' as string,
    });
    const closeModal = () => {
        setIsOpen(false);
    };
    const openModal = (item: any) => {
        setIsOpen(true);
        setDetailTenant({
            nama: item.nama,
            lantai: item.lantai.nama,
            mall: item.lokasi.nama_mall,
            image: item.gambarTenant,
        });
    };
    return (
        <>
            <div className="lg:hidden max-w-full">
                <div className="flex flex-nowrap overflow-x-scroll hide-scrollbar">
                    {mall.map((post, index) => (
                        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                        <span
                            onClick={() => {
                                setActiveTenant({ index, category: post.nama });
                                setTenant(post.tenant);
                            }}
                            key={post.nama}
                            className={`px-3 py-1 mx-2 w-full whitespace-nowrap rounded-lg text-center font-medium text-sm shadow ${
                                index === activeTenant.index ? 'border bg-black text-white border-black' : 'border text-dark'
                            }`}
                        >
                            <h1>{post.nama}</h1>
                        </span>
                    ))}
                </div>
                <div className="px-3">
                    {tenant.map((items) => (
                        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                        <div className="flex my-4 items-center" key={items.nama} onClick={() => openModal(items)}>
                            <Image className="me-3 rounded" src={items.gambarTenant} width={100} height={100} alt={items.gambarTenant} />
                            <span className="text-dark font-medium text-sm">{items.nama}</span>
                        </div>
                    ))}
                </div>
            </div>
            <Modal title={activeTenant.category} showClose isOpen={isOpen} closeModal={closeModal} className="w-screen h-screen bg-white p-0 ">
                <div className="w-full ps-3 pe-4">
                    <Image
                        src={detailTenant.image}
                        className="w-full h-full"
                        alt={detailTenant.image}
                        width={0}
                        height={0}
                        sizes="100vw"
                        priority
                        quality={30}
                    />
                    <h3 className="text-base text-black font-bold mt-4">{detailTenant.nama}</h3>
                    <h4 className="font-medium text-black text-sm">
                        Location : {detailTenant.mall} {detailTenant.lantai}
                    </h4>
                </div>
            </Modal>
        </>
    );
}

export default MobileMallDirectory;
