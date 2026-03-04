/* eslint-disable react/jsx-no-useless-fragment */

'use client';

import DesktopNavbar from './desktopNavbar';
import MobileNavbar from './mobileNavbar';
import { infoMallInterface } from '@/types/infoMallInterface';

export default function SecondaryNavbar(props: infoMallInterface) {
    // eslint-disable-next-line camelcase
    const { logo_footer, app_store, play_store } = props;
    return (
        <>
            <header className="xl:hidden block fixed top-0 z-30 w-full">
                {/* eslint-disable-next-line camelcase */}
                <MobileNavbar logo={logo_footer} appstore={app_store} playstore={play_store} />
            </header>
            <header className="xl:block hidden fixed top-0 z-30 w-full">
                {/* eslint-disable-next-line camelcase */}
                <DesktopNavbar logo={logo_footer} />
            </header>
        </>
    );
}
