/* eslint-disable no-console */
import axios from 'axios';
import fs from 'fs';

async function downloadImage(url: string, imagePath: string) {
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
    });

    const writer = fs.createWriteStream(imagePath);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

function getTimestampInSeconds() {
    return new Date().setHours(0, 0, 0, 0);
}

export default async function getInfoMall() {
    try {
        const res = await fetch(`${process.env.HOST_API}/api/guest/infomall/${process.env.MALL_ID}`, { next: { revalidate: 300 } });
        // The return value is *not* serialized
        // You can return Date, Map, Set, etc.

        // Recommendation: handle errors
        if (!res.ok) {
            // This will activate the closest `error.js` Error Boundary
            // eslint-disable-next-line no-console
            console.log('failed getInfoMall');
            throw new Error('Failed to fetch data getInfoMall');
        }

        const infoMall = await res.json();
        const timestamp = getTimestampInSeconds();
        const faviconFile = `./public/favicon-${timestamp}.png`;
        if (!fs.existsSync(faviconFile)) {
            try {
                await downloadImage(infoMall.data.favicon, faviconFile);
            } catch (error) {
                console.log('favicon error', error);
            }
        }
        return infoMall;
    } catch (error) {
        return console.log(error);
    }
}
