import { NextRequest, NextResponse } from 'next/server';
import fetchWithRetry from '@/app/_lib/api';

export const dynamic = 'force-dynamic';

// Proxies the back-office floor cover API so the Next.js frontend can read it
// with the same { byKey: { gf, f1, f2, f3 } } shape.
export async function GET(req: NextRequest) {
    const type = req.nextUrl.searchParams.get('type') === 'directory' ? 'directory' : 'homepage';
    try {
        const res = await fetchWithRetry(
            `${process.env.HOST_API}/api/guest/floorCovers/${type}?_=${Date.now()}`,
            { cache: 'no-store' }
        );
        if (!res.ok) {
            return NextResponse.json({ byKey: {} }, { status: 502 });
        }
        const json = await res.json();
        const list: Array<{ floor_key: string; floor_label: string; image: string | null; image_alt: string | null }> = json?.data || [];
        const byKey: Record<string, { image: string | null; label: string; alt: string | null }> = {};
        list.forEach((item) => {
            if (!item?.floor_key) return;
            byKey[item.floor_key] = {
                image: item.image || null,
                label: item.floor_label || '',
                alt: item.image_alt || null,
            };
        });
        return NextResponse.json({ byKey }, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
            },
        });
    } catch {
        return NextResponse.json({ byKey: {} }, { status: 200 });
    }
}
