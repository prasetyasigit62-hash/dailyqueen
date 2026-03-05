/* eslint-disable no-console */
import axios from 'axios';
import fs from 'fs';
import fetchWithRetry from './api';

async function downloadImage(url: string, imagePath: string) {
    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
            timeout: 10000, // 10s timeout
        });

        if (!response.data) throw new Error('No data received from image download');

        const writer = fs.createWriteStream(imagePath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', (err) => {
                writer.close();
                reject(err);
            });
        });
    } catch (error) {
        throw error;
    }
}

function getTimestampInSeconds() {
    return new Date().setHours(0, 0, 0, 0);
}

export default async function getInfoMall() {
    const defaultData = {
        data: {
            id: Number(process.env.MALL_ID) || 3,
            nama_mall: process.env.MALL_NAME || 'Lawu Plaza',
            meta_description: `${process.env.MALL_NAME || 'Lawu Plaza'} Madiun`,
            alamat: '',
            telepon: '',
            email: '',
            gambar_mall: '',
            logo: '',
            logo_footer: '',
            favicon: '',
            mall_hours: '',
            play_store: '',
            app_store: '',
            facebook: '',
            instagram: '',
            youtube: '',
            whatsapp: '',
            twitter: '',
            tiktok: '',
            primary_color: '29328d',
            secondary_color: '0d3c4c',
            kordinat: '',
        },
    };

    try {
        const res = await fetchWithRetry(`${process.env.HOST_API}/api/guest/infomall/${process.env.MALL_ID}`, { next: { revalidate: 300 } });

        if (!res.ok) {
            console.error(`Failed to fetch infoMall: Status ${res.status}`);
            return defaultData;
        }

        const infoMall = await res.json();

        // Ensure data exists in the response
        if (!infoMall || !infoMall.data) {
            return defaultData;
        }

        const timestamp = getTimestampInSeconds();
        const faviconFile = `./public/favicon-${timestamp}.png`;
        
        // Skip image downloading during build/CI to avoid network failures and race conditions
        const isCI = process.env.CI || process.env.VERCEL;
        
        if (!isCI && !fs.existsSync(faviconFile) && infoMall.data.favicon) {
            try {
                await downloadImage(infoMall.data.favicon, faviconFile);
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error('favicon download error', error);
            }
        }
        return infoMall;
    } catch (error) {
        console.error('getInfoMall catch error:', error);
        return defaultData;
    }
}
