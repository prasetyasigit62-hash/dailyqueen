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
        <main className="h-screen overflow-hidden bg-[#f4f5f8] pt-16 lg:pt-[7.9rem]">
            <iframe
                ref={iframeRef}
                title="Queen City Mall Maps"
                src="/maps/index.html#mapWrap"
                className="h-[calc(100vh-4rem)] w-full border-0 lg:h-[calc(100vh-7.9rem)]"
                onLoad={focusMapArea}
            />
        </main>
    );
}
