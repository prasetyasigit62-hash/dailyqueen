/* eslint-disable react/jsx-no-comment-textnodes */
import Image from 'next/image';
import { Dispatch, SetStateAction, useState } from 'react';
import Modal from '@/components/modal';
import { Floor } from '@/types/mallDirectoryInterface';

type MallProps = {
    mall: Floor[];
    tenant: Floor['tenant'];
    setTenant: Dispatch<SetStateAction<Floor['tenant']>>;
};
function DesktopMallDirectory({ mall, tenant, setTenant }: MallProps) {
    const [copyMall, setCopyMall] = useState(mall.slice(0, 8) as Floor[]);
    const [isOpen, setIsOpen] = useState(false as boolean);
    const closeModal = () => {
        setIsOpen(false);
    };
    const [detailTenant, setDetailTenant] = useState({
        nama: '' as string,
        lantai: '' as string,
        mall: '' as string,
        image: '' as string,
    });
    const openModal = (items: Floor) => {
        setIsOpen(true);
        setTenant(items.tenant);
        setDetailTenant({
            nama: items.tenant[0]?.nama,
            lantai: items.tenant[0]?.lantai.nama,
            mall: items.tenant[0]?.lokasi.nama_mall,
            image: items.tenant[0]?.gambarTenant,
        });
    };
    return (
        <>
            <div className="lg:grid grid-cols-3 gap-5 hidden">
                {copyMall.map((post) => (
                    <div key={post.nama} className="col-span-1 cursor-pointer">
                        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                        <div
                            className="card h-full shadow-md rounded-l-xl rounded-r-2xl bg-gradient-to-l from-black to-zinc-400"
                            onClick={() => openModal(post)}
                        >
                            <div className="card__left text-white font-bold text-xl flex items-center">
                                <h1>{post.nama}</h1>
                            </div>
                            <div className="card__right">
                                <Image
                                    src={post.image}
                                    className="w-full h-full rounded-r-xl"
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    alt={post.image}
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                ))}
                <div className={`col-span-1 flex h-full items-center ${mall.length > 8 && copyMall.length <= 8 ? 'block' : 'hidden'}`}>
                    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
                    <h3 onClick={() => setCopyMall([...mall])} className="font-bold text-xl cursor-pointer text-teal-700">{`More >>>`}</h3>
                </div>
            </div>
            <Modal title="" isOpen={isOpen} closeModal={closeModal} className="w-1/2 p-0 rounded-lg">
                <div className="grid grid-cols-3">
                    <div className="col-span-1 bg-white overflow-y-auto ps-4 pe-8 py-6 custom-scrollbar max-h-[30rem]">
                        <ul className="">
                            {tenant.map((item) => (
                                // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
                                <li
                                    onClick={() =>
                                        setDetailTenant({
                                            nama: item.nama,
                                            lantai: item.lantai.nama,
                                            mall: item.lokasi.nama_mall,
                                            image: item.gambarTenant,
                                        })
                                    }
                                    key={item.nama}
                                    className="text-black text-lg font-medium border-b border-black mb-2 cursor-pointer"
                                >
                                    {item.nama}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="col-span-2 bg-black/80 p-6">
                        <Image
                            src={detailTenant.image}
                            className="rounded-xl w-full h-72"
                            alt={detailTenant.image}
                            width={0}
                            height={0}
                            sizes="100vw"
                        />
                        <h3 className="text-xl text-white font-bold mt-4">{detailTenant.nama}</h3>
                        <h4 className="text-lg font-medium text-white">
                            Location : {detailTenant.mall} {detailTenant.lantai}
                        </h4>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default DesktopMallDirectory;
