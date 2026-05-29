import { NextResponse } from 'next/server';
import fetchWithRetry from '@/app/_lib/api';

export const dynamic = 'force-dynamic';

type TenantInfo = { id: number; name: string; cat: string; floor: string };

export async function GET() {
    try {
        const res = await fetchWithRetry(
            `${process.env.HOST_API}/api/guest/mallDirectory/${process.env.MALL_ID}?_=${Date.now()}`,
            { cache: 'no-store' }
        );

        if (!res.ok) {
            return NextResponse.json({ byId: {}, byName: {}, byFloor: { gf: [], '1f': [], '2f': [], '3f': [] } }, { status: 502 });
        }

        const data = await res.json();

        // API structure: { data: { "Ground Floor": [{ tenant: [{id, nama, ...}] }] } }
        // Build indexes:
        //   byId    — { "1290": { id, name, cat, floor } }  for direct lookup
        //   byName  — { "GION SUSHI": { id, name, cat, floor } }  for fallback matching
        //   byFloor — { "gf": [TenantInfo, ...], "1f": [...], ... }  live floor list
        const byId: Record<string, TenantInfo> = {};
        const byName: Record<string, TenantInfo> = {};
        const byFloor: Record<string, TenantInfo[]> = { gf: [], '1f': [], '2f': [], '3f': [] };

        const normalizeFloorKey = (label: string): string | null => {
            const v = label.toLowerCase();
            if (v.includes('ground') || v.includes('gf')) return 'gf';
            if (v.includes('lantai 1') || v.includes('1st') || v.includes('first') || v === 'l1' || v === 'f1') return '1f';
            if (v.includes('lantai 2') || v.includes('2nd') || v.includes('second') || v === 'l2' || v === 'f2') return '2f';
            if (v.includes('lantai 3') || v.includes('3rd') || v.includes('third') || v === 'l3' || v === 'f3') return '3f';
            return null;
        };

        const root = data?.data ?? data;

        const processTenants = (tenants: any[], floorLabel: string) => {
            tenants.forEach((t: any) => {
                const id = t?.id;
                const name = String(t?.nama ?? t?.name ?? '').trim();
                if (!id || !name) return;
                const catLabel = t?.kategori?.nama ?? '';
                const floorFromApi = t?.lantai?.nama ?? floorLabel;
                const info: TenantInfo = {
                    id: Number(id),
                    name: name.toUpperCase(),
                    cat: catLabel,
                    floor: floorFromApi,
                };
                byId[String(id)] = info;
                const nameKey = name.toUpperCase().replace(/\s+/g, ' ').trim();
                if (!byName[nameKey]) byName[nameKey] = info;
                const floorKey = normalizeFloorKey(floorFromApi);
                if (floorKey && byFloor[floorKey]) byFloor[floorKey].push(info);
            });
        };

        if (Array.isArray(root)) {
            root.forEach((floor: any) => {
                const floorLabel: string = floor?.nama ?? floor?.name ?? '';
                const tenants: any[] = floor?.tenant ?? floor?.tenants ?? [];
                processTenants(tenants, floorLabel);
            });
        } else if (root && typeof root === 'object') {
            Object.entries(root).forEach(([floorLabel, value]: [string, any]) => {
                const categories: any[] = Array.isArray(value) ? value : [];
                categories.forEach((cat: any) => {
                    const tenants: any[] = cat?.tenant ?? cat?.tenants ?? [];
                    processTenants(tenants, floorLabel);
                });
            });
        }

        return NextResponse.json({ byId, byName, byFloor }, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
                'Pragma': 'no-cache',
                'Expires': '0',
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch {
        return NextResponse.json({ byId: {}, byName: {}, byFloor: { gf: [], '1f': [], '2f': [], '3f': [] } }, { status: 200 });
    }
}
