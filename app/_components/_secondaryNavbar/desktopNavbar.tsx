'use client';

import Image from 'next/image';
import Link from 'next/link';

interface navbarProps {
    logo: string;
}

function DesktopNavbar(props: navbarProps) {
    const { logo } = props;
    return (
        <div className="bg-[#b29130]">
            <div className="flex justify-center py-8">
                <Link href="/">
                    <Image src={logo} width={220} height="0" className="h-auto" alt="Queen City White" priority />
                </Link>
            </div>
            <nav className="bg-[#534a2b] w-100 rounded-t-3xl text-lg px-12">
                <div className="flex justify-between items-center space-x-3 py-2 container mx-auto">
                    <Link href="/" className="text-white font-semibold">
                        Home
                    </Link>
                    <Link href="/loyalty/about" className="text-white font-semibold">
                        About {process.env.NEXT_PUBLIC_NAME_LOYALTY} App
                    </Link>
                    <Link href="/loyalty/point-redemption" className="text-white font-semibold">
                        Point Redemption
                    </Link>
                    <Link href="/about-us" className="text-white font-semibold">
                        About Us
                    </Link>
                    <Link href="/contact-us" className="text-white font-semibold">
                        Contact Us
                    </Link>
                </div>
            </nav>
        </div>
    );
}

export default DesktopNavbar;
