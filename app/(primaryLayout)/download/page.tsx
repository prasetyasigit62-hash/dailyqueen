import React from 'react';
import Table from './_section/table';
import getDownload from '@/app/_lib/getDownload';

export const metadata = {
    title: `Download - ${process.env.MALL_NAME}`,
    icons: {
        icon: `/favicon-${new Date().setHours(0, 0, 0, 0)}.png`,
    },
};

export default async function download() {
    let dataDownload: any;
    try {
        dataDownload = await getDownload();
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Download page fetch error:', error);
        dataDownload = { data: [] };
    }
    const { data: mydownload } = dataDownload;
    return (
        <div className="lg:pt-[7.9rem] py-16">
            <Table data={mydownload} />
        </div>
    );
}
