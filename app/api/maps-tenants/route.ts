import { NextResponse } from 'next/server';
import fetchWithRetry from '@/app/_lib/api';

export const dynamic = 'force-dynamic';

type TenantInfo = { id: number; name: string; cat: string; floor: string };

export async function GET() {
    try {
        const res = await fetchWithRetry(
            `${process.env.HOST_API}/api/guest/mallDirectory/${process.env.MALL_ID}`,
            { next: { revalidate: 300 } }
        );

        if (!res.ok) {
            return NextResponse.json({ byId: {}, byName: {} }, { status: 502 });
        }

        const data = await res.json();

        // API structure: { data: { "Ground Floor": [{ tenant: [{id, nama, ...}] }] } }
        // Build TWO indexes:
        //   byId   — { "1290": { id, name, cat, floor } }  for direct lookup
        //   byName — { "GION SUSHI": { id, name, cat, floor } }  for fallback matching
        const byId: Record<string, TenantInfo> = {};
        const byName: Record<string, TenantInfo> = {};

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

        return NextResponse.json({ byId, byName }, {
            headers: {
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch {
        return NextResponse.json({ byId: {}, byName: {} }, { status: 200 });
    }
}
