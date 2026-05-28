import { NextResponse } from 'next/server';
import fetchWithRetry from '@/app/_lib/api';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const res = await fetchWithRetry(
            `${process.env.HOST_API}/api/guest/mallDirectory/${process.env.MALL_ID}`,
            { next: { revalidate: 300 } }
        );

        if (!res.ok) {
            return NextResponse.json({ error: 'Failed to fetch' }, { status: 502 });
        }

        const data = await res.json();

        // Normalize: build a flat map of { unitCode -> { name, cat, desc } }
        // keyed by unit code lowercased (e.g. "l1-a3", "gf-01")
        const tenantNames: Record<string, { name: string; cat: string; desc: string }> = {};

        const floors: any[] = Array.isArray(data) ? data : data?.data ?? data?.floors ?? [];

        floors.forEach((floor: any) => {
            const floorLabel: string = floor?.nama ?? floor?.name ?? '';
            const tenants: any[] = floor?.tenant ?? floor?.tenants ?? [];
            tenants.forEach((t: any) => {
                const rawCode: string = t?.kode_unit ?? t?.unit_code ?? t?.kode ?? '';
                const name: string = t?.nama ?? t?.name ?? '';
                if (!rawCode || !name) return;
                const key = rawCode.toLowerCase().replace(/\s+/g, '-');
                tenantNames[key] = {
                    name: name.toUpperCase(),
                    cat: floorLabel,
                    desc: `${name} berada di ${floorLabel} Queen City Mall.`,
                };
            });
        });

        return NextResponse.json(tenantNames, {
            headers: {
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch {
        return NextResponse.json({}, { status: 200 });
    }
}
