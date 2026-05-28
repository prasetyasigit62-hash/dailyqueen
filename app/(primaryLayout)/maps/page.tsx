'use client';

import React, { useRef } from 'react';

export default function MapsPage() {
    const iframeRef = useRef<HTMLIFrameElement>(null);

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
                src="/maps/index.html#mapWrap"
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
