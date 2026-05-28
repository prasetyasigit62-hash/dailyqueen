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
                <div className="flex flex-nowrap gap-2 overflow-x-auto hide-scrollbar px-3 pb-2 pt-1">
                    {mall.map((post, index) => (
                        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                        <span
                            onClick={() => {
                                setActiveTenant({ index, category: post.nama });
                                setTenant(post.tenant);
                            }}
                            key={post.nama}
                            className={`shrink-0 px-3.5 py-1.5 whitespace-nowrap rounded-full text-center font-medium text-[12px] transition ${
                                index === activeTenant.index
                                    ? 'bg-black text-white shadow-md'
                                    : 'border border-gray-200 bg-white text-gray-700 active:bg-gray-100'
                            }`}
                        >
                            <h1>{post.nama}</h1>
                        </span>
                    ))}
                </div>
                <div className="grid grid-cols-2 gap-3 px-3 py-3 sm:grid-cols-3">
                    {tenant.map((items) => (
                        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                        <div
                            key={items.nama}
                            onClick={() => openModal(items)}
                            className="flex flex-col items-center rounded-xl border border-gray-100 bg-white p-2.5 shadow-sm transition active:scale-[0.98]"
                        >
                            <div className="relative w-full aspect-square overflow-hidden rounded-lg bg-gray-50">
                                <Image
                                    src={items.gambarTenant}
                                    fill
                                    sizes="(max-width: 640px) 50vw, 33vw"
                                    className="object-contain"
                                    alt={items.nama}
                                />
                            </div>
                            <span className="mt-2 line-clamp-2 text-center text-[11.5px] font-medium leading-tight text-gray-800">
                                {items.nama}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            <Modal title={activeTenant.category} showClose isOpen={isOpen} closeModal={closeModal} className="w-screen h-screen bg-white p-0">
                <div className="flex flex-col px-4 pb-6">
                    <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl bg-gray-50">
                        <Image
                            src={detailTenant.image}
                            fill
                            sizes="100vw"
                            className="object-contain"
                            alt={detailTenant.nama}
                            priority
                            quality={50}
                        />
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-black">{detailTenant.nama}</h3>
                    <h4 className="mt-1 text-sm text-gray-600">
                        <span className="font-medium">Lokasi:</span> {detailTenant.mall} · {detailTenant.lantai}
                    </h4>
                </div>
            </Modal>
        </>
    );
}

export default MobileMallDirectory;
