import { NextRequest, NextResponse } from 'next/server';
import fetchWithRetry from '@/app/_lib/api';

export const dynamic = 'force-dynamic';

// Floor-cover-driven covers + the new mall-directory / homepage-card design are rolled out to
// Queen City Mall (MALL_ID 1) only for now. For any other branch we return empty so the UI keeps
// its existing static images until there's an explicit go-ahead. Widen this list when approved.
const ENABLED_MALL_IDS = (process.env.FLOOR_COVERS_ENABLED_MALLS || '1')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

// Proxies the back-office floor cover API so the Next.js frontend can read it
// with the same { byKey: { gf, f1, f2, f3 } } shape.
export async function GET(req: NextRequest) {
    const type = req.nextUrl.searchParams.get('type') === 'directory' ? 'directory' : 'homepage';
    // Scope covers to THIS deployment's mall branch so each branch only sees its own images.
    const mallId = process.env.MALL_ID || '1';

    // Gate: only enabled malls get live covers; others fall back to static images.
    if (!ENABLED_MALL_IDS.includes(String(mallId))) {
        return NextResponse.json({ byKey: {} }, { status: 200 });
    }

    // Allow pointing this endpoint at a local Laravel during dev (e.g. 127.0.0.1:8000)
    // without forcing the rest of the app off production. Unset in prod → falls back to HOST_API.
    const baseUrl = process.env.FLOOR_COVERS_API_URL || process.env.HOST_API;
    try {
        const res = await fetchWithRetry(
            `${baseUrl}/api/guest/floorCovers/${type}/${mallId}?_=${Date.now()}`,
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
