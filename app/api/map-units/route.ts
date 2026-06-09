import { NextResponse } from 'next/server';
import fetchWithRetry from '@/app/_lib/api';

export const dynamic = 'force-dynamic';

// Maps tenant placement is a Queen City (MALL_ID=1) only feature, matching the maps menu gate.
// Other branches get an empty map so their (legacy) maps — if any — stay untouched.
const IS_QUEEN_CITY = (process.env.MALL_ID || '1') === '1';

// Proxies the back-office mapUnits API so the static maps page can read the
// unit_code → id_tenant assignments and fill tenant names live by apiId.
export async function GET() {
    if (!IS_QUEEN_CITY) {
        return NextResponse.json({ byUnitCode: {} }, { status: 200 });
    }

    const mallId = process.env.MALL_ID || '1';
    const baseUrl = process.env.FLOOR_COVERS_API_URL || process.env.HOST_API;

    try {
        const res = await fetchWithRetry(`${baseUrl}/api/guest/mapUnits/${mallId}?_=${Date.now()}`, { cache: 'no-store' });
        if (!res.ok) {
            return NextResponse.json({ byUnitCode: {} }, { status: 502 });
        }
        const json = await res.json();
        const list: Array<{ floor_key: string; unit_code: string; id_tenant: number | null }> = json?.data || [];

        // Index by UPPERCASE unit_code so the maps page can look up assignments regardless of case.
        const byUnitCode: Record<string, { floorKey: string; idTenant: number | null }> = {};
        list.forEach((u) => {
            if (!u?.unit_code) return;
            byUnitCode[u.unit_code.toUpperCase()] = { floorKey: u.floor_key, idTenant: u.id_tenant ?? null };
        });

        return NextResponse.json(
            { byUnitCode },
            { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
        );
    } catch {
        return NextResponse.json({ byUnitCode: {} }, { status: 200 });
    }
}
