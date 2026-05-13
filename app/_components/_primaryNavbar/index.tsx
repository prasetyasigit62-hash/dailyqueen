/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-unescaped-entities */

'use client';

import DesktopNavbar from './desktopNavbar';
import MobileNavbar from './mobileNavbar';
import { infoMallInterface } from '@/types/infoMallInterface';

function Navbar(props: infoMallInterface) {
    // eslint-disable-next-line camelcase
    const { logo, app_store, play_store } = props;
    return (
        <>
            <header className="block fixed top-0 bg-white z-30 w-full lg:hidden">
                {/* eslint-disable-next-line camelcase */}
                <MobileNavbar logo={logo} appstore={app_store} playstore={play_store} />
            </header>
            <header className="hidden fixed top-0 bg-white z-30 w-full lg:block">
                <DesktopNavbar logo={logo} />
            </header>
        </>
    );
}

export default Navbar;
