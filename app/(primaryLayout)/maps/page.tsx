'use client';

import React, { useRef } from 'react';

// Maps is a Queen City (MALL_ID=1) only feature for now. Block direct /maps access on other
// branches even though the nav link is already hidden there.
const IS_QUEEN_CITY = (process.env.NEXT_PUBLIC_MALL_ID || '1') === '1';

export default function MapsPage() {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    if (!IS_QUEEN_CITY) {
        return (
            <main className="flex items-center justify-center bg-[#f4f5f8] px-6 pt-16 lg:pt-[7.9rem]" style={{ minHeight: '100svh' }}>
                <div className="text-center">
                    <h1 className="text-[40px] font-bold text-slate-800">404</h1>
                    <p className="mt-2 text-slate-600">Halaman tidak tersedia untuk mall ini.</p>
                    <a href="/" className="mt-5 inline-block rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium hover:bg-slate-100">
                        Kembali ke Beranda
                    </a>
                </div>
            </main>
        );
    }
    // Static src — keeps server/client markup identical (no hydration mismatch, no iframe reload race).
    // The iframe's own scripts fetch live data with cache: 'no-store', so cache-busting here is unnecessary.
    const iframeSrc = '/maps/index.html#mapWrap';

    const focusMapArea = () => {
        window.setTimeout(() => {
            const iframeWindow = iframeRef.current?.contentWindow;
            const iframeDocument = iframeRef.current?.contentDocument;
            const mapTarget = iframeDocument?.getElementById('mapWrap') || iframeDocument?.querySelector('.stage');

            if (!iframeWindow || !mapTarget) {
                return;
            }

            mapTarget.scrollIntoView({ block: 'start' });
        }, 250);
    };

    return (
        <main
            className="overflow-hidden bg-[#f4f5f8] pt-16 lg:pt-[7.9rem]"
            style={{ height: '100svh', minHeight: '100dvh' }}
        >
            <iframe
                ref={iframeRef}
                title="Queen City Mall Maps"
                src={iframeSrc}
                className="w-full border-0"
                style={{ height: 'calc(100svh - 4rem)' }}
                onLoad={focusMapArea}
            />
            <style jsx>{`
                @media (min-width: 1024px) {
                    iframe {
                        height: calc(100svh - 7.9rem) !important;
                    }
                }
            `}</style>
        </main>
    );
}
