'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { Floor, mallDirectoryInterface } from '@/types/mallDirectoryInterface';
import TenantDetailView from './TenantDetailView';

const T = {
    ink: '#ffffff',
    inkDim: '#9289a3',
    paper: '#0b0512',
    paperDeep: '#13091e',
    card: '#180d26',
    accent: '#dca556',
    navy: '#ffffff',
    shadow: '#000000',
    serif: '"Playfair Display", "Times New Roman", serif',
    sans: '"Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", ui-monospace, monospace',
};

const MALL_DIRECTORY_SESSION_KEY = 'queen-city:mall-directory:last-view';

type StoredMallDirectoryState = {
    activeFloor?: string | null;
    selectedTenantId?: string | number | null;
    selectedTenantName?: string | null;
    updatedAt?: number;
};

export const FLOORS = [
    {
        id: 'gf',
        label: 'Ground Floor',
        num: '00',
        caption: 'Daily essentials & supermarket',
        cover: '/1.jpg',
        cats: [
            {
                id: 'supermarket',
                label: 'Supermarket',
                count: 12,
                accent: '#7a9b6f',
            },
            {
                id: 'coffee',
                label: 'Coffee & Bakery',
                count: 18,
                accent: '#a87454',
            },
            {
                id: 'kids-gf',
                label: 'Kids & Family',
                count: 19,
                accent: '#d4985a',
            },
            {
                id: 'services',
                label: 'Services & Banks',
                count: 9,
                accent: '#5a7a9b',
            },
        ],
    },
    {
        id: 'f1',
        label: '1st Floor',
        num: '01',
        caption: 'Fashion, beauty & lifestyle',
        cover: '/1stfloor.jpg',
        cats: [
            {
                id: 'fashion',
                label: 'Fashion',
                count: 62,
                accent: '#9b6f8c',
            },
            {
                id: 'beauty',
                label: 'Beauty & Wellness',
                count: 31,
                accent: '#c97a8a',
            },
            {
                id: 'shoes',
                label: 'Shoes & Bags',
                count: 24,
                accent: '#8a6432',
            },
            {
                id: 'jewellery',
                label: 'Jewellery',
                count: 8,
                accent: '#b08446',
            },
        ],
    },
    {
        id: 'f2',
        label: '2nd Floor',
        num: '02',
        caption: 'Tech, gadget & accessories',
        cover: '/3.jpg',
        cats: [
            {
                id: 'tech',
                label: 'Gadget & Electronics',
                count: 24,
                accent: '#4a6b8a',
            },
            {
                id: 'accessories',
                label: 'Accessories',
                count: 14,
                accent: '#7a8a4a',
            },
            {
                id: 'books',
                label: 'Books & Stationery',
                count: 6,
                accent: '#8a5a4a',
            },
            {
                id: 'sport',
                label: 'Sport & Outdoor',
                count: 11,
                accent: '#5a8a6b',
            },
        ],
    },
    {
        id: 'f3',
        label: '3rd Floor',
        num: '03',
        caption: 'Food court, dining & entertainment',
        cover: '/4.jpg',
        cats: [
            {
                id: 'fnb',
                label: 'Food & Beverages',
                count: 84,
                accent: '#b08446',
            },
            {
                id: 'restaurant',
                label: 'Restaurants',
                count: 32,
                accent: '#a85a4a',
            },
            {
                id: 'play',
                label: 'Entertainment',
                count: 17,
                accent: '#7a4a8a',
            },
            {
                id: 'cinema',
                label: 'Cinema & Arcade',
                count: 4,
                accent: '#4a4a8a',
            },
        ],
    },
] as const;

type TenantRecord = Floor['tenant'][number];

type DynamicCategory = {
    id: string;
    label: string;
    count: number;
    accent: string;
    originalTenants: TenantRecord[];
};

type FloorMeta = (typeof FLOORS)[number];

type TenantViewProps = {
    initialFloor: string;
    onClose: () => void;
    mallDirectory: mallDirectoryInterface | undefined;
    initialSearch: string;
};

function isReloadNavigation() {
    if (typeof window === 'undefined') {
        return false;
    }

    const [navigationEntry] = window.performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];

    return navigationEntry?.type === 'reload';
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

const FLOOR_NAME_MAP: Record<string, string[]> = {
    gf: ['ground floor', 'gf'],
    f1: ['1st floor', 'first floor', 'lantai 1', 'f1'],
    f2: ['2nd floor', 'second floor', 'lantai 2', 'f2'],
    f3: ['3rd floor', 'third floor', 'lantai 3', 'f3'],
};

function CategoryButton({ cat, isSelected, onClick }: { cat: DynamicCategory; isSelected: boolean; onClick: () => void }) {
    const [isHover, setIsHover] = useState(false);
    const isLifted = isHover || isSelected;
    let buttonBackground = `linear-gradient(135deg, rgba(255,255,255,0.06) 0%, ${T.card} 54%, rgba(255,255,255,0.025) 100%)`;
    let buttonBorder = 'rgba(255,255,255,0.12)';
    let buttonShadow = 'inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 18px rgba(0,0,0,0.2)';
    let countColor = T.inkDim;
    let countBackground = `${T.ink}0A`;

    if (isSelected) {
        buttonBackground = `linear-gradient(135deg, ${cat.accent} 0%, ${T.accent} 48%, rgba(255,255,255,0.94) 100%)`;
        buttonBorder = 'rgba(255,255,255,0.86)';
        buttonShadow = `0 16px 34px ${cat.accent}42, inset 0 1px 0 rgba(255,255,255,0.65)`;
        countColor = T.paper;
        countBackground = 'rgba(0,0,0,0.18)';
    } else if (isHover) {
        buttonBackground = `linear-gradient(135deg, rgba(255,255,255,0.13) 0%, ${cat.accent}2E 48%, rgba(255,255,255,0.06) 100%)`;
        buttonBorder = `${cat.accent}A8`;
        buttonShadow = `0 14px 30px ${cat.accent}30, 0 8px 18px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.16)`;
        countColor = T.ink;
        countBackground = 'rgba(255,255,255,0.14)';
    }

    const buttonColor = isSelected ? T.paper : T.ink;

    return (
        <button
            type="button"
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            onClick={onClick}
            style={{
                position: 'relative',
                padding: '9px 16px 9px 13px',
                borderRadius: 999,
                background: buttonBackground,
                border: `1px solid ${buttonBorder}`,
                color: buttonColor,
                fontFamily: T.sans,
                fontSize: 12,
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 9,
                cursor: 'pointer',
                overflow: 'hidden',
                isolation: 'isolate',
                letterSpacing: '-.01em',
                transition:
                    'transform .42s cubic-bezier(.19,1,.22,1), border-color .42s ease, box-shadow .42s ease, background .42s ease, color .28s ease',
                boxShadow: buttonShadow,
                transform: isLifted ? 'translateY(-4px) scale(1.025)' : 'translateY(0) scale(1)',
            }}
        >
            <span
                aria-hidden="true"
                style={{
                    position: 'absolute',
                    inset: 1,
                    zIndex: -1,
                    borderRadius: 999,
                    background: `linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.28) 42%, transparent 62%)`,
                    opacity: isHover ? 0.82 : 0,
                    transform: isHover ? 'translateX(48%) skewX(-18deg)' : 'translateX(-120%) skewX(-18deg)',
                    transition: 'transform .72s cubic-bezier(.19,1,.22,1), opacity .36s ease',
                }}
            />
            <span
                style={{
                    width: isLifted ? 10 : 8,
                    height: isLifted ? 10 : 8,
                    borderRadius: '50%',
                    background: isSelected ? T.paper : cat.accent,
                    boxShadow: isLifted ? `0 0 0 5px ${cat.accent}22, 0 0 18px ${cat.accent}CC` : `0 0 10px ${cat.accent}95`,
                    transition: 'width .32s ease, height .32s ease, background .32s ease, box-shadow .32s ease',
                }}
            />
            <span style={{ position: 'relative', zIndex: 1 }}>{cat.label}</span>
            <span
                style={{
                    fontFamily: T.mono,
                    fontSize: 9,
                    lineHeight: 1,
                    color: countColor,
                    background: countBackground,
                    padding: '4px 7px',
                    borderRadius: 999,
                    minWidth: 24,
                    textAlign: 'center',
                    transition: 'background .32s ease, color .32s ease, transform .32s ease',
                    transform: isLifted ? 'translateX(2px)' : 'translateX(0)',
                }}
            >
                {cat.count}
            </span>
        </button>
    );
}

function TenantCard({ tenant, idx, onClick }: { tenant: TenantRecord; idx: number; onClick: () => void }) {
    const [isHover, setIsHover] = useState(false);
    const [isRevealed, setIsRevealed] = useState(false);
    const shellRef = useRef<HTMLDivElement | null>(null);
    const bentoPattern = [2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1];
    const span = bentoPattern[idx % bentoPattern.length];
    const isLarge = span === 2;
    const initialShiftX = idx % 2 === 0 ? -18 : 18;
    const shellStyle = {
        position: 'relative',
        aspectRatio: isLarge ? '2/1' : '1/1',
        ['--tenant-reveal-opacity' as const]: 0.18,
        ['--tenant-reveal-blur' as const]: '18px',
        ['--tenant-reveal-translate-x' as const]: `${initialShiftX}px`,
        ['--tenant-reveal-translate-y' as const]: '72px',
        ['--tenant-reveal-scale' as const]: 0.94,
        ['--tenant-reveal-rotate' as const]: '10deg',
        ['--tenant-sheen-opacity' as const]: 0.82,
        ['--tenant-sheen-x' as const]: '-135%',
        ['--tenant-reveal-delay' as const]: `${Math.min(idx % 6, 5) * 130}ms`,
    } as React.CSSProperties;

    useEffect(() => {
        const shell = shellRef.current;

        if (!shell) {
            return undefined;
        }

        const applyProgress = (progress: number) => {
            const clamped = Math.max(0, Math.min(1, progress));
            const inverse = 1 - clamped;

            if (clamped > 0.34) {
                setIsRevealed(true);
            }

            shell.style.setProperty('--tenant-reveal-opacity', `${0.18 + clamped * 0.82}`);
            shell.style.setProperty('--tenant-reveal-blur', `${inverse * 18}px`);
            shell.style.setProperty('--tenant-reveal-translate-x', `${initialShiftX * inverse}px`);
            shell.style.setProperty('--tenant-reveal-translate-y', `${inverse * 72}px`);
            shell.style.setProperty('--tenant-reveal-scale', `${0.94 + clamped * 0.06}`);
            shell.style.setProperty('--tenant-reveal-rotate', `${inverse * 10}deg`);
            shell.style.setProperty('--tenant-sheen-opacity', `${inverse * 0.82}`);
            shell.style.setProperty('--tenant-sheen-x', `${-135 + clamped * 270}%`);
        };

        let frameId = 0;
        let observer: IntersectionObserver | null = null;

        if ('IntersectionObserver' in window) {
            observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setIsRevealed(true);
                        observer?.disconnect();
                    }
                },
                {
                    rootMargin: '0px 0px -26% 0px',
                    threshold: 0.26,
                }
            );
        }

        const updateReveal = () => {
            frameId = 0;

            const rect = shell.getBoundingClientRect();
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
            const revealStart = viewportHeight * 1.08;
            const revealEnd = viewportHeight * 0.18;
            const rawProgress = (revealStart - rect.top) / (revealStart - revealEnd);

            applyProgress(rawProgress);
        };

        const requestUpdate = () => {
            if (frameId) {
                return;
            }

            frameId = window.requestAnimationFrame(updateReveal);
        };

        requestUpdate();
        observer?.observe(shell);
        window.addEventListener('scroll', requestUpdate, { passive: true });
        document.addEventListener('scroll', requestUpdate, { passive: true, capture: true });
        window.addEventListener('resize', requestUpdate);

        return () => {
            if (frameId) {
                window.cancelAnimationFrame(frameId);
            }

            observer?.disconnect();
            window.removeEventListener('scroll', requestUpdate);
            document.removeEventListener('scroll', requestUpdate, { capture: true });
            window.removeEventListener('resize', requestUpdate);
        };
    }, [initialShiftX]);

    return (
        <div
            ref={shellRef}
            className={`${isLarge ? 'col-span-1 md:col-span-2' : 'col-span-1'} mall-directory-tenant-card-shell ${
                isRevealed ? 'mall-directory-tenant-card-shell--revealed' : ''
            }`}
            style={shellStyle}
        >
            <button
                type="button"
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                onClick={onClick}
                className="mall-directory-tenant-card"
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    borderRadius: 18,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    background: T.paperDeep,
                    transform: isHover ? 'translateY(-6px) scale(1.01)' : 'translateY(0) scale(1)',
                    transition: 'transform .55s cubic-bezier(.2,.8,.2,1), box-shadow .45s ease',
                    boxShadow: isHover ? `0 24px 48px ${T.shadow}90, 0 0 0 1px ${T.accent}40` : `0 8px 20px ${T.shadow}40`,
                }}
            >
                <div style={{ position: 'absolute', inset: 0, background: T.paperDeep }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={tenant.gambarTenant || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80'}
                        alt={tenant.nama}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transform: isHover ? 'scale(1.08)' : 'scale(1.02)',
                            transition: 'transform 1.15s cubic-bezier(.16,1,.3,1)',
                            filter: isHover ? 'brightness(.85) saturate(1.1)' : 'brightness(.65) saturate(.9)',
                        }}
                    />
                </div>

                <div
                    aria-hidden="true"
                    className="mall-directory-tenant-card-sheen"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        zIndex: 2,
                        background:
                            'linear-gradient(105deg, transparent 0%, transparent 32%, rgba(255,255,255,0.18) 44%, transparent 58%, transparent 100%)',
                        pointerEvents: 'none',
                    }}
                />

                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        zIndex: 1,
                        background: isHover
                            ? 'linear-gradient(to top, rgba(14,4,32,0.95) 0%, rgba(14,4,32,0.2) 60%, transparent 100%)'
                            : 'linear-gradient(to top, rgba(14,4,32,0.85) 0%, rgba(14,4,32,0.3) 50%, transparent 100%)',
                        transition: 'background .5s',
                    }}
                />

                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 3,
                        padding: isLarge ? '28px' : '20px',
                        color: '#fff',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6,
                        textAlign: 'left',
                    }}
                >
                    <h4
                        style={{
                            fontFamily: T.sans,
                            fontWeight: 800,
                            fontSize: isLarge ? 28 : 20,
                            letterSpacing: '-.02em',
                            margin: 0,
                            textShadow: '0 2px 12px rgba(0,0,0,0.6)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            transform: isHover ? 'translateY(-4px)' : 'translateY(0)',
                            transition: 'transform .5s cubic-bezier(.2,.8,.2,1)',
                        }}
                    >
                        {tenant.nama}
                    </h4>

                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            flexWrap: 'wrap',
                            transform: isHover ? 'translateY(-2px)' : 'translateY(0)',
                            transition: 'transform .5s cubic-bezier(.2,.8,.2,1) .05s',
                        }}
                    >
                        <div
                            style={{
                                fontFamily: T.mono,
                                fontSize: isLarge ? 11 : 10,
                                color: T.accent,
                                textTransform: 'uppercase',
                                fontWeight: 700,
                                letterSpacing: '.1em',
                                background: 'rgba(0,0,0,0.4)',
                                backdropFilter: 'blur(4px)',
                                padding: '4px 10px',
                                borderRadius: 999,
                                border: `1px solid ${T.accent}40`,
                            }}
                        >
                            {tenant.lantai?.nama || 'Location'}
                        </div>
                        {tenant.lokasi?.nama_mall && (
                            <div
                                style={{
                                    fontFamily: T.sans,
                                    fontSize: isLarge ? 13 : 11,
                                    color: 'rgba(255,255,255,0.7)',
                                }}
                            >
                                {tenant.lokasi.nama_mall}
                            </div>
                        )}
                    </div>
                </div>

                <div
                    style={{
                        position: 'absolute',
                        right: isLarge ? 28 : 20,
                        bottom: isLarge ? 28 : 20,
                        zIndex: 4,
                        width: isLarge ? 40 : 36,
                        height: isLarge ? 40 : 36,
                        borderRadius: '50%',
                        background: T.accent,
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: isHover ? 'scale(1) rotate(-45deg)' : 'scale(0) rotate(0deg)',
                        opacity: isHover ? 1 : 0,
                        transition: 'all .5s cubic-bezier(.2,.8,.2,1)',
                        boxShadow: `0 8px 16px ${T.accent}60`,
                    }}
                >
                    <span style={{ fontSize: isLarge ? 20 : 18, fontWeight: 500 }}>→</span>
                </div>
            </button>
        </div>
    );
}

function extractAllTenants(mallDirectory?: mallDirectoryInterface) {
    const tenants: TenantRecord[] = [];

    if (!mallDirectory) {
        return tenants;
    }

    Object.values(mallDirectory).forEach((mallSections) => {
        if (!Array.isArray(mallSections)) {
            return;
        }

        mallSections.forEach((mallSection) => {
            if (Array.isArray(mallSection.tenant)) {
                tenants.push(...mallSection.tenant);
            }
        });
    });

    return tenants;
}

function buildDynamicCategories(mallDirectory: mallDirectoryInterface | undefined, currentFloorAliases: string[]) {
    const defaultAccents = ['#b08446', '#a85a4a', '#7a4a8a', '#4a6b8a', '#5a8a6b'];

    if (!mallDirectory) {
        return [] as DynamicCategory[];
    }

    const floorKey = Object.keys(mallDirectory).find((key) => {
        const value = key.toLowerCase();
        return currentFloorAliases.some((alias) => value.includes(alias));
    });

    if (!floorKey || !Array.isArray(mallDirectory[floorKey])) {
        return [] as DynamicCategory[];
    }

    return mallDirectory[floorKey].map((category, index) => ({
        id: category.nama.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        label: category.nama,
        count: Array.isArray(category.tenant) ? category.tenant.length : 0,
        accent: defaultAccents[index % defaultAccents.length],
        originalTenants: Array.isArray(category.tenant) ? category.tenant : [],
    }));
}

type FloorSwitcherProps = {
    active: string;
    onChange: React.Dispatch<string>;
    onBack: () => void;
};

function FloorNavUnderline({ active }: { active: boolean }) {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 120 8"
            preserveAspectRatio="none"
            className={`absolute -bottom-[3px] left-1/2 h-[7px] w-[118px] -translate-x-1/2 transition duration-300 ${
                active ? 'opacity-100' : 'opacity-0 translate-y-1 group-hover:translate-y-0 group-hover:opacity-90'
            }`}
        >
            <defs>
                <linearGradient id="floorNavUnderline" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="rgba(255,255,255,0)" />
                    <stop offset="0.16" stopColor="rgba(255,255,255,0.28)" />
                    <stop offset="0.5" stopColor="rgba(255,255,255,0.96)" />
                    <stop offset="0.84" stopColor="rgba(255,255,255,0.28)" />
                    <stop offset="1" stopColor="rgba(255,255,255,0)" />
                </linearGradient>
            </defs>
            <path
                d="M2 5.4 C30 3.5 54 3.4 73 4.5 C89 5.4 102 4.7 118 3.1"
                fill="none"
                stroke="url(#floorNavUnderline)"
                strokeLinecap="round"
                strokeWidth="2.1"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    );
}

function FloorSwitcher({ active, onChange, onBack }: FloorSwitcherProps) {
    return (
        <div className="flex flex-wrap items-center justify-center gap-5">
            <button
                type="button"
                onClick={onBack}
                aria-label="Back to floor panels"
                className="tenant-floor-menu-item group relative flex h-[31px] items-center px-1 pb-3 pt-1 text-[16px] font-bold leading-none text-white/90 transition duration-500 [text-shadow:0_2px_12px_rgba(0,0,0,0.95)] hover:-translate-x-0.5 hover:text-white"
            >
                ←
            </button>
            {FLOORS.filter((floorItem) => floorItem.id !== active).map((floorItem) => (
                <button
                    key={`${active}-${floorItem.id}`}
                    type="button"
                    onClick={() => onChange(floorItem.id)}
                    className="tenant-floor-menu-item group relative px-3 pb-3 pt-1 text-[13px] font-bold text-white/90 transition duration-500 [text-shadow:0_2px_12px_rgba(0,0,0,0.95)] hover:text-white"
                >
                    {floorItem.label}
                    <FloorNavUnderline active={false} />
                </button>
            ))}
        </div>
    );
}

export default function TenantView({ initialFloor, onClose, mallDirectory, initialSearch }: TenantViewProps) {
    const [active, setActive] = useState(initialFloor || 'gf');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedTenant, setSelectedTenant] = useState<TenantRecord | null>(null);
    const [tenantSearch, setTenantSearch] = useState(initialSearch);
    const [ajaxSearchResults, setAjaxSearchResults] = useState<TenantRecord[]>([]);
    const [isAjaxSearching, setIsAjaxSearching] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [hasRestoredTenant, setHasRestoredTenant] = useState(false);
    const [floorMotionKey, setFloorMotionKey] = useState(0);
    const [previousFloorCover, setPreviousFloorCover] = useState<FloorMeta | null>(null);
    const floorCoverTimeoutRef = useRef<number | null>(null);
    const floor = FLOORS.find((item) => item.id === active) || FLOORS[0];
    const floorMotionId = `${floor.id}-${floorMotionKey}`;
    const searchWidth = isSearchFocused || tenantSearch ? 180 : 120;
    const searchContainerWidth = searchWidth + 28;
    const normalizedTenantSearch = tenantSearch.trim().toLowerCase();
    const isSearchActive = normalizedTenantSearch.length > 0;

    const handleFloorChange = (floorId: string) => {
        if (floorId === active) {
            return;
        }

        if (floorCoverTimeoutRef.current) {
            window.clearTimeout(floorCoverTimeoutRef.current);
        }

        setPreviousFloorCover(floor);
        floorCoverTimeoutRef.current = window.setTimeout(() => {
            setPreviousFloorCover(null);
            floorCoverTimeoutRef.current = null;
        }, 2100);

        setActive(floorId);
        setSelectedCategory(null);
        setTenantSearch('');
        setSelectedTenant(null);
        setFloorMotionKey((currentKey) => currentKey + 1);
        updateStoredMallDirectoryState({ activeFloor: floorId, selectedTenantId: null, selectedTenantName: null });
    };

    useEffect(() => {
        if (initialFloor && FLOORS.some((item) => item.id === initialFloor)) {
            setActive(initialFloor);
            setSelectedCategory(null);
            setSelectedTenant(null);
            setTenantSearch(initialSearch);
            setFloorMotionKey((currentKey) => currentKey + 1);
        }
    }, [initialFloor, initialSearch]);

    useEffect(
        () => () => {
            if (floorCoverTimeoutRef.current) {
                window.clearTimeout(floorCoverTimeoutRef.current);
            }
        },
        []
    );

    const allTenants = useMemo(() => extractAllTenants(mallDirectory), [mallDirectory]);
    const currentFloorAliases = FLOOR_NAME_MAP[active] || [];
    const floorTenants = allTenants.filter((tenant) => {
        const tenantFloor = tenant?.lantai?.nama?.toLowerCase();

        if (!tenantFloor) {
            return false;
        }

        return currentFloorAliases.some((alias) => tenantFloor.includes(alias));
    });

    const filteredFloorTenants = floorTenants;

    const dynamicCats = buildDynamicCategories(mallDirectory, currentFloorAliases);
    const fallbackCats: DynamicCategory[] = (floor.cats as readonly FloorMeta['cats'][number][]).map((cat) => ({
        id: cat.id,
        label: cat.label,
        count: cat.count,
        accent: cat.accent,
        originalTenants: [],
    }));
    const categoriesToRender = dynamicCats.length > 0 ? dynamicCats : fallbackCats;
    const filteredCats = isSearchActive ? [] : categoriesToRender;
    const selectedCategoryTenants = selectedCategory ? dynamicCats.find((cat) => cat.id === selectedCategory)?.originalTenants || [] : null;
    let displayTenants = filteredFloorTenants;

    if (isSearchActive) {
        displayTenants = ajaxSearchResults;
    } else if (selectedCategoryTenants) {
        displayTenants = selectedCategoryTenants;
    }

    let emptyTenantMessage = 'No tenants registered on this floor yet.';

    if (isAjaxSearching) {
        emptyTenantMessage = 'Searching tenants...';
    } else if (tenantSearch) {
        emptyTenantMessage = `No tenants found matching "${tenantSearch}".`;
    }

    useEffect(() => {
        if (!isSearchActive) {
            setAjaxSearchResults([]);
            setIsAjaxSearching(false);
            return undefined;
        }

        let isCancelled = false;
        setIsAjaxSearching(true);
        setSelectedCategory(null);

        const searchTimer = window.setTimeout(() => {
            const runAjaxSearch = async () => {
                const results = allTenants.filter((tenant) => tenant.nama?.toLowerCase().includes(normalizedTenantSearch));

                if (!isCancelled) {
                    setAjaxSearchResults(results);
                    setIsAjaxSearching(false);
                }
            };

            runAjaxSearch();
        }, 240);

        return () => {
            isCancelled = true;
            window.clearTimeout(searchTimer);
        };
    }, [allTenants, isSearchActive, normalizedTenantSearch]);

    useEffect(() => {
        if (hasRestoredTenant) {
            return;
        }

        if (!isReloadNavigation()) {
            setHasRestoredTenant(true);
            return;
        }

        const storedState = readStoredMallDirectoryState();
        const storedTenantId = storedState?.selectedTenantId;
        const storedTenantName = storedState?.selectedTenantName?.toLowerCase();

        if (!storedTenantId && !storedTenantName) {
            setHasRestoredTenant(true);
            return;
        }

        const restoredTenant = allTenants.find((tenant) => {
            if (storedTenantId && String(tenant.id) === String(storedTenantId)) {
                return true;
            }

            return storedTenantName ? tenant.nama?.toLowerCase() === storedTenantName : false;
        });

        if (restoredTenant) {
            setSelectedTenant(restoredTenant);
        }

        setHasRestoredTenant(true);
    }, [allTenants, hasRestoredTenant]);

    const openTenantDetail = (tenant: TenantRecord) => {
        updateStoredMallDirectoryState({
            activeFloor: active,
            selectedTenantId: tenant.id,
            selectedTenantName: tenant.nama,
        });
        setSelectedTenant(tenant);
    };

    const closeTenantDetail = () => {
        updateStoredMallDirectoryState({
            activeFloor: active,
            selectedTenantId: null,
            selectedTenantName: null,
        });
        setSelectedTenant(null);
    };

    return (
        <>
            <section
                className="pt-24 lg:pt-[7.9rem]"
                style={{
                    position: 'relative',
                    paddingBottom: '96px',
                    paddingLeft: '5%',
                    paddingRight: '5%',
                    background: T.paper,
                    backgroundImage: `radial-gradient(circle at 20% 0%, ${T.accent}06 0%, transparent 50%),
          radial-gradient(circle at 80% 100%, ${T.navy}08 0%, transparent 50%)`,
                    overflow: 'hidden',
                    minHeight: '100vh',
                }}
            >
                <style jsx global>{`
                    .tenant-floor-search::placeholder {
                        color: rgba(255, 255, 255, 0.78);
                        opacity: 1;
                    }

                    .tenant-floor-menu-item {
                        animation: tenantFloorMenuIn 1.05s cubic-bezier(0.16, 1, 0.3, 1) both;
                    }

                    .tenant-active-floor-label {
                        animation: tenantActiveFloorIn 1.15s cubic-bezier(0.16, 1, 0.3, 1) both;
                    }

                    .tenant-floor-cover-motion {
                        animation: tenantFloorCoverIn 2100ms cubic-bezier(0.16, 1, 0.3, 1) both;
                        transform-origin: center top;
                        will-change: transform, opacity, filter;
                    }

                    .tenant-floor-cover-motion-out {
                        animation: tenantFloorCoverOut 2100ms cubic-bezier(0.16, 1, 0.3, 1) both;
                        transform-origin: center top;
                        will-change: transform, opacity, filter;
                    }

                    .tenant-floor-content-motion {
                        animation: tenantFloorContentIn 1750ms cubic-bezier(0.16, 1, 0.3, 1) both;
                        will-change: transform, opacity, filter;
                    }

                    .tenant-floor-filters-motion {
                        animation: tenantFloorFiltersIn 1850ms cubic-bezier(0.16, 1, 0.3, 1) both;
                        will-change: transform, opacity;
                    }

                    .tenant-floor-tenants-motion {
                        animation: tenantFloorTenantsIn 2300ms cubic-bezier(0.16, 1, 0.3, 1) both;
                        will-change: transform, opacity, filter;
                    }

                    .tenant-floor-menu-item:first-child {
                        min-width: 28px;
                        height: 31px;
                        justify-content: center;
                        font-size: 0;
                    }

                    .tenant-floor-menu-item:first-child::before {
                        content: '';
                        position: absolute;
                        left: 7px;
                        top: 10px;
                        width: 15px;
                        height: 2px;
                        border-radius: 999px;
                        background: currentColor;
                        transition: transform 0.48s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.48s ease;
                    }

                    .tenant-floor-menu-item:first-child::after {
                        content: '';
                        position: absolute;
                        left: 7px;
                        top: 7px;
                        width: 8px;
                        height: 8px;
                        border-bottom: 2px solid currentColor;
                        border-left: 2px solid currentColor;
                        transform: rotate(45deg);
                        transition: transform 0.48s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.48s ease;
                    }

                    .tenant-floor-menu-item:first-child:hover::before {
                        opacity: 1;
                        transform: translateX(-5px) scaleX(1.12);
                    }

                    .tenant-floor-menu-item:first-child:hover::after {
                        opacity: 1;
                        transform: translateX(-5px) rotate(45deg) scale(1.08);
                    }

                    @keyframes tenantFloorMenuIn {
                        from {
                            opacity: 0;
                            transform: translateX(24px);
                        }
                        to {
                            opacity: 1;
                            transform: translateX(0);
                        }
                    }

                    @keyframes tenantActiveFloorIn {
                        from {
                            opacity: 0;
                            transform: translateX(30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateX(0);
                        }
                    }

                    @keyframes tenantFloorCoverIn {
                        from {
                            opacity: 0.28;
                            filter: saturate(0.86) contrast(1) blur(8px);
                            transform: scale(1.07);
                        }
                        to {
                            opacity: 0.95;
                            filter: saturate(1.06) contrast(1.08) blur(0);
                            transform: scale(1);
                        }
                    }

                    @keyframes tenantFloorCoverOut {
                        from {
                            opacity: 0.86;
                            filter: saturate(1.04) contrast(1.06) blur(0);
                            transform: scale(1);
                        }
                        to {
                            opacity: 0;
                            filter: saturate(0.88) contrast(1) blur(10px);
                            transform: scale(0.985);
                        }
                    }

                    @keyframes tenantFloorContentIn {
                        from {
                            opacity: 0.34;
                            filter: blur(10px);
                            transform: translate3d(0, 26px, 0) scale(0.985);
                        }
                        to {
                            opacity: 1;
                            filter: blur(0);
                            transform: translate3d(0, 0, 0) scale(1);
                        }
                    }

                    @keyframes tenantFloorFiltersIn {
                        from {
                            opacity: 0.32;
                            transform: translate3d(0, 22px, 0);
                        }
                        to {
                            opacity: 1;
                            transform: translate3d(0, 0, 0);
                        }
                    }

                    @keyframes tenantFloorTenantsIn {
                        from {
                            opacity: 0.26;
                            filter: blur(14px);
                            transform: translate3d(0, 44px, 0) scale(0.986);
                        }
                        to {
                            opacity: 1;
                            filter: blur(0);
                            transform: translate3d(0, 0, 0) scale(1);
                        }
                    }

                    .mall-directory-tenant-card-shell {
                        opacity: var(--tenant-reveal-opacity, 1);
                        filter: blur(var(--tenant-reveal-blur, 0px));
                        transform: perspective(1200px) translate3d(var(--tenant-reveal-translate-x, 0px), var(--tenant-reveal-translate-y, 0px), 0)
                            scale(var(--tenant-reveal-scale, 1)) rotateX(var(--tenant-reveal-rotate, 0deg));
                        transform-origin: center bottom;
                        transition: opacity 1450ms cubic-bezier(0.19, 1, 0.22, 1) var(--tenant-reveal-delay, 0ms),
                            filter 1550ms cubic-bezier(0.19, 1, 0.22, 1) var(--tenant-reveal-delay, 0ms),
                            transform 1650ms cubic-bezier(0.19, 1, 0.22, 1) var(--tenant-reveal-delay, 0ms);
                        will-change: transform, opacity, filter;
                    }

                    .mall-directory-tenant-card-shell--revealed {
                        opacity: 1;
                        filter: blur(0);
                        transform: perspective(1200px) translate3d(0, 0, 0) scale(1) rotateX(0deg);
                    }

                    .mall-directory-tenant-card-sheen {
                        opacity: var(--tenant-sheen-opacity, 0);
                        transform: translateX(var(--tenant-sheen-x, 135%)) skewX(-14deg);
                        transition: opacity 1300ms ease var(--tenant-reveal-delay, 0ms),
                            transform 1550ms cubic-bezier(0.19, 1, 0.22, 1) var(--tenant-reveal-delay, 0ms);
                        will-change: transform, opacity;
                    }

                    .mall-directory-tenant-card-shell--revealed .mall-directory-tenant-card-sheen {
                        opacity: 0;
                        transform: translateX(135%) skewX(-14deg);
                    }
                `}</style>
                <div
                    key={`${floorMotionId}-cover`}
                    className="tenant-floor-cover-motion"
                    aria-hidden="true"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: 360,
                        backgroundImage: `linear-gradient(90deg, ${T.paper} 0%, rgba(11,5,18,0.9) 20%, rgba(11,5,18,0.38) 52%, rgba(11,5,18,0.72) 100%),
                        linear-gradient(180deg, rgba(11,5,18,0.04) 0%, rgba(11,5,18,0.32) 58%, ${T.paper} 100%),
                        url(${floor.cover})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        opacity: 0.95,
                        filter: 'saturate(1.06) contrast(1.08)',
                    }}
                />
                {previousFloorCover && (
                    <div
                        key={`${floorMotionId}-${previousFloorCover.id}-cover-out`}
                        className="tenant-floor-cover-motion-out"
                        aria-hidden="true"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: 360,
                            backgroundImage: `linear-gradient(90deg, ${T.paper} 0%, rgba(11,5,18,0.9) 20%, rgba(11,5,18,0.38) 52%, rgba(11,5,18,0.72) 100%),
                        linear-gradient(180deg, rgba(11,5,18,0.04) 0%, rgba(11,5,18,0.32) 58%, ${T.paper} 100%),
                        url(${previousFloorCover.cover})`,
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                            pointerEvents: 'none',
                        }}
                    />
                )}
                <div
                    aria-hidden="true"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 365,
                        backgroundImage: `radial-gradient(circle at 74% 18%, ${T.accent}18 0%, transparent 34%),
                        linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 35%, ${T.paper} 100%)`,
                        pointerEvents: 'none',
                    }}
                />
                <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', padding: '0 4px' }}>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'minmax(220px, 1fr) auto minmax(220px, 1fr)',
                            alignItems: 'start',
                            marginBottom: 58,
                            paddingTop: 12,
                            paddingBottom: 16,
                            gap: 20,
                        }}
                    >
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                cursor: 'pointer',
                                opacity: 0.9,
                                background: 'transparent',
                                border: 0,
                                padding: 0,
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.opacity = '1';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.opacity = '0.9';
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    fontFamily: T.sans,
                                    fontSize: 16,
                                    fontWeight: 600,
                                    color: '#fff',
                                }}
                            >
                                <span
                                    className="animate-pulse"
                                    style={{
                                        height: 9,
                                        width: 9,
                                        borderRadius: '50%',
                                        border: '2px solid #fff',
                                        background: '#e53e3e',
                                    }}
                                />
                                <span key={floor.id} className="tenant-active-floor-label">
                                    {floor.label}
                                </span>
                            </div>
                            <svg
                                aria-hidden="true"
                                viewBox="0 0 220 8"
                                preserveAspectRatio="none"
                                style={{
                                    marginLeft: 4,
                                    marginTop: 3,
                                    display: 'block',
                                    height: 6,
                                    width: 180,
                                    maxWidth: 'calc(100vw-7rem)',
                                    overflow: 'visible',
                                }}
                            >
                                <defs>
                                    <linearGradient id="backUnderline" x1="0" y1="0" x2="1" y2="0">
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
                                    stroke="url(#backUnderline)"
                                    strokeLinecap="round"
                                    strokeWidth="2"
                                    vectorEffect="non-scaling-stroke"
                                />
                            </svg>
                        </button>

                        <FloorSwitcher active={active} onBack={onClose} onChange={handleFloorChange} />

                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                justifySelf: 'end',
                                width: searchContainerWidth,
                                borderBottom: '1.5px solid rgba(255,255,255,0.72)',
                                padding: '4px 0',
                                transition: 'width 0.3s ease, border-color 0.3s ease',
                                filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.65))',
                            }}
                            onFocusCapture={(e) => {
                                e.currentTarget.style.borderBottom = '1.5px solid #fff';
                            }}
                            onBlurCapture={(e) => {
                                e.currentTarget.style.borderBottom = '1.5px solid rgba(255,255,255,0.72)';
                            }}
                        >
                            <svg
                                aria-hidden="true"
                                viewBox="0 0 24 24"
                                style={{ height: 17, width: 17, color: 'rgba(255,255,255,0.92)' }}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                            >
                                <circle cx="11" cy="11" r="7" />
                                <path d="M21 21l-5-5" />
                            </svg>
                            <input
                                className="tenant-floor-search"
                                value={tenantSearch}
                                onChange={(e) => setTenantSearch(e.target.value)}
                                placeholder="Search"
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    outline: 'none',
                                    color: 'rgba(255,255,255,0.96)',
                                    fontSize: 15,
                                    fontWeight: 500,
                                    fontFamily: T.sans,
                                    width: searchWidth,
                                    transition: 'width 0.3s ease',
                                    textShadow: '0 2px 8px rgba(0,0,0,0.65)',
                                }}
                                onFocus={() => {
                                    setIsSearchFocused(true);
                                }}
                                onBlur={() => {
                                    setIsSearchFocused(false);
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div
                    key={`${floorMotionId}-cap`}
                    className="tenant-floor-content-motion"
                    style={{
                        position: 'relative',
                        maxWidth: 1280,
                        margin: '0 auto 22px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        flexWrap: 'wrap',
                        gap: 16,
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
                        <span
                            style={{
                                fontFamily: T.serif,
                                fontSize: 70,
                                fontWeight: 400,
                                color: T.ink,
                                letterSpacing: '-.04em',
                                lineHeight: 1,
                            }}
                        >
                            {floor.num}
                        </span>
                        <div>
                            <h2
                                style={{
                                    fontFamily: T.serif,
                                    fontSize: 30,
                                    fontWeight: 400,
                                    color: T.ink,
                                    letterSpacing: '-.02em',
                                    lineHeight: 1,
                                    margin: 0,
                                }}
                            >
                                <em style={{ color: T.accent }}>{floor.label}</em>
                            </h2>
                            <p
                                style={{
                                    fontFamily: T.sans,
                                    fontSize: 12,
                                    color: T.inkDim,
                                    fontWeight: 400,
                                    margin: '8px 0 0',
                                }}
                            >
                                {floor.caption}
                            </p>
                        </div>
                    </div>
                    <div
                        style={{
                            fontFamily: T.mono,
                            fontSize: 11,
                            letterSpacing: '.22em',
                            color: T.inkDim,
                            textTransform: 'uppercase',
                        }}
                    >
                        {displayTenants.length} tenants ·
                        <span style={{ color: T.accent, marginLeft: 6 }}>{categoriesToRender.length} categories</span>
                    </div>
                </div>

                <div
                    key={`${floorMotionId}-filters`}
                    className="tenant-floor-filters-motion"
                    style={{
                        position: 'relative',
                        maxWidth: 1280,
                        margin: '0 auto 34px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 12,
                        alignItems: 'center',
                        padding: '0 4px',
                    }}
                >
                    {filteredCats.map((cat) => (
                        <CategoryButton
                            key={cat.id}
                            cat={cat}
                            isSelected={selectedCategory === cat.id}
                            onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                        />
                    ))}
                </div>

                <div
                    key={`${floorMotionId}-tenant-list`}
                    className="tenant-floor-tenants-motion"
                    style={{ position: 'relative', maxWidth: 1280, margin: '36px auto 0' }}
                >
                    {displayTenants.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
                            {displayTenants.map((tenant, index) => (
                                <TenantCard key={tenant.id || index} tenant={tenant} idx={index} onClick={() => openTenantDetail(tenant)} />
                            ))}
                        </div>
                    ) : (
                        <div
                            style={{
                                textAlign: 'center',
                                padding: '60px 0',
                                color: T.inkDim,
                                fontFamily: T.sans,
                                fontSize: 16,
                                background: `${T.ink}05`,
                                borderRadius: 16,
                                border: `1px dashed ${T.ink}20`,
                            }}
                        >
                            {emptyTenantMessage}
                        </div>
                    )}
                </div>

                <div
                    style={{
                        position: 'relative',
                        maxWidth: 1280,
                        margin: '48px auto 0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: 28,
                        borderTop: `1px solid ${T.ink}15`,
                        flexWrap: 'wrap',
                        gap: 16,
                    }}
                >
                    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                        <button
                            type="button"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 10,
                                padding: '12px 22px',
                                borderRadius: 999,
                                background: T.ink,
                                color: T.paper,
                                fontFamily: T.sans,
                                fontSize: 13,
                                fontWeight: 500,
                                transition: 'transform .3s, box-shadow .3s',
                                border: 0,
                                cursor: 'pointer',
                            }}
                            onClick={() => {
                                setSelectedCategory(null);
                                setTenantSearch('');
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = `0 12px 26px ${T.shadow}60`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            Reset Filters
                        </button>
                    </div>
                </div>
            </section>

            {selectedTenant && <TenantDetailView tenant={selectedTenant} onBack={closeTenantDetail} />}
        </>
    );
}
