/* eslint-disable no-console */
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import fetchWithRetry from './api';

async function downloadImage(url: string, imagePath: string) {
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
}

function getTimestampInSeconds() {
    return new Date().setHours(0, 0, 0, 0);
}

// Resolve the favicon URL for <metadata>. Prefer today's downloaded favicon, but fall
// back to the static /favicon.png if it hasn't been fetched yet — avoids the 404 that
// happens when metadata renders before getInfoMall() has written today's file.
export function resolveFaviconPath(): string {
    const timestamp = getTimestampInSeconds();
    try {
        // Resolve from CWD so it works in both `next dev` and the standalone prod build.
        const file = path.join(process.cwd(), 'public', `favicon-${timestamp}.png`);
        if (fs.existsSync(file)) {
            return `/favicon-${timestamp}.png`;
        }
    } catch {
        // ignore — fall through to static favicon
    }
    return '/favicon.png';
}

export default async function getInfoMall() {
    const defaultData = {
        data: {
            id: Number(process.env.MALL_ID) || 2,
            nama_mall: process.env.MALL_NAME || 'Kediri Mall',
            meta_description: `${process.env.MALL_NAME || 'Kediri Mall'} Kediri`,
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
        const faviconFile = path.join(process.cwd(), 'public', `favicon-${timestamp}.png`);

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
