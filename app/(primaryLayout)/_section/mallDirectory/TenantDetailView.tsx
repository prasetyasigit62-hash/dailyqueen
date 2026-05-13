'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import type { Floor } from '@/types/mallDirectoryInterface';
import queenCityLogo from '@/public/logo_queencity_white.png';
import srGroupLogo from '@/public/logo_srgroup_2026.png';

type TenantRecord = Floor['tenant'][number];

type TenantDetailViewProps = {
    tenant: TenantRecord;
    onBack: () => void;
};

const DEFAULT_TENANT_IMAGE = '/no_image_placeholder.png';
const DEFAULT_OPENING_HOURS = '10.00 - 22.00 WIB';
const MAP_IMAGE = '/maps/Maps.PNG';
const MAP_SIZE = {
    width: 1648,
    height: 954,
};

const MAP_TENANTS = [
    { keys: ['lil bamboe', 'bakoel bamboe', 'bakoel bamb', 'bamboe'], label: 'Lil Bamboe', x: 240, y: 320 },
    { keys: ['gion sushi', 'gion'], label: 'Gion Sushi', x: 600, y: 320 },
    { keys: ['koi the', 'koi thé', 'koi'], label: 'Koi Thé', x: 990, y: 250 },
    { keys: ['il fresco', 'fresco'], label: 'Il Fresco', x: 1148, y: 230 },
    { keys: ['boost juice', 'boost'], label: 'Boost Juice', x: 1370, y: 150 },
    { keys: ['kicks'], label: 'Kicks', x: 165, y: 660 },
    { keys: ['converse'], label: 'Converse', x: 368, y: 660 },
    { keys: ['crocs'], label: 'Crocs', x: 568, y: 660 },
    { keys: ['skechers'], label: 'Skechers', x: 787, y: 600 },
    { keys: ['digiplus', 'digi plus'], label: 'Digiplus', x: 1018, y: 555 },
    { keys: ['baleno'], label: 'Baleno', x: 1318, y: 555 },
];

const MAP_TENANT_SHAPES: Record<string, string> = {
    '240-320': 'M348.012 102.06L111.012 129.56L106.012 358.06L353.512 335.56L348.012 102.06Z',
    '600-320': 'M852 63.039L366 104.539V336.539H455L502 341.039L575 350.539L634 366.539L646 371.039V355.539L741.5 341.039L883 310.039L852 63.039Z',
    '990-250': 'M1061.05 48.531L870.054 61.531L880.554 156.531L896.054 308.031L1091.05 256.531V239.531L1069.55 115.531L1061.05 48.531Z',
    '1148-230':
        'M1171.06 38.513L1075.56 47.513L1084.56 116.513H1090.06L1095.06 140.513V146.013H1090.06L1088.06 164.513L1103.06 253.013L1151.06 237.013L1179.06 225.013L1191.06 215.513L1210.56 174.013V144.013L1186.06 47.513L1171.06 38.513Z',
    '1370-150':
        'M1347 42.5L1320.5 50.5L1277 92.5V145.5L1292.5 173.5L1310 187.5L1338 203L1372.5 210.5H1410L1447 187.5L1459.5 173.5L1467.5 137V109L1447 70.5L1410 50.5L1372 42.5H1347Z',
    '165-660':
        'M183.225 622.215L106.947 597.667L86.506 817.101L91.99 837.641L167.271 846.659L253.022 850.667V778.023H246.042L249.532 745.459H253.022L258.506 635.241L183.225 622.215Z',
    '368-660': 'M466.024 639.5H281.024L271.024 856H416.024V797.5H466.024V639.5Z',
    '568-660': 'M676.026 604.283C656.026 613.949 591.926 634.383 495.526 638.783L485.526 848.283L685.026 839.783L676.026 604.283Z',
    '787-600': 'M895.5 526.69L702 594.19V835.19L913 819.69L895.5 526.69Z',
    '1018-555': 'M1085.5 460.7L920.5 519.7L934.5 818.2L1105.5 799.2L1085.5 460.7Z',
    '1318-555': 'M1321 361.5L1103.5 454.5L1117.5 796.5L1428 766L1438 369L1321 361.5Z',
};

const FLOOR_VISUALS: Record<string, { label: string; mapLabel: string; eyebrow: string }> = {
    gf: {
        label: 'Ground Floor',
        mapLabel: 'GF Route',
        eyebrow: 'Ground Floor',
    },
    f1: {
        label: '1st Floor',
        mapLabel: '1F Route',
        eyebrow: '1st Floor',
    },
    f2: {
        label: '2nd Floor',
        mapLabel: '2F Route',
        eyebrow: '2nd Floor',
    },
    f3: {
        label: '3rd Floor',
        mapLabel: '3F Route',
        eyebrow: '3rd Floor',
    },
};

function resolveFloorId(floorName?: string) {
    const value = floorName?.toLowerCase() || '';

    if (value.includes('ground') || value.includes('gf')) {
        return 'gf';
    }

    if (value.includes('1st') || value.includes('first') || value.includes('lantai 1') || value.includes('f1')) {
        return 'f1';
    }

    if (value.includes('2nd') || value.includes('second') || value.includes('lantai 2') || value.includes('f2')) {
        return 'f2';
    }

    if (value.includes('3rd') || value.includes('third') || value.includes('lantai 3') || value.includes('f3')) {
        return 'f3';
    }

    return 'gf';
}

function getOpenNowLabel() {
    const jakartaHour = Number(
        new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Asia/Jakarta',
            hour: '2-digit',
            hour12: false,
        }).format(new Date())
    );

    return jakartaHour >= 10 && jakartaHour < 22 ? 'Open Now' : 'Closed Now';
}

function normalizeMapName(value?: string) {
    return (value || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();
}

function getMapTenantMarker(tenantName?: string) {
    const normalizedTenantName = normalizeMapName(tenantName);

    return MAP_TENANTS.find((mapTenant) => mapTenant.keys.some((key) => normalizedTenantName.includes(normalizeMapName(key))));
}

function getMapMarkerPosition(marker?: (typeof MAP_TENANTS)[number]) {
    if (!marker) {
        return undefined;
    }

    return {
        left: `${(marker.x / MAP_SIZE.width) * 100}%`,
        top: `${(marker.y / MAP_SIZE.height) * 100}%`,
    };
}

function getMapTenantShape(marker?: (typeof MAP_TENANTS)[number]) {
    if (!marker) {
        return undefined;
    }

    return MAP_TENANT_SHAPES[`${marker.x}-${marker.y}`];
}

function IconPin() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 21s6-5.33 6-11a6 6 0 1 0-12 0c0 5.67 6 11 6 11Z" />
            <circle cx="12" cy="10" r="2.25" />
        </svg>
    );
}

function IconClock() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="8" />
            <path d="M12 8v5l3 2" />
        </svg>
    );
}

function IconSearch() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[17px] w-[17px]" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4.5-4.5" />
        </svg>
    );
}

function IconArrow() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[23px] w-[23px]" fill="none" stroke="currentColor" strokeWidth="1.65">
            <path d="M5 12h13" />
            <path d="m13 6 6 6-6 6" />
        </svg>
    );
}

function ActiveNavUnderline() {
    return (
        <svg aria-hidden="true" viewBox="0 0 86 8" preserveAspectRatio="none" className="h-[7px] w-[78px]">
            <defs>
                <linearGradient id="tenantNavUnderline" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="rgba(255,255,255,0)" />
                    <stop offset="0.16" stopColor="rgba(255,255,255,0.24)" />
                    <stop offset="0.5" stopColor="rgba(255,255,255,0.95)" />
                    <stop offset="0.84" stopColor="rgba(255,255,255,0.24)" />
                    <stop offset="1" stopColor="rgba(255,255,255,0)" />
                </linearGradient>
            </defs>
            <path
                d="M1 5.3 C20 3.2 37 3.3 49 4.4 C62 5.5 72 4.8 85 3.1"
                fill="none"
                stroke="url(#tenantNavUnderline)"
                strokeLinecap="round"
                strokeWidth="1.8"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    );
}

function NavUnderline({ active }: { active: boolean }) {
    return (
        <span
            className={`absolute -bottom-[9px] left-1/2 -translate-x-1/2 transition duration-300 ${
                active ? 'opacity-100' : 'opacity-0 translate-y-1 group-hover:translate-y-0 group-hover:opacity-100'
            }`}
        >
            <ActiveNavUnderline />
        </span>
    );
}

export default function TenantDetailView({ tenant, onBack }: TenantDetailViewProps) {
    const floorId = resolveFloorId(tenant?.lantai?.nama);
    const floorVisual = FLOOR_VISUALS[floorId] || FLOOR_VISUALS.gf;
    const tenantImage = tenant?.gambarTenant || DEFAULT_TENANT_IMAGE;
    const categoryLabel = tenant?.kategori?.nama || 'Tenant';
    const locationFloor = tenant?.lantai?.nama || floorVisual.label;
    const mallName = tenant?.lokasi?.nama_mall || 'Queen City Mall';
    const openNowLabel = getOpenNowLabel();
    const mapTenantMarker = getMapTenantMarker(tenant?.nama);
    const mapMarkerPosition = getMapMarkerPosition(mapTenantMarker);
    const mapTenantShape = getMapTenantShape(mapTenantMarker);

    const goToPage = (href: string) => {
        window.location.href = href;
    };

    const backToTenants = () => {
        onBack();
        window.requestAnimationFrame(() => {
            document.getElementById('mall-directory')?.scrollIntoView({ block: 'start' });
        });
    };

    useEffect(() => {
        const headers = Array.from(document.querySelectorAll('body > header')) as HTMLElement[];
        const previousDisplay = headers.map((header) => header.style.display);
        const previousBodyOverflow = document.body.style.overflow;

        headers.forEach((_, index) => {
            const headerElement = headers[index];
            headerElement.style.display = 'none';
        });
        document.body.style.overflow = 'hidden';

        return () => {
            headers.forEach((_, index) => {
                const headerElement = headers[index];
                headerElement.style.display = previousDisplay[index] || '';
            });
            document.body.style.overflow = previousBodyOverflow;
        };
    }, []);

    return (
        <section className="fixed inset-0 z-[9999] overflow-y-auto bg-black text-white">
            <div className="relative min-h-screen w-full overflow-hidden bg-black">
                <div className="relative h-[350px] w-full bg-[#111] md:h-[385px] lg:h-[405px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={tenantImage} alt={tenant?.nama || 'Tenant image'} className="h-full w-full object-cover object-[center_62%]" />

                    <div className="fixed inset-x-0 top-0 z-[10000] h-[56px] border-b border-white/12 bg-[linear-gradient(90deg,rgba(0,0,0,0.82)_0%,rgba(0,0,0,0.74)_38%,rgba(0,0,0,0.78)_100%)] shadow-[0_10px_28px_rgba(0,0,0,0.5)] backdrop-blur-[2px]">
                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0)_52%,rgba(0,0,0,0.14)_100%)]" />
                        <div className="mx-auto flex h-full max-w-[1320px] items-center justify-between px-8 lg:px-[60px]">
                            <button type="button" onClick={() => goToPage('/')} className="flex items-center" aria-label="Go to homepage">
                                <Image src={queenCityLogo} alt="Queen City Mall" className="h-auto w-[124px]" priority />
                            </button>

                            <nav className="hidden items-center gap-9 text-[11px] font-semibold uppercase text-white/90 md:flex">
                                <button type="button" onClick={() => goToPage('/')} className="group relative transition hover:text-white">
                                    Home
                                    <NavUnderline active={false} />
                                </button>
                                <button type="button" onClick={backToTenants} className="group relative text-white">
                                    Directory
                                    <NavUnderline active />
                                </button>
                                <button type="button" onClick={() => goToPage('/#qc-loyalty')} className="group relative transition hover:text-white">
                                    MySRLand
                                    <NavUnderline active={false} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => goToPage('/schedule-event')}
                                    className="group relative transition hover:text-white"
                                >
                                    What&apos;s On
                                    <NavUnderline active={false} />
                                </button>
                                <button
                                    type="button"
                                    onClick={backToTenants}
                                    className="text-white/72 transition hover:text-white"
                                    aria-label="Search tenants in directory"
                                >
                                    <IconSearch />
                                </button>
                                <button type="button" onClick={() => goToPage('/about-us')} aria-label="About SR Group">
                                    <Image src={srGroupLogo} alt="SR Group" className="h-auto w-[78px] brightness-0 invert" />
                                </button>
                            </nav>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onBack}
                        className="group absolute left-6 top-[74px] z-30 inline-flex items-center gap-2 rounded-full border border-white/65 bg-black/82 px-4 py-2 text-[12px] font-bold text-white shadow-[0_10px_28px_rgba(0,0,0,0.62)] backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-black hover:shadow-[0_14px_34px_rgba(0,0,0,0.78)] md:left-10 lg:left-[60px]"
                    >
                        <span aria-hidden="true" className="text-[15px] leading-none transition duration-300 group-hover:-translate-x-1">
                            ←
                        </span>
                        Back to tenants
                    </button>

                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0)_58%,rgba(0,0,0,0.82)_88%,#000_100%)]" />
                </div>

                <div className="relative min-h-[245px] bg-black px-6 pb-14 pt-6 md:px-12 md:pb-16 lg:px-[60px] lg:pb-16 lg:pt-7">
                    <div className="mx-auto grid max-w-[1360px] gap-9 lg:grid-cols-[minmax(0,1fr)_500px] xl:grid-cols-[minmax(0,1fr)_535px]">
                        <div className="pt-2 lg:pt-5">
                            <div className="mb-3 flex items-center gap-[7px] text-[10px] font-semibold uppercase text-white/82">
                                <span className="h-[7px] w-[7px] rounded-full border border-white bg-[#e0141e]" />
                                {categoryLabel}
                            </div>

                            <h1 className="max-w-[720px] text-[34px] font-light leading-[1.08] text-white md:text-[40px] lg:text-[42px]">
                                {tenant?.nama}
                            </h1>

                            <div className="mt-5 flex flex-col gap-[11px] text-[13px] text-white/82">
                                <div className="flex items-center gap-3">
                                    <span className="text-white/90">
                                        <IconPin />
                                    </span>
                                    <span>
                                        {locationFloor} | {mallName}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="text-white/90">
                                        <IconClock />
                                    </span>
                                    <span className="text-[#83ce63]">{openNowLabel}</span>
                                    <span className="text-white">{DEFAULT_OPENING_HOURS}</span>
                                </div>
                            </div>
                        </div>

                        <div className="self-start lg:-mt-1">
                            <div className="mb-3 flex items-center justify-between">
                                <h2 className="text-[22px] font-light leading-none text-white md:text-[24px]">Find your way</h2>
                                <span className="-rotate-45 text-white/78">
                                    <IconArrow />
                                </span>
                            </div>

                            <div className="group/map relative aspect-[1648/954] overflow-hidden rounded-tl-[74px] rounded-br-[18px] bg-[#f4f6fa] shadow-[0_18px_44px_rgba(0,0,0,0.5)] ring-1 ring-white/10">
                                <div className="tenant-detail-map-stage absolute inset-0">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={MAP_IMAGE} alt={`Queen City Mall map for ${tenant?.nama}`} className="h-full w-full object-cover" />
                                </div>
                                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(4,8,16,0.03)_48%,rgba(0,0,0,0.25)_100%)]" />
                                <div className="pointer-events-none absolute inset-0 shadow-[inset_0_-28px_44px_rgba(0,0,0,0.28),inset_0_18px_34px_rgba(255,255,255,0.22)]" />

                                <div className="absolute left-[42px] top-[4px] flex items-center gap-2">
                                    <span className="rounded-full border border-[#22306f]/12 bg-white/20 px-3 py-[4px] text-[7px] font-bold uppercase tracking-wide text-[#22306f] shadow-sm backdrop-blur-[2px]">
                                        {floorVisual.mapLabel}
                                    </span>
                                    <span className="rounded-full border border-[#22306f]/12 bg-white/20 px-3 py-[4px] text-[7px] font-bold uppercase tracking-wide text-[#22306f] shadow-sm backdrop-blur-[2px]">
                                        {categoryLabel}
                                    </span>
                                </div>

                                {mapTenantShape ? (
                                    <svg
                                        aria-hidden="true"
                                        viewBox={`0 0 ${MAP_SIZE.width} ${MAP_SIZE.height}`}
                                        className="tenant-detail-map-active-shape pointer-events-none absolute inset-0 z-10 h-full w-full"
                                    >
                                        <path className="tenant-detail-map-active-aura" d={mapTenantShape} />
                                        <path className="tenant-detail-map-active-fill" d={mapTenantShape} />
                                        <path className="tenant-detail-map-active-rim" d={mapTenantShape} />
                                    </svg>
                                ) : null}

                                {mapMarkerPosition ? (
                                    <div
                                        className="tenant-detail-map-marker absolute z-20 -translate-x-1/2 -translate-y-1/2"
                                        style={mapMarkerPosition}
                                    >
                                        <div className="flex flex-col items-center gap-[3px]">
                                            <span className="whitespace-nowrap rounded-sm bg-[#123d91] px-2 py-[3px] text-[6px] font-bold uppercase tracking-wide text-white shadow-[0_3px_8px_rgba(0,0,0,0.35)]">
                                                {mapTenantMarker?.label}
                                            </span>
                                            <span className="h-2 w-[1.5px] bg-white/60" />
                                        </div>
                                    </div>
                                ) : null}

                                <div className="absolute bottom-[18px] left-[28px] right-[22px] flex items-end justify-between gap-4">
                                    <div>
                                        <p className="text-[9px] font-bold uppercase text-white/70">Location</p>
                                        <p className="mt-[3px] text-[12px] font-semibold text-white">{locationFloor}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] font-bold uppercase text-white/70">Mall</p>
                                        <p className="mt-[3px] text-[12px] font-semibold text-white">{mallName}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .tenant-detail-map-stage {
                    animation: tenantDetailMapReveal 1.25s cubic-bezier(0.22, 1, 0.36, 1) both;
                    transform-origin: 62% 48%;
                    will-change: transform, filter;
                }

                .tenant-detail-map-marker {
                    animation: tenantDetailMarkerDrop 0.85s 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
                }

                .tenant-detail-map-active-shape path {
                    transform-box: fill-box;
                    transform-origin: center;
                    vector-effect: non-scaling-stroke;
                }

                .tenant-detail-map-active-aura {
                    animation: tenantDetailTenantAura 1.85s ease-in-out infinite;
                    fill: rgba(73, 182, 255, 0.24);
                    filter: drop-shadow(0 0 8px rgba(56, 189, 248, 0.72)) drop-shadow(0 0 18px rgba(56, 189, 248, 0.42));
                    opacity: 0.52;
                }

                .tenant-detail-map-active-fill {
                    animation: tenantDetailTenantFill 1.85s ease-in-out infinite;
                    fill: rgba(49, 162, 255, 0.34);
                    opacity: 0.66;
                }

                .tenant-detail-map-active-rim {
                    animation: tenantDetailTenantRim 1.85s ease-in-out infinite;
                    fill: none;
                    stroke: rgba(76, 190, 255, 0.9);
                    stroke-linecap: round;
                    stroke-linejoin: round;
                    stroke-width: 3.7;
                    filter: drop-shadow(0 0 5px rgba(56, 189, 248, 0.74)) drop-shadow(0 0 13px rgba(56, 189, 248, 0.45));
                }

                @keyframes tenantDetailMapReveal {
                    0% {
                        filter: saturate(0.82) brightness(1.04);
                        transform: translate3d(3.5%, -3%, 0) scale(1.12) rotateX(7deg);
                    }

                    58% {
                        filter: saturate(1.04) brightness(1.02);
                    }

                    100% {
                        filter: saturate(1.06) brightness(1);
                        transform: translate3d(0, 0, 0) scale(1) rotateX(0deg);
                    }
                }

                @keyframes tenantDetailMarkerDrop {
                    0% {
                        opacity: 0;
                        transform: translate(-50%, -74%) scale(0.65);
                    }

                    100% {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(1);
                    }
                }

                @keyframes tenantDetailTenantAura {
                    0%,
                    100% {
                        opacity: 0.24;
                        transform: scale(0.985);
                    }

                    50% {
                        opacity: 0.68;
                        transform: scale(1.035);
                    }
                }

                @keyframes tenantDetailTenantFill {
                    0%,
                    100% {
                        fill: rgba(49, 162, 255, 0.18);
                        opacity: 0.3;
                        transform: scale(0.992);
                    }

                    50% {
                        fill: rgba(49, 162, 255, 0.42);
                        opacity: 0.68;
                        transform: scale(1.018);
                    }
                }

                @keyframes tenantDetailTenantRim {
                    0%,
                    100% {
                        opacity: 0.58;
                        stroke-width: 2.8;
                        transform: scale(0.992);
                    }

                    50% {
                        opacity: 1;
                        stroke-width: 5.4;
                        transform: scale(1.025);
                    }
                }
            `}</style>
        </section>
    );
}
