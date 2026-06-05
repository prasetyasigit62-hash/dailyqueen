'use client';

/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-no-comment-textnodes */

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Floor, mallDirectoryInterface } from '@/types/mallDirectoryInterface';
import TenantView, { FLOORS } from './TenantView';
import mallDirectoryImage from '@/public/mall_directory.png';
import qCimage from '@/public/qc_fromtop.jpg';

type mallDirectoryProps = {
    mallDirectory: mallDirectoryInterface;
};

type TenantRecord = Floor['tenant'][number];

const MALL_DIRECTORY_SESSION_KEY = 'queen-city:mall-directory:last-view';

type StoredMallDirectoryState = {
    activeFloor?: string | null;
    selectedTenantId?: string | number | null;
    selectedTenantName?: string | null;
    fromMaps?: boolean | null;
    updatedAt?: number;
};

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ');
}

function readStoredMallDirectoryState() {
    if (typeof window === 'undefined') {
        return null;
    }

    try {
        const value = window.sessionStorage.getItem(MALL_DIRECTORY_SESSION_KEY);

        return value ? (JSON.parse(value) as StoredMallDirectoryState) : null;
    } catch {
        return null;
    }
}

function updateStoredMallDirectoryState(nextState: StoredMallDirectoryState) {
    if (typeof window === 'undefined') {
        return;
    }

    const currentState = readStoredMallDirectoryState() || {};
    window.sessionStorage.setItem(
        MALL_DIRECTORY_SESSION_KEY,
        JSON.stringify({
            ...currentState,
            ...nextState,
            updatedAt: Date.now(),
        })
    );
}

function clearStoredMallDirectoryState() {
    if (typeof window === 'undefined') {
        return;
    }

    window.sessionStorage.removeItem(MALL_DIRECTORY_SESSION_KEY);
}

function getStoredActiveFloor() {
    const storedState = readStoredMallDirectoryState();

    if (!storedState?.activeFloor) {
        return null;
    }

    return FLOORS.some((floor) => floor.id === storedState.activeFloor) ? storedState.activeFloor : null;
}

const floorDesign = [
    {
        label: 'Ground Floor',
        image: '/1.jpg',
    },
    {
        label: '1st Floor',
        image: '/2.jpg',
    },
    {
        label: '2nd Floor',
        image: '/3.jpg',
    },
    {
        label: '3rd Floor',
        image: '/4.jpg',
    },
];

function getFloorSuffix(label: string) {
    if (label.includes('1st')) return 'st';
    if (label.includes('2nd')) return 'nd';
    return 'rd';
}

function getFloorId(label: string) {
    if (label === 'Ground Floor') return 'gf';
    if (label.includes('1st')) return 'f1';
    if (label.includes('2nd')) return 'f2';
    return 'f3';
}

function getFloorIdFromName(floorName?: string) {
    const value = floorName?.toLowerCase() || '';

    if (value.includes('ground') || value.includes('gf')) return 'gf';
    if (value.includes('1st') || value.includes('first') || value.includes('lantai 1') || value.includes('f1')) return 'f1';
    if (value.includes('2nd') || value.includes('second') || value.includes('lantai 2') || value.includes('f2')) return 'f2';
    return 'f3';
}

function extractAllTenants(mallDirectory: mallDirectoryInterface) {
    const tenants: TenantRecord[] = [];

    Object.values(mallDirectory || {}).forEach((floorSections) => {
        if (!Array.isArray(floorSections)) return;

        floorSections.forEach((section) => {
            if (Array.isArray(section.tenant)) {
                tenants.push(...section.tenant);
            }
        });
    });

    return tenants;
}

function renderFloorTitle(label: string, variant: 'default' | 'hover') {
    if (label === 'Ground Floor') {
        return (
            <span
                className={classNames(
                    variant === 'default'
                        ? 'font-sans text-[18px] font-medium leading-none tracking-normal text-white drop-shadow-[0_3px_14px_rgba(0,0,0,0.55)] md:text-[28px] lg:text-[37px]'
                        : 'text-[14px] font-extrabold leading-none tracking-normal text-white drop-shadow-[0_3px_16px_rgba(0,0,0,0.6)] md:text-[20px] lg:text-[24px]'
                )}
            >
                Ground Floor
            </span>
        );
    }

    return (
        <span
            className={classNames(
                'leading-none tracking-normal',
                variant === 'default'
                    ? 'font-sans text-[18px] font-medium text-white drop-shadow-[0_3px_14px_rgba(0,0,0,0.55)] md:text-[28px] lg:text-[37px]'
                    : 'text-[14px] font-extrabold text-white drop-shadow-[0_3px_16px_rgba(0,0,0,0.6)] md:text-[20px] lg:text-[24px]'
            )}
        >
            {label.charAt(0)}
            <sup
                className={classNames(
                    'mr-0.5 align-super italic',
                    variant === 'default' ? 'text-[10px] font-medium md:text-[14px] lg:text-[19px]' : 'text-[8px] font-semibold md:text-[10px] lg:text-[11px]'
                )}
            >
                {getFloorSuffix(label)}
            </sup>{' '}
            Floor
        </span>
    );
}

function FloorDivider() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 220 8"
            preserveAspectRatio="none"
            className="mt-[3px] block h-[6px] w-[190px] max-w-full self-center overflow-visible"
        >
            <defs>
                <linearGradient id="floorTitleUnderline" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="rgba(255,255,255,0)" />
                    <stop offset="0.12" stopColor="rgba(255,255,255,0.22)" />
                    <stop offset="0.5" stopColor="rgba(255,255,255,0.95)" />
                    <stop offset="0.86" stopColor="rgba(255,255,255,0.24)" />
                    <stop offset="1" stopColor="rgba(255,255,255,0)" />
                </linearGradient>
            </defs>
            <path
                d="M0 5.4 C58 3.7 158 3.7 220 5.4"
                fill="none"
                stroke="url(#floorTitleUnderline)"
                strokeLinecap="round"
                strokeWidth="2.55"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    );
}

export default function MallDirectory({ mallDirectory }: mallDirectoryProps) {
    const hasMallDirectory = Object.keys(mallDirectory || {}).length > 0;
    const [activeFloor, setActiveFloor] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [hasRestoredFloor, setHasRestoredFloor] = useState(false);
    // Live floor cover images from back-office (overrides defaults in floorDesign when present).
    // `coversLoaded` gates the image render so we never flash the old static, then swap to the new one.
    const [coverOverrides, setCoverOverrides] = useState<Record<string, string>>({});
    const [coversLoaded, setCoversLoaded] = useState(false);

    useEffect(() => {
        const storedActiveFloor = getStoredActiveFloor();

        if (storedActiveFloor) {
            setActiveFloor(storedActiveFloor);
            window.requestAnimationFrame(() => {
                document.getElementById('mall-directory')?.scrollIntoView({ block: 'start' });
            });
        }

        setHasRestoredFloor(true);
    }, []);

    useEffect(() => {
        let cancelled = false;
        fetch(`/api/floor-covers?type=homepage&_=${Date.now()}`, { cache: 'no-store' })
            .then((res) => (res.ok ? res.json() : null))
            .then((json) => {
                if (cancelled) return;
                if (json?.byKey) {
                    const next: Record<string, string> = {};
                    Object.entries(json.byKey as Record<string, { image: string | null }>).forEach(([key, val]) => {
                        if (val?.image) next[key] = val.image;
                    });
                    setCoverOverrides(next);
                }
                setCoversLoaded(true);
            })
            .catch(() => {
                if (!cancelled) setCoversLoaded(true);
            });
        return () => { cancelled = true; };
    }, []);

    useEffect(() => {
        if (!hasRestoredFloor) {
            return;
        }

        if (activeFloor) {
            updateStoredMallDirectoryState({ activeFloor });
        }
    }, [activeFloor, hasRestoredFloor]);

    if (!hasMallDirectory) return null;

    const normalizedSearch = searchQuery.trim().toLowerCase();
    const allTenants = extractAllTenants(mallDirectory);
    const searchResults = normalizedSearch
        ? allTenants
              .filter((tenant) => {
                  const tenantName = tenant.nama?.toLowerCase() || '';
                  const categoryName = tenant.kategori?.nama?.toLowerCase() || '';
                  const floorName = tenant.lantai?.nama?.toLowerCase() || '';

                  return tenantName.includes(normalizedSearch) || categoryName.includes(normalizedSearch) || floorName.includes(normalizedSearch);
              })
              .slice(0, 6)
        : [];

    const openFloor = (floorId: string) => {
        updateStoredMallDirectoryState({
            activeFloor: floorId,
            selectedTenantId: null,
            selectedTenantName: null,
        });
        setSearchQuery('');
        setActiveFloor(floorId);
        window.requestAnimationFrame(() => {
            document.getElementById('mall-directory')?.scrollIntoView({ block: 'start' });
        });
    };

    const handleFloorCardKeyboard = (event: React.KeyboardEvent<HTMLDivElement>, floorId: string) => {
        if (event.key !== 'Enter' && event.key !== ' ') {
            return;
        }

        event.preventDefault();
        openFloor(floorId);
    };

    const openSearchResult = (tenant: TenantRecord) => {
        const floorId = getFloorIdFromName(tenant.lantai?.nama);
        updateStoredMallDirectoryState({
            activeFloor: floorId,
            selectedTenantId: tenant.id ?? null,
            selectedTenantName: tenant.nama ?? null,
            fromMaps: true,
        });
        setSearchQuery('');
        setActiveFloor(floorId);
        window.requestAnimationFrame(() => {
            document.getElementById('mall-directory')?.scrollIntoView({ block: 'start' });
        });
    };

    const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (searchResults[0]) {
            openSearchResult(searchResults[0]);
        }
    };

    if (activeFloor) {
        return (
            <section id="mall-directory">
                <div className="relative">
                    <div className="absolute hidden h-full w-full -z-20 lg:block">
                        <Image
                            src={qCimage}
                            width="0"
                            height="0"
                            sizes="100vw"
                            className="top-0 left-0 h-full w-full object-cover opacity-7 opacity-30"
                            alt="topmall"
                        />
                    </div>

                    <div className="relative flex w-full justify-center overflow-hidden py-6">
                        <Image
                            src={qCimage}
                            alt="Queen City Mall background"
                            fill
                            sizes="100vw"
                            className="object-cover object-center opacity-75"
                            priority
                        />
                        <div className="absolute inset-0 bg-white/70" />
                        <Image src={mallDirectoryImage} className="relative z-10 w-1/2 lg:w-2/12" alt="mall-directory" />
                    </div>

                    <TenantView
                        initialFloor={activeFloor}
                        initialSearch={searchQuery}
                        onClose={() => {
                            clearStoredMallDirectoryState();
                            setActiveFloor(null);
                        }}
                        mallDirectory={mallDirectory}
                    />
                </div>
            </section>
        );
    }

    return (
        <section id="mall-directory">
            <div className="relative">
                <div className="absolute hidden h-full w-full -z-20 lg:block">
                    <Image
                        src={qCimage}
                        width="0"
                        height="0"
                        sizes="100vw"
                        className="top-0 left-0 h-full w-full object-cover opacity-7 opacity-30"
                        alt="topmall"
                    />
                </div>

                <div className="flex w-full justify-center py-6">
                    <Image src={mallDirectoryImage} className="w-1/2 lg:w-2/12" alt="mall-directory" />
                </div>

                <div className="bg-[#0a0a0a] text-white">
                    <div className="flex items-center justify-between bg-[#0a0a0a] px-6 pb-3 pt-4 lg:px-5">
                        <div className="flex flex-col items-start">
                            <a
                                href="/schedule-event"
                                className="group flex items-center gap-2 text-[16px] font-semibold tracking-normal transition duration-300 hover:text-white/82 lg:text-[18px]"
                                aria-label="Go to What's On"
                            >
                                <span className="h-[10px] w-[10px] shrink-0 animate-pulse rounded-full border-[2px] border-white bg-[#e53e3e]" />
                                <span className="transition duration-300 group-hover:translate-x-0.5">New Tenant Update</span>
                            </a>
                            <svg
                                aria-hidden="true"
                                viewBox="0 0 220 8"
                                preserveAspectRatio="none"
                                className="ml-[4px] mt-[3px] block h-[6px] w-[190px] max-w-[calc(100vw-7rem)] overflow-visible"
                            >
                                <defs>
                                    <linearGradient id="newTenantUnderline" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0" stopColor="rgba(255,255,255,0)" />
                                        <stop offset="0.12" stopColor="rgba(255,255,255,0.22)" />
                                        <stop offset="0.5" stopColor="rgba(255,255,255,0.95)" />
                                        <stop offset="0.86" stopColor="rgba(255,255,255,0.24)" />
                                        <stop offset="1" stopColor="rgba(255,255,255,0)" />
                                    </linearGradient>
                                </defs>
                                <path
                                    d="M0 5.4 C58 3.7 158 3.7 220 5.4"
                                    fill="none"
                                    stroke="url(#newTenantUnderline)"
                                    strokeLinecap="round"
                                    strokeWidth="2.15"
                                    vectorEffect="non-scaling-stroke"
                                />
                            </svg>
                        </div>
                        <form onSubmit={submitSearch} className="relative mr-2 lg:mr-4">
                            <div className="flex w-[140px] min-w-0 items-center gap-2 border-b border-white/55 pb-1 text-[13px] italic text-white/68 drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)] transition duration-300 focus-within:border-white/90 focus-within:text-white hover:border-white/85 hover:text-white md:w-auto md:min-w-[220px] md:gap-3 md:text-[15px] lg:min-w-[250px] lg:text-[16px]">
                                <button type="submit" aria-label="Search tenants" className="shrink-0">
                                    <svg
                                        aria-hidden="true"
                                        viewBox="0 0 24 24"
                                        className="h-[20px] w-[20px] lg:h-[21px] lg:w-[21px]"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    >
                                        <circle cx="11" cy="11" r="7" />
                                        <path d="M21 21l-5-5" />
                                    </svg>
                                </button>
                                <input
                                    value={searchQuery}
                                    onChange={(event) => setSearchQuery(event.target.value)}
                                    placeholder="Search"
                                    className="w-full bg-transparent text-white/90 outline-none placeholder:text-white/62"
                                />
                            </div>

                            {normalizedSearch && (
                                <div className="absolute right-0 top-[calc(100%+12px)] z-30 w-[300px] overflow-hidden rounded-xl border border-white/12 bg-black/88 text-left shadow-[0_20px_45px_rgba(0,0,0,0.55)] backdrop-blur-md">
                                    {searchResults.length > 0 ? (
                                        searchResults.map((tenant) => (
                                            <button
                                                key={tenant.id}
                                                type="button"
                                                onClick={() => openSearchResult(tenant)}
                                                className="block w-full border-b border-white/8 px-4 py-3 text-left transition hover:bg-white/10"
                                            >
                                                <span className="block text-[13px] font-semibold text-white">{tenant.nama}</span>
                                                <span className="mt-1 block text-[11px] text-white/58">
                                                    {tenant.lantai?.nama || 'Floor'} · {tenant.kategori?.nama || 'Tenant'}
                                                </span>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-4 py-4 text-[13px] text-white/62">Tenant tidak ditemukan.</div>
                                    )}
                                </div>
                            )}
                        </form>
                    </div>

                    <div className="grid grid-cols-2 gap-[8px] bg-[#0a0a0a] px-3 pb-4 md:grid-cols-2 md:gap-[10px] md:px-5 md:pb-5 lg:grid-cols-4">
                        {floorDesign.map((design, index) => {
                            const floorId = getFloorId(design.label);
                            const liveCover = floorId ? coverOverrides[floorId] : undefined;

                            return (
                                <div
                                    key={design.label}
                                    role="button"
                                    tabIndex={0}
                                    data-floor-id={floorId}
                                    onPointerUp={() => openFloor(floorId)}
                                    onClick={() => openFloor(floorId)}
                                    onKeyDown={(event) => handleFloorCardKeyboard(event, floorId)}
                                    className="block h-full focus:outline-none"
                                    aria-label={`Open ${design.label} tenant directory`}
                                >
                                    <div
                                        data-floor-id={floorId}
                                        className={classNames(
                                            'group relative h-full aspect-[3/4] w-full cursor-pointer overflow-hidden rounded-xl text-left transition duration-[600ms] ease-out md:aspect-[9/14] md:rounded-2xl',
                                            'animate-[rise_0.65s_ease-out_backwards] before:pointer-events-none before:absolute before:bottom-0 before:top-0 before:z-10 before:w-[55px] before:-translate-x-[120%] before:-skew-x-12 before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] before:content-[""] hover:z-20 hover:-translate-y-[3px] hover:scale-[1.022] hover:shadow-[0_24px_50px_rgba(0,0,0,0.7)] hover:before:animate-[shine_1s_ease-out_forwards]'
                                        )}
                                        style={{ animationDelay: `${0.05 + index * 0.09}s` }}
                                    >
                                        {coversLoaded ? (
                                            <Image
                                                src={liveCover || design.image}
                                                alt={design.label}
                                                unoptimized={Boolean(liveCover)}
                                                fill
                                                sizes="(max-width: 1024px) 100vw, 25vw"
                                                className="pointer-events-none object-cover transition duration-[1300ms] ease-out group-hover:scale-[1.08] group-hover:brightness-105"
                                                priority={index === 0}
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-[#13091e]" />
                                        )}
                                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,transparent_35%,rgba(0,0,0,0.72)_100%)]" />
                                        <div className="pointer-events-none absolute inset-0 text-white">
                                            <div className="flex h-full items-end justify-center px-6 pb-[13%] transition duration-[420ms] ease-out group-hover:translate-y-3 group-hover:opacity-0">
                                                <div className="flex w-full flex-col items-center">
                                                    {renderFloorTitle(design.label, 'default')}
                                                    <FloorDivider />
                                                </div>
                                            </div>

                                            <div className="absolute bottom-5 left-5 right-5 translate-y-3 opacity-0 transition duration-[480ms] ease-out group-hover:translate-y-0 group-hover:opacity-100">
                                                {renderFloorTitle(design.label, 'hover')}
                                                <FloorDivider />
                                            </div>

                                            <div className="absolute bottom-2.5 right-2.5 transition duration-[480ms] ease-out group-hover:-translate-y-1">
                                                <div className="inline-flex h-[17px] items-center justify-center rounded-full border border-white/16 bg-black/55 px-2 backdrop-blur-md">
                                                    <span className="block text-center text-[8px] font-semibold leading-none tracking-normal text-white lg:text-[9px]">
                                                        {(FLOORS[index]?.cats as unknown as { count?: number }[])?.reduce(
                                                            (acc, cat) => acc + (cat.count || 0),
                                                            0
                                                        ) || 0}{' '}
                                                        Tenants
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
