'use client';

import { useEffect } from 'react';

export default function ScrollRestorationReset() {
    useEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'auto';
        }

        return undefined;
    }, []);

    return null;
}
