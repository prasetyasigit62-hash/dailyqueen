'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
    serif: 'var(--font-floor-banner-display), var(--font-mall-display), "Times New Roman", serif',
    sans: 'var(--font-mall-sans), "Inter", system-ui, sans-serif',
    mono: 'var(--font-floor-banner-mono), "JetBrains Mono", ui-monospace, monospace',
};

const FLOOR_PALETTES = {
    gf: {
        glow: 'rgba(220,165,86,0.22)',
        glowSoft: 'rgba(198,86,127,0.16)',
        panel: 'rgba(19,9,30,0.72)',
        panelStrong: 'rgba(19,9,30,0.88)',
        border: 'rgba(220,165,86,0.26)',
        borderSoft: 'rgba(255,255,255,0.08)',
        accent: '#dca556',
        accentSoft: '#f0c98a',
    },
    f1: {
        glow: 'rgba(119,163,231,0.24)',
        glowSoft: 'rgba(255,180,197,0.14)',
        panel: 'rgba(11,17,34,0.72)',
        panelStrong: 'rgba(11,17,34,0.88)',
        border: 'rgba(129,176,255,0.26)',
        borderSoft: 'rgba(255,255,255,0.08)',
        accent: '#8fb8ff',
        accentSoft: '#d7e4ff',
    },
    f2: {
        glow: 'rgba(102,195,203,0.22)',
        glowSoft: 'rgba(143,225,167,0.14)',
        panel: 'rgba(9,23,28,0.72)',
        panelStrong: 'rgba(9,23,28,0.88)',
        border: 'rgba(111,212,220,0.24)',
        borderSoft: 'rgba(255,255,255,0.08)',
        accent: '#74cfd6',
        accentSoft: '#c0eef2',
    },
    f3: {
        glow: 'rgba(225,116,94,0.24)',
        glowSoft: 'rgba(241,182,92,0.16)',
        panel: 'rgba(29,14,16,0.72)',
        panelStrong: 'rgba(29,14,16,0.88)',
        border: 'rgba(237,152,104,0.24)',
        borderSoft: 'rgba(255,255,255,0.08)',
        accent: '#f0a86d',
        accentSoft: '#ffd7b2',
    },
} as const;

const MALL_DIRECTORY_SESSION_KEY = 'queen-city:mall-directory:last-view';

type StoredMallDirectoryState = {
    activeFloor?: string | null;
    selectedTenantId?: string | number | null;
    selectedTenantName?: string | null;
    fromMaps?: boolean | null;
    updatedAt?: number;
};

export const FLOORS = [
    {
        id: 'gf',
        label: 'Ground Floor',
        titleLabel: 'Ground Floor',
        caption: 'Daily essentials & supermarket',
        cover: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1800&q=85&auto=format&fit=crop',
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
        titleLabel: 'First Floor',
        caption: 'Fashion, beauty & lifestyle',
        cover: '/gambar1.jpg',
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
        titleLabel: 'Second Floor',
        caption: 'Tech, gadget & accessories',
        cover: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1800&q=85&auto=format&fit=crop',
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
        titleLabel: 'Third Floor',
        caption: 'Food court, dining & entertainment',
        cover: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800&q=85&auto=format&fit=crop',
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

type TenantCategoryGroup = {
    id: string;
    label: string;
    tenants: TenantRecord[];
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

function splitFloorLabel(label: string) {
    const trimmedLabel = label.trim();
    const floorSuffix = ' Floor';

    if (!trimmedLabel.endsWith(floorSuffix)) {
        return {
            name: trimmedLabel,
            suffix: '',
        };
    }

    return {
        name: trimmedLabel.slice(0, -floorSuffix.length),
        suffix: 'Floor',
    };
}

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
            className="tenant-category-button"
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
                    className="mall-directory-tenant-card-info"
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
                        className="mall-directory-tenant-card-title"
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
                            className="mall-directory-tenant-card-badge"
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
                                className="mall-directory-tenant-card-mall"
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
    const tenantMap = new Map<string, TenantRecord>();

    if (!mallDirectory) {
        return [] as TenantRecord[];
    }

    Object.values(mallDirectory).forEach((mallSections) => {
        if (!Array.isArray(mallSections)) {
            return;
        }

        mallSections.forEach((mallSection) => {
            if (Array.isArray(mallSection.tenant)) {
                mallSection.tenant.forEach((tenant) => {
                    const tenantKey = tenant.id ? String(tenant.id) : `${tenant.nama}-${tenant.lantai?.nama || ''}`;
                    tenantMap.set(tenantKey, tenant);
                });
            }
        });
    });

    return Array.from(tenantMap.values());
}

function normalizeCategoryToken(token: string) {
    if (token.endsWith('ies') && token.length > 4) {
        return `${token.slice(0, -3)}y`;
    }

    if (token.endsWith('es') && token.length > 4) {
        return token.slice(0, -2);
    }

    if (token.endsWith('s') && token.length > 3 && !token.endsWith('ss')) {
        return token.slice(0, -1);
    }

    return token;
}

function normalizeCategoryLabel(value?: string) {
    return (value || '')
        .toLowerCase()
        .replace(/&/g, ' and ')
        .replace(/[^a-z0-9]+/g, ' ')
        .split(' ')
        .map((token) => normalizeCategoryToken(token.trim()))
        .filter(Boolean);
}

function areCategoryLabelsRelated(left?: string, right?: string) {
    const leftTokens = normalizeCategoryLabel(left);
    const rightTokens = normalizeCategoryLabel(right);

    if (leftTokens.length === 0 || rightTokens.length === 0) {
        return false;
    }

    const leftValue = leftTokens.join(' ');
    const rightValue = rightTokens.join(' ');

    if (leftValue === rightValue || leftValue.includes(rightValue) || rightValue.includes(leftValue)) {
        return true;
    }

    const leftSet = new Set(leftTokens);
    const rightSet = new Set(rightTokens);
    const smallerSet = leftSet.size <= rightSet.size ? leftSet : rightSet;
    const largerSet = leftSet.size <= rightSet.size ? rightSet : leftSet;
    const overlapCount = Array.from(smallerSet).filter((token) => largerSet.has(token)).length;

    return overlapCount > 0 && overlapCount >= Math.max(1, Math.ceil(smallerSet.size * 0.75));
}

function getFloorSections(mallDirectory: mallDirectoryInterface | undefined, currentFloorAliases: string[]) {
    if (!mallDirectory) {
        return [] as Floor[];
    }

    const floorKey = Object.keys(mallDirectory).find((key) => {
        const value = key.toLowerCase();
        return currentFloorAliases.some((alias) => value.includes(alias));
    });

    if (!floorKey || !Array.isArray(mallDirectory[floorKey])) {
        return [] as Floor[];
    }

    return mallDirectory[floorKey];
}

function groupTenantsByCategory(tenants: TenantRecord[]) {
    const groupedCategories = new Map<string, TenantCategoryGroup>();

    tenants.forEach((tenant) => {
        const categoryLabel = tenant.kategori?.nama?.trim() || 'Other';
        const categoryId = tenant.kategori?.id
            ? `kategori-${tenant.kategori.id}`
            : `kategori-${normalizeCategoryLabel(categoryLabel).join('-') || 'other'}`;
        const existingGroup = groupedCategories.get(categoryId);

        if (existingGroup) {
            existingGroup.tenants.push(tenant);
            return;
        }

        groupedCategories.set(categoryId, {
            id: categoryId,
            label: categoryLabel,
            tenants: [tenant],
        });
    });

    return Array.from(groupedCategories.values());
}

function buildDynamicCategories(floorTenants: TenantRecord[], floorSections: Floor[]) {
    const defaultAccents = ['#b08446', '#a85a4a', '#7a4a8a', '#4a6b8a', '#5a8a6b'];
    const tenantCategoryGroups = groupTenantsByCategory(floorTenants);
    const usedGroupIds = new Set<string>();

    if (tenantCategoryGroups.length === 0) {
        return [] as DynamicCategory[];
    }

    const orderedCategories = floorSections
        .map((section, index) => {
            const matchedGroup = tenantCategoryGroups.find(
                (group) => !usedGroupIds.has(group.id) && areCategoryLabelsRelated(section.nama, group.label)
            );

            if (!matchedGroup) {
                return null;
            }

            usedGroupIds.add(matchedGroup.id);

            return {
                id: matchedGroup.id,
                label: section.nama || matchedGroup.label,
                count: matchedGroup.tenants.length,
                accent: defaultAccents[index % defaultAccents.length],
                originalTenants: matchedGroup.tenants,
            } satisfies DynamicCategory;
        })
        .filter(Boolean) as DynamicCategory[];

    const remainingCategories = tenantCategoryGroups
        .filter((group) => !usedGroupIds.has(group.id))
        .map((group, index) => ({
            id: group.id,
            label: group.label,
            count: group.tenants.length,
            accent: defaultAccents[(orderedCategories.length + index) % defaultAccents.length],
            originalTenants: group.tenants,
        }));

    return [...orderedCategories, ...remainingCategories];
}

type FloorSwitcherProps = {
    active: string;
    onChange: React.Dispatch<string>;
};

function FloorSwitcher({ active, onChange }: FloorSwitcherProps) {
    const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
    const pillRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const updatePill = useCallback(() => {
        const activeIdx = FLOORS.findIndex((f) => f.id === active);
        const activeTab = tabsRef.current[activeIdx];
        const container = containerRef.current;
        const pill = pillRef.current;
        if (!activeTab || !container || !pill) return;
        const tabRect = activeTab.getBoundingClientRect();
        const contRect = container.getBoundingClientRect();
        pill.style.left = `${tabRect.left - contRect.left - 6}px`;
        pill.style.width = `${tabRect.width}px`;
    }, [active]);

    useEffect(() => {
        const frame = requestAnimationFrame(updatePill);
        return () => cancelAnimationFrame(frame);
    }, [updatePill]);

    useEffect(() => {
        window.addEventListener('resize', updatePill);
        return () => window.removeEventListener('resize', updatePill);
    }, [updatePill]);

    const activeIdx = FLOORS.findIndex((f) => f.id === active);
    const prevFloorId = FLOORS[(activeIdx - 1 + FLOORS.length) % FLOORS.length]?.id;
    const nextFloorId = FLOORS[(activeIdx + 1) % FLOORS.length]?.id;

    return (
        <div ref={containerRef} className="floor-banner-tabs">
            <button type="button" onClick={() => onChange(prevFloorId)} aria-label="Previous floor" className="floor-banner-nav-arr">
                ←
            </button>

            <div
                ref={pillRef}
                aria-hidden="true"
                className="floor-banner-tab-pill"
                style={{
                    transition: 'left 0.5s cubic-bezier(0.7,0,0.2,1), width 0.5s cubic-bezier(0.7,0,0.2,1)',
                }}
            />

            {FLOORS.map((floorItem, idx) => (
                <button
                    key={floorItem.id}
                    ref={(el) => {
                        tabsRef.current[idx] = el;
                    }}
                    type="button"
                    onClick={() => onChange(floorItem.id)}
                    className={`floor-banner-tab${active === floorItem.id ? ' is-active' : ''}`}
                >
                    {floorItem.label}
                </button>
            ))}

            <button type="button" onClick={() => onChange(nextFloorId)} aria-label="Next floor" className="floor-banner-nav-arr">
                →
            </button>
        </div>
    );
}

export default function TenantView({ initialFloor, onClose, mallDirectory, initialSearch }: TenantViewProps) {
    const tenantPageSize = 8;
    const bannerHeight = 'clamp(340px, 44vw, 580px)';
    const [active, setActive] = useState(initialFloor || 'gf');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedTenant, setSelectedTenant] = useState<TenantRecord | null>(null);
    const [tenantSearch, setTenantSearch] = useState(initialSearch);
    const [ajaxSearchResults, setAjaxSearchResults] = useState<TenantRecord[]>([]);
    const [isAjaxSearching, setIsAjaxSearching] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [hasRestoredTenant, setHasRestoredTenant] = useState(false);
    const [floorMotionKey, setFloorMotionKey] = useState(0);
    const [tenantPage, setTenantPage] = useState(0);
    const [previousFloorCover, setPreviousFloorCover] = useState<FloorMeta | null>(null);
    const [isSweeping, setIsSweeping] = useState(false);
    const [animatedTenantCount, setAnimatedTenantCount] = useState(0);
    const [animatedCategoryCount, setAnimatedCategoryCount] = useState(0);
    const bannerRef = useRef<HTMLDivElement | null>(null);
    const floorCoverTimeoutRef = useRef<number | null>(null);
    const sweepTimeoutRef = useRef<number | null>(null);
    const touchStartXRef = useRef(0);
    const animatedCountsRef = useRef({ tenants: 0, categories: 0 });
    const floor = FLOORS.find((item) => item.id === active) || FLOORS[0];
    const floorPalette = FLOOR_PALETTES[active as keyof typeof FLOOR_PALETTES] || FLOOR_PALETTES.gf;
    const floorMotionId = `${floor.id}-${floorMotionKey}`;
    const normalizedTenantSearch = tenantSearch.trim().toLowerCase();
    const isSearchActive = normalizedTenantSearch.length > 0;

    const handleFloorChange = useCallback(
        (floorId: string) => {
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

            // trigger light sweep
            if (sweepTimeoutRef.current) window.clearTimeout(sweepTimeoutRef.current);
            setIsSweeping(false);
            sweepTimeoutRef.current = window.setTimeout(() => {
                setIsSweeping(true);
                sweepTimeoutRef.current = window.setTimeout(() => setIsSweeping(false), 1500);
            }, 20);

            setActive(floorId);
            setSelectedCategory(null);
            setTenantSearch('');
            setSelectedTenant(null);
            setFloorMotionKey((currentKey) => currentKey + 1);
            updateStoredMallDirectoryState({ activeFloor: floorId, selectedTenantId: null, selectedTenantName: null });
        },
        [active, floor]
    );

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
            if (sweepTimeoutRef.current) {
                window.clearTimeout(sweepTimeoutRef.current);
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
    const floorSections = getFloorSections(mallDirectory, currentFloorAliases);
    const dynamicCats = buildDynamicCategories(filteredFloorTenants, floorSections);
    const fallbackCats: DynamicCategory[] = (floor.cats as readonly FloorMeta['cats'][number][]).map((cat) => ({
        id: cat.id,
        label: cat.label,
        count: cat.count,
        accent: cat.accent,
        originalTenants: [],
    }));
    const categoriesToRender = dynamicCats.length > 0 ? dynamicCats : fallbackCats;
    const filteredCats = isSearchActive ? [] : categoriesToRender;
    const selectedCategoryRecord = selectedCategory ? categoriesToRender.find((cat) => cat.id === selectedCategory) || null : null;
    const selectedCategoryTenants = selectedCategoryRecord?.originalTenants || null;
    let displayTenants = filteredFloorTenants;

    if (isSearchActive) {
        displayTenants = ajaxSearchResults;
    } else if (selectedCategoryTenants) {
        displayTenants = selectedCategoryTenants;
    }

    const totalTenantPages = Math.max(1, Math.ceil(displayTenants.length / tenantPageSize));
    const safeTenantPage = Math.min(tenantPage, totalTenantPages - 1);
    const pagedTenants = displayTenants.slice(safeTenantPage * tenantPageSize, safeTenantPage * tenantPageSize + tenantPageSize);
    const activeFloorIndex = Math.max(
        0,
        FLOORS.findIndex((floorItem) => floorItem.id === active)
    );
    const { name: floorTitleMain, suffix: floorTitleSuffix } = splitFloorLabel((floor as (typeof FLOORS)[0]).titleLabel || floor.label);

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
        setTenantPage(0);
    }, [active, selectedCategory, normalizedTenantSearch]);

    useEffect(() => {
        if (tenantPage > totalTenantPages - 1) {
            setTenantPage(Math.max(0, totalTenantPages - 1));
        }
    }, [tenantPage, totalTenantPages]);

    useEffect(() => {
        const nextTenantCount = displayTenants.length;
        const nextCategoryCount = categoriesToRender.length;
        const fromTenantCount = animatedCountsRef.current.tenants;
        const fromCategoryCount = animatedCountsRef.current.categories;

        if (fromTenantCount === nextTenantCount && fromCategoryCount === nextCategoryCount) {
            setAnimatedTenantCount(nextTenantCount);
            setAnimatedCategoryCount(nextCategoryCount);
            return undefined;
        }

        const animationStart = window.performance.now();
        const animationDuration = 700;
        let frameId = 0;

        const step = (timestamp: number) => {
            const progress = Math.min((timestamp - animationStart) / animationDuration, 1);
            const eased = 1 - (1 - progress) ** 3;

            setAnimatedTenantCount(Math.round(fromTenantCount + (nextTenantCount - fromTenantCount) * eased));
            setAnimatedCategoryCount(Math.round(fromCategoryCount + (nextCategoryCount - fromCategoryCount) * eased));

            if (progress < 1) {
                frameId = window.requestAnimationFrame(step);
                return;
            }

            animatedCountsRef.current = {
                tenants: nextTenantCount,
                categories: nextCategoryCount,
            };
        };

        frameId = window.requestAnimationFrame(step);

        return () => {
            if (frameId) {
                window.cancelAnimationFrame(frameId);
            }
        };
    }, [categoriesToRender.length, displayTenants.length]);

    useEffect(() => {
        const sweepStartTimeout = window.setTimeout(() => {
            setIsSweeping(true);
            sweepTimeoutRef.current = window.setTimeout(() => {
                setIsSweeping(false);
                sweepTimeoutRef.current = null;
            }, 1400);
        }, 300);

        return () => {
            window.clearTimeout(sweepStartTimeout);
        };
    }, []);

    useEffect(() => {
        const handleKeyNavigation = (event: KeyboardEvent) => {
            if (selectedTenant) {
                return;
            }

            if (event.key === 'ArrowLeft') {
                handleFloorChange(FLOORS[(activeFloorIndex - 1 + FLOORS.length) % FLOORS.length].id);
            }

            if (event.key === 'ArrowRight') {
                handleFloorChange(FLOORS[(activeFloorIndex + 1) % FLOORS.length].id);
            }
        };

        window.addEventListener('keydown', handleKeyNavigation);
        return () => window.removeEventListener('keydown', handleKeyNavigation);
    }, [activeFloorIndex, handleFloorChange, selectedTenant]);

    useEffect(() => {
        const bannerElement = bannerRef.current;

        if (!bannerElement) {
            return undefined;
        }

        const handleTouchStart = (event: TouchEvent) => {
            touchStartXRef.current = event.touches[0]?.clientX || 0;
        };

        const handleTouchEnd = (event: TouchEvent) => {
            const touchEndX = event.changedTouches[0]?.clientX || 0;
            const swipeDistance = touchStartXRef.current - touchEndX;

            if (Math.abs(swipeDistance) <= 50) {
                return;
            }

            if (swipeDistance > 0) {
                handleFloorChange(FLOORS[(activeFloorIndex + 1) % FLOORS.length].id);
                return;
            }

            handleFloorChange(FLOORS[(activeFloorIndex - 1 + FLOORS.length) % FLOORS.length].id);
        };

        bannerElement.addEventListener('touchstart', handleTouchStart, { passive: true });
        bannerElement.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            bannerElement.removeEventListener('touchstart', handleTouchStart);
            bannerElement.removeEventListener('touchend', handleTouchEnd);
        };
    }, [activeFloorIndex, handleFloorChange]);

    useEffect(() => {
        if (hasRestoredTenant) {
            return;
        }

        const storedState = readStoredMallDirectoryState();
        const cameFromMaps = Boolean(storedState?.fromMaps);

        if (!isReloadNavigation() && !cameFromMaps) {
            setHasRestoredTenant(true);
            return;
        }

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
            if (cameFromMaps) {
                updateStoredMallDirectoryState({ fromMaps: null });
            }
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
                style={{
                    position: 'relative',
                    paddingBottom: '96px',
                    background: T.paper,
                    backgroundImage: `radial-gradient(circle at 20% 0%, ${T.accent}06 0%, transparent 50%),
          radial-gradient(circle at 80% 100%, ${T.navy}08 0%, transparent 50%)`,
                    overflow: 'hidden',
                    minHeight: '100vh',
                }}
            >
                <style jsx global>{`
                    .floor-banner-shell {
                        position: relative;
                        width: 100%;
                        height: clamp(340px, 44vw, 580px);
                        overflow: hidden;
                        background: #0a0516;
                    }

                    .floor-banner-bg-overlay {
                        position: absolute;
                        inset: 0;
                        z-index: 1;
                        background: linear-gradient(90deg, rgba(10, 5, 22, 0.88) 0%, rgba(10, 5, 22, 0.35) 45%, rgba(10, 5, 22, 0.55) 100%),
                            linear-gradient(0deg, rgba(10, 5, 22, 0.7) 0%, transparent 50%);
                        pointer-events: none;
                    }

                    .floor-banner-topbar {
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        z-index: 20;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        gap: 16px;
                        padding: clamp(16px, 2vw, 20px) clamp(20px, 4vw, 48px) 18px;
                        background: linear-gradient(180deg, rgba(10, 5, 22, 0.7) 0%, transparent 100%);
                    }

                    .floor-banner-tabs {
                        position: absolute;
                        left: 50%;
                        transform: translateX(-50%);
                        display: flex;
                        align-items: center;
                        gap: 2px;
                        padding: 4px 6px;
                        border-radius: 999px;
                        background: rgba(255, 255, 255, 0.07);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        backdrop-filter: blur(16px);
                        -webkit-backdrop-filter: blur(16px);
                        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
                    }

                    .floor-banner-nav-arr {
                        position: relative;
                        z-index: 1;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        width: 28px;
                        height: 28px;
                        padding: 0;
                        font-size: 0;
                        color: rgba(255, 255, 255, 0.5);
                        border-radius: 999px;
                        white-space: nowrap;
                        transition: color 0.3s, background 0.3s;
                    }

                    .floor-banner-nav-arr::before {
                        content: '←';
                        font-size: 14px;
                        line-height: 1;
                    }

                    .floor-banner-tabs > .floor-banner-nav-arr:last-child::before {
                        content: '→';
                    }

                    .floor-banner-nav-arr:hover {
                        color: rgba(255, 255, 255, 0.9);
                        background: rgba(255, 255, 255, 0.1);
                    }

                    .floor-banner-nav-arr svg {
                        width: 16px;
                        height: 16px;
                    }

                    .floor-banner-tab-pill {
                        position: absolute;
                        top: 3px;
                        z-index: 0;
                        height: calc(100% - 6px);
                        border-radius: 999px;
                        background: linear-gradient(135deg, #e8b864, #c99248);
                        box-shadow: 0 4px 18px rgba(232, 184, 100, 0.45);
                        pointer-events: none;
                    }

                    .floor-banner-tab {
                        position: relative;
                        z-index: 1;
                        padding: 8px 18px;
                        border-radius: 999px;
                        font-family: ${T.sans};
                        font-size: 12px;
                        font-weight: 600;
                        letter-spacing: 0.02em;
                        color: rgba(255, 255, 255, 0.6);
                        white-space: nowrap;
                        transition: color 0.35s ease;
                    }

                    .floor-banner-tab::after {
                        content: '';
                        position: absolute;
                        bottom: 3px;
                        left: 18px;
                        right: 18px;
                        height: 2px;
                        border-radius: 999px;
                        background: linear-gradient(
                            90deg,
                            rgba(255, 255, 255, 0) 0%,
                            rgba(255, 255, 255, 0.22) 12%,
                            rgba(255, 255, 255, 0.9) 50%,
                            rgba(255, 255, 255, 0.22) 88%,
                            rgba(255, 255, 255, 0) 100%
                        );
                        opacity: 0;
                        transform: scaleX(0.4);
                        transform-origin: center;
                        transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
                    }

                    .floor-banner-tab:hover::after {
                        opacity: 1;
                        transform: scaleX(1);
                    }

                    .floor-banner-tab:hover {
                        color: rgba(255, 255, 255, 0.9);
                    }

                    .floor-banner-tab.is-active {
                        color: #0a0516;
                    }

                    .floor-banner-tab.is-active::after {
                        opacity: 0;
                    }

                    .floor-banner-search {
                        position: relative;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        padding: 6px 2px 8px;
                        cursor: text;
                    }

                    .floor-banner-bottom-block {
                        position: absolute;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        z-index: 10;
                        padding: 0 clamp(20px, 4vw, 48px) 40px;
                    }

                    .floor-banner-bottom-inner {
                        max-width: 1280px;
                        margin: 0 auto;
                        display: flex;
                        align-items: flex-end;
                        justify-content: space-between;
                        gap: 24px;
                    }

                    .floor-banner-headline {
                        max-width: 640px;
                        overflow: visible;
                    }

                    .floor-banner-kicker {
                        display: inline-flex;
                        align-items: center;
                        gap: 10px;
                        margin-bottom: 14px;
                        font-family: ${T.mono};
                        font-size: 10px;
                        font-weight: 500;
                        letter-spacing: 0.28em;
                        color: rgba(232, 184, 100, 0.8);
                        text-transform: uppercase;
                    }

                    .floor-banner-title-wrap {
                        margin-bottom: 14px;
                        padding-top: 16px;
                        overflow: visible;
                        padding-right: 0.18em;
                    }

                    .floor-banner-sub {
                        font-size: 15px;
                        color: rgba(255, 255, 255, 0.55);
                        font-weight: 400;
                        letter-spacing: 0.01em;
                    }

                    .floor-banner-stats {
                        display: flex;
                        align-items: center;
                        gap: 24px;
                    }

                    .floor-banner-stat-line {
                        display: inline-flex;
                        align-items: center;
                        gap: 8px;
                        font-family: ${T.mono};
                        font-size: 11px;
                        font-weight: 500;
                        letter-spacing: 0.24em;
                        text-transform: uppercase;
                    }

                    .floor-banner-stat-num {
                        color: #e8b864;
                        font-weight: 700;
                    }

                    .floor-banner-stat-sep {
                        color: rgba(255, 255, 255, 0.25);
                    }

                    .floor-banner-stat-label {
                        color: rgba(255, 255, 255, 0.55);
                    }

                    .floor-banner-stat-divider {
                        width: 1px;
                        height: 20px;
                        background: rgba(255, 255, 255, 0.18);
                    }

                    .floor-banner-progress {
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        z-index: 15;
                        height: 2px;
                        background: rgba(255, 255, 255, 0.08);
                        overflow: hidden;
                    }

                    .tenant-floor-search::placeholder {
                        color: rgba(255, 255, 255, 0.85);
                        font-style: italic;
                        opacity: 1;
                    }

                    .tenant-floor-cover-motion {
                        animation:
                            tenantFloorCoverIn 2100ms cubic-bezier(0.16, 1, 0.3, 1) both,
                            bgBreathe 8s 2100ms ease-in-out infinite;
                        transform-origin: center center;
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

                    .tenant-active-floor-label {
                        animation: tenantActiveFloorIn 1.15s cubic-bezier(0.16, 1, 0.3, 1) both;
                    }

                    @keyframes tenantActiveFloorIn {
                        from {
                            opacity: 0;
                            transform: translateY(10px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    @keyframes tenantFloorCoverIn {
                        from {
                            opacity: 0.28;
                            filter: saturate(0.86) contrast(1) blur(8px);
                            transform: scale(1.07);
                        }
                        to {
                            opacity: 1;
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

                    @keyframes bgBreathe {
                        0%,
                        100% {
                            transform: scale(1);
                        }
                        50% {
                            transform: scale(1.04);
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

                    /* Gold shimmer for floor title */
                    @keyframes goldShimmer {
                        0%,
                        100% {
                            background-position: 0% 50%;
                        }
                        50% {
                            background-position: 100% 50%;
                        }
                    }
                    .floor-title-gold {
                        background: linear-gradient(90deg, #e8b864, #ffd998, #e8b864);
                        background-size: 200% 100%;
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                        animation: goldShimmer 4s ease-in-out infinite;
                    }

                    /* Light sweep on floor change */
                    @keyframes lightSweep {
                        0% {
                            left: -40%;
                            opacity: 0;
                        }
                        10% {
                            opacity: 1;
                        }
                        90% {
                            opacity: 0.7;
                        }
                        100% {
                            left: 140%;
                            opacity: 0;
                        }
                    }
                    .floor-light-sweep::before {
                        content: '';
                        position: absolute;
                        top: -20%;
                        left: -40%;
                        width: 35%;
                        height: 150%;
                        background: linear-gradient(
                            100deg,
                            transparent 0%,
                            rgba(255, 245, 210, 0) 25%,
                            rgba(255, 245, 210, 0.35) 50%,
                            rgba(255, 240, 200, 0) 75%,
                            transparent 100%
                        );
                        filter: blur(8px);
                        transform: skewX(-22deg);
                        animation: lightSweep 1.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                        mix-blend-mode: screen;
                        pointer-events: none;
                    }

                    /* Animated dot on active floor */
                    @keyframes activeDotPulse {
                        0%,
                        100% {
                            transform: scale(1);
                            box-shadow: 0 0 12px #e84545;
                        }
                        50% {
                            transform: scale(0.8);
                            box-shadow: 0 0 4px #e84545;
                        }
                    }
                    .active-floor-dot {
                        display: inline-block;
                        width: 13px;
                        height: 13px;
                        border-radius: 50%;
                        background: #e84545;
                        box-shadow: 0 0 16px #e84545, 0 0 6px rgba(232, 69, 69, 0.6);
                        animation: activeDotPulse 2s ease-in-out infinite;
                        flex-shrink: 0;
                    }

                    /* Progress bar fill transition */
                    .floor-progress-fill {
                        transition: width 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
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

                    @media (max-width: 768px) {
                        .floor-banner-shell {
                            height: clamp(420px, 80vw, 560px);
                        }

                        .floor-banner-topbar {
                            flex-wrap: wrap;
                            gap: 10px 12px;
                            padding: 14px 16px 14px;
                            background: linear-gradient(180deg, rgba(10, 5, 22, 0.78) 0%, rgba(10, 5, 22, 0.15) 100%);
                        }

                        /* Row 1: back+label (left) + search (right) */
                        .floor-banner-topbar > div:first-child {
                            order: 1;
                            flex: 1 1 auto;
                            min-width: 0;
                            gap: 12px !important;
                        }
                        .floor-banner-topbar > div:first-child button[aria-label="Back"] {
                            width: 36px !important;
                            height: 36px !important;
                        }
                        .tenant-active-floor-label {
                            font-size: 14px !important;
                        }

                        .floor-banner-search {
                            order: 2;
                            width: auto;
                            margin-left: auto;
                            padding: 4px 0 6px;
                        }
                        .floor-banner-search .tenant-floor-search {
                            font-size: 13px !important;
                            width: 90px !important;
                        }
                        .floor-banner-search .tenant-floor-search:focus {
                            width: 130px !important;
                        }

                        /* Row 2: compact centered floor pills */
                        .floor-banner-tabs {
                            position: static;
                            transform: none;
                            order: 3;
                            width: auto;
                            max-width: 100%;
                            margin: 0 auto;
                            justify-content: center;
                            padding: 3px 4px;
                            gap: 0;
                        }
                        .floor-banner-tab {
                            flex: 0 0 auto;
                            padding: 6px 12px;
                            font-size: 10.5px;
                            letter-spacing: 0.015em;
                            text-align: center;
                        }
                        .floor-banner-nav-arr {
                            display: none;
                        }

                        .floor-banner-bottom-block {
                            padding: 0 20px 28px;
                        }

                        .floor-banner-bottom-inner {
                            flex-direction: column;
                            align-items: flex-start;
                            gap: 14px;
                        }

                        .floor-banner-stats {
                            gap: 18px;
                        }
                    }

                    @media (max-width: 380px) {
                        .floor-banner-topbar {
                            padding: 12px 14px 12px;
                        }
                        .tenant-active-floor-label {
                            font-size: 13px !important;
                        }
                        .floor-banner-tab {
                            padding: 5px 9px;
                            font-size: 9.5px;
                            letter-spacing: 0.01em;
                        }
                        .floor-banner-tabs {
                            padding: 2px 3px;
                        }
                        .floor-banner-search .tenant-floor-search {
                            font-size: 12px !important;
                            width: 72px !important;
                        }
                        .floor-banner-search .tenant-floor-search:focus {
                            width: 110px !important;
                        }
                    }

                    /* Mobile category chips — horizontal scroll, compact padding */
                    @media (max-width: 768px) {
                        .tenant-floor-filters-motion {
                            margin: 12px auto 14px !important;
                            padding: 8px 14px 10px !important;
                            flex-wrap: nowrap !important;
                            overflow-x: auto;
                            overflow-y: visible;
                            scroll-snap-type: x mandatory;
                            -webkit-overflow-scrolling: touch;
                            scrollbar-width: none;
                            gap: 7px !important;
                        }
                        .tenant-floor-filters-motion::-webkit-scrollbar {
                            display: none;
                        }
                        .tenant-floor-filters-motion > * {
                            flex: 0 0 auto;
                            scroll-snap-align: start;
                        }
                        /* Kill the lift/scale animation that overflows the container on mobile */
                        .tenant-category-button {
                            transform: none !important;
                        }

                        /* Mobile tenant grid — 2 columns, tighter gap, smaller padding */
                        .tenant-floor-tenants-motion {
                            margin: 18px auto 0 !important;
                            padding: 0 14px 48px !important;
                        }
                        .tenant-floor-tenants-motion > .grid {
                            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                            gap: 12px !important;
                        }
                        /* Force all cards to square aspect on mobile (override bento 2/1) */
                        .tenant-floor-tenants-motion .mall-directory-tenant-card-shell {
                            aspect-ratio: 1 / 1 !important;
                            grid-column: span 1 !important;
                        }
                        /* Compact card content for mobile */
                        .mall-directory-tenant-card-info {
                            padding: 14px !important;
                            gap: 5px !important;
                        }
                        .mall-directory-tenant-card-title {
                            font-size: 14.5px !important;
                            white-space: normal !important;
                            display: -webkit-box !important;
                            -webkit-line-clamp: 2 !important;
                            -webkit-box-orient: vertical !important;
                            overflow: hidden !important;
                            line-height: 1.2 !important;
                        }
                        .mall-directory-tenant-card-badge {
                            font-size: 8.5px !important;
                            padding: 3px 7px !important;
                            letter-spacing: 0.08em !important;
                        }
                        .mall-directory-tenant-card-mall {
                            font-size: 10px !important;
                        }
                    }

                    @media (max-width: 768px) {
                        .tenant-category-button {
                            font-size: 10.5px !important;
                            padding: 5px 9px 5px 8px !important;
                            gap: 6px !important;
                            letter-spacing: 0 !important;
                        }
                        /* Indicator dot — second child after the sheen overlay (nth-child 2) */
                        .tenant-category-button > span:nth-child(2) {
                            width: 6px !important;
                            height: 6px !important;
                            box-shadow: none !important;
                        }
                        .tenant-category-button > span:last-child {
                            min-width: 18px !important;
                            font-size: 9px !important;
                            padding: 2px 5px !important;
                        }
                    }

                    @media (max-width: 380px) {
                        .tenant-floor-tenants-motion > .grid {
                            grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
                        }
                    }
                `}</style>

                {/* ── BACKGROUND SLIDES ── */}
                <div ref={bannerRef} className="floor-banner-shell">
                    {FLOORS.map((floorItem) => {
                        const isActive = floorItem.id === active;
                        const isExiting = previousFloorCover?.id === floorItem.id;
                        let motionClass = '';
                        if (isActive) motionClass = 'tenant-floor-cover-motion';
                        else if (isExiting) motionClass = 'tenant-floor-cover-motion-out';
                        let slideOpacity = 0;
                        if (isActive) slideOpacity = 1;
                        else if (isExiting) slideOpacity = 0.86;
                        return (
                            <div
                                key={floorItem.id}
                                aria-hidden="true"
                                className={motionClass}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: bannerHeight,
                                    backgroundImage: `url(${floorItem.cover})`,
                                    backgroundPosition: 'center',
                                    backgroundSize: 'cover',
                                    opacity: slideOpacity,
                                    filter: isActive ? 'saturate(1.04) contrast(1.02) brightness(1)' : undefined,
                                    transition: !isActive && !isExiting ? 'opacity 0.4s' : undefined,
                                    pointerEvents: 'none',
                                }}
                            />
                        );
                    })}

                    {/* ── COLOR TINT per floor ── */}
                    <div aria-hidden="true" className="floor-banner-bg-overlay" />

                    <div
                        aria-hidden="true"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: bannerHeight,
                            background: `radial-gradient(ellipse at 30% 50%, ${floorPalette.glow}, transparent 55%)`,
                            opacity: 0.25,
                            transition: 'background 1.2s ease',
                            pointerEvents: 'none',
                        }}
                    />

                    {/* ── LIGHT SWEEP ── */}
                    {isSweeping && (
                        <div
                            key={floorMotionId}
                            aria-hidden="true"
                            className="floor-light-sweep"
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: bannerHeight,
                                overflow: 'hidden',
                                zIndex: 8,
                                pointerEvents: 'none',
                            }}
                        />
                    )}

                    {/* ── TOP BAR ── */}
                    <div className="floor-banner-topbar">
                        {/* Left: back button + active floor */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Back"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    background: 'rgba(255,255,255,0.08)',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                    backdropFilter: 'blur(14px)',
                                    color: 'rgba(255,255,255,0.9)',
                                    cursor: 'pointer',
                                    flexShrink: 0,
                                    transition: 'background 0.3s, border-color 0.3s, transform 0.3s, box-shadow 0.3s',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(232,184,100,0.25)';
                                    e.currentTarget.style.borderColor = 'rgba(232,184,100,0.6)';
                                    e.currentTarget.style.transform = 'translateX(-2px)';
                                    e.currentTarget.style.boxShadow = '0 0 18px rgba(232,184,100,0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                                    e.currentTarget.style.transform = 'translateX(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.4"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M19 12H5M12 5l-7 7 7 7" />
                                </svg>
                            </button>
                            <div style={{ position: 'relative' }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                                    <span className="active-floor-dot" />
                                    <span
                                        key={floor.id}
                                        className="tenant-active-floor-label"
                                        style={{ fontFamily: T.sans, fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: '0.02em' }}
                                    >
                                        {floor.label}
                                    </span>
                                </div>
                                <svg
                                    aria-hidden="true"
                                    viewBox="0 0 160 6"
                                    preserveAspectRatio="none"
                                    style={{ position: 'absolute', top: '100%', left: -6, marginTop: 3, height: 6, width: 160, overflow: 'visible', pointerEvents: 'none' }}
                                >
                                    <defs>
                                        <linearGradient id="floorLabelUnderline" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0" stopColor="rgba(255,255,255,0)" />
                                            <stop offset="0.12" stopColor="rgba(255,255,255,0.22)" />
                                            <stop offset="0.5" stopColor="rgba(255,255,255,0.95)" />
                                            <stop offset="0.86" stopColor="rgba(255,255,255,0.24)" />
                                            <stop offset="1" stopColor="rgba(255,255,255,0)" />
                                        </linearGradient>
                                    </defs>
                                    <path
                                        d="M0 4.4 C42 2.7 118 2.7 160 4.4"
                                        fill="none"
                                        stroke="url(#floorLabelUnderline)"
                                        strokeLinecap="round"
                                        strokeWidth="2.15"
                                        vectorEffect="non-scaling-stroke"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Center: sliding pill tabs */}
                        <FloorSwitcher active={active} onChange={handleFloorChange} />

                        {/* Right: search */}
                        <div className="floor-banner-search">
                            {/* underline base */}
                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    width: '100%',
                                    height: 2,
                                    background: 'rgba(255,255,255,0.9)',
                                    transition: 'background 0.4s',
                                }}
                            />
                            {/* gold focus line */}
                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    zIndex: 1,
                                    height: 1.5,
                                    background: 'linear-gradient(90deg, #E8B864, #FFD998)',
                                    boxShadow: '0 0 8px rgba(232,184,100,0.5)',
                                    width: isSearchFocused || tenantSearch ? '100%' : '0%',
                                    transition: 'width 0.55s cubic-bezier(0.2,0.8,0.2,1)',
                                }}
                            />
                            <svg
                                aria-hidden="true"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="rgba(255,255,255,0.95)"
                                strokeWidth="2.2"
                                style={{ flexShrink: 0, opacity: 1 }}
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
                                    color: '#fff',
                                    fontFamily: T.serif,
                                    fontSize: 14,
                                    fontWeight: 400,
                                    fontStyle: 'italic',
                                    letterSpacing: '0.03em',
                                    width: isSearchFocused || tenantSearch ? 180 : 110,
                                    transition: 'width 0.45s cubic-bezier(0.2,0.8,0.2,1)',
                                }}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                            />
                        </div>
                    </div>

                    {/* ── BOTTOM CONTENT BLOCK (floor title + stats) ── */}
                    <div
                        key={`${floorMotionId}-cap`}
                        className="tenant-floor-content-motion floor-banner-bottom-block"
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 10,
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'space-between',
                            gap: 24,
                            flexWrap: 'wrap',
                            padding: '0 clamp(20px, 4vw, 48px) 40px',
                        }}
                    >
                        {/* Floor headline */}
                        <div className="floor-banner-headline" style={{ maxWidth: 640, overflow: 'visible' }}>
                            <div className="floor-banner-kicker">
                                <span style={{ width: 20, height: 1, background: '#E8B864', flexShrink: 0 }} />
                                <span>{`Section 0${FLOORS.findIndex((f) => f.id === active) + 1} · ${floor.caption.toUpperCase()}`}</span>
                            </div>
                            <div className="floor-banner-title-wrap" style={{ marginBottom: 12, paddingTop: 8 }}>
                                <h2
                                    style={{
                                        display: 'flex',
                                        alignItems: 'baseline',
                                        gap: 14,
                                        fontFamily: T.serif,
                                        fontSize: 'clamp(44px, 5.8vw, 78px)',
                                        fontWeight: 300,
                                        lineHeight: 1.18,
                                        letterSpacing: 0,
                                        color: '#fff',
                                        margin: 0,
                                        overflow: 'visible',
                                    }}
                                >
                                    <em
                                        className="floor-title-gold"
                                        style={{ display: 'inline-block', fontStyle: 'italic', fontWeight: 300, paddingRight: '0.08em' }}
                                    >
                                        {floorTitleMain}
                                    </em>
                                    {floorTitleSuffix ? (
                                        <span
                                            style={{
                                                fontFamily: T.serif,
                                                fontSize: 'clamp(24px, 3.1vw, 42px)',
                                                fontWeight: 300,
                                                fontStyle: 'italic',
                                                color: 'rgba(255,255,255,0.75)',
                                                letterSpacing: 0,
                                            }}
                                        >{` ${floorTitleSuffix}`}</span>
                                    ) : null}
                                </h2>
                            </div>
                            <div
                                className="floor-banner-sub"
                                style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', fontWeight: 400, letterSpacing: '0.01em' }}
                            >
                                {floor.caption}
                            </div>
                        </div>

                        {/* Stats — right-aligned, with | separator, matching reference */}
                        <div className="floor-banner-stats" style={{ marginBottom: 4 }}>
                            <div className="floor-banner-stat-line">
                                <span className="floor-banner-stat-num">{animatedTenantCount}</span>
                                <span style={{ color: 'rgba(255,255,255,0.45)' }}>·</span>
                                <span style={{ color: 'rgba(255,255,255,0.6)' }}>TENANTS</span>
                            </div>
                            <div className="floor-banner-stat-divider" />
                            <div className="floor-banner-stat-line">
                                <span className="floor-banner-stat-num">{animatedCategoryCount}</span>
                                <span style={{ color: 'rgba(255,255,255,0.45)' }}>·</span>
                                <span style={{ color: 'rgba(255,255,255,0.6)' }}>CATEGORIES</span>
                            </div>
                        </div>
                    </div>

                    {/* ── PROGRESS BAR ── */}
                    <div aria-hidden="true" className="floor-banner-progress">
                        <div
                            className="floor-progress-fill"
                            style={{
                                height: '100%',
                                width: `${((activeFloorIndex + 1) / FLOORS.length) * 100}%`,
                                background: 'linear-gradient(90deg, #E8B864, #FFD998)',
                                boxShadow: '0 0 8px rgba(232,184,100,0.6)',
                            }}
                        />
                    </div>
                </div>

                <div
                    key={`${floorMotionId}-filters`}
                    className="tenant-floor-filters-motion"
                    style={{
                        position: 'relative',
                        maxWidth: 1280,
                        margin: '24px auto 34px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 12,
                        alignItems: 'center',
                        padding: '0 48px',
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
                    style={{ position: 'relative', maxWidth: 1280, margin: '36px auto 0', padding: '0 48px 96px' }}
                >
                    {displayTenants.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
                                {pagedTenants.map((tenant, index) => (
                                    <TenantCard
                                        key={tenant.id || `${safeTenantPage}-${index}`}
                                        tenant={tenant}
                                        idx={safeTenantPage * tenantPageSize + index}
                                        onClick={() => openTenantDetail(tenant)}
                                    />
                                ))}
                            </div>

                            {totalTenantPages > 1 ? (
                                <>
                                    <div className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden items-center justify-between md:flex">
                                        <button
                                            type="button"
                                            onClick={() => setTenantPage((currentPage) => Math.max(0, currentPage - 1))}
                                            disabled={safeTenantPage === 0}
                                            aria-label="Previous tenant slide"
                                            className="pointer-events-auto"
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: 52,
                                                height: 52,
                                                borderRadius: '50%',
                                                border: `1px solid ${safeTenantPage === 0 ? `${T.ink}12` : `${T.ink}26`}`,
                                                background: safeTenantPage === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(12,7,20,0.78)',
                                                color: safeTenantPage === 0 ? 'rgba(255,255,255,0.28)' : T.ink,
                                                cursor: safeTenantPage === 0 ? 'not-allowed' : 'pointer',
                                                transition:
                                                    'transform .32s ease, background .32s ease, border-color .32s ease, color .32s ease, box-shadow .32s ease, opacity .32s ease',
                                                backdropFilter: 'blur(10px)',
                                                boxShadow: safeTenantPage === 0 ? 'none' : '0 14px 30px rgba(0,0,0,0.28)',
                                                transform: 'translateX(-64px)',
                                                opacity: safeTenantPage === 0 ? 0.45 : 0.92,
                                            }}
                                            onMouseEnter={(e) => {
                                                if (safeTenantPage === 0) return;
                                                e.currentTarget.style.transform = 'translateX(-68px) scale(1.06)';
                                                e.currentTarget.style.background = 'rgba(22,14,34,0.92)';
                                                e.currentTarget.style.boxShadow = '0 18px 36px rgba(0,0,0,0.34)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateX(-64px) scale(1)';
                                                e.currentTarget.style.background =
                                                    safeTenantPage === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(12,7,20,0.78)';
                                                e.currentTarget.style.boxShadow = safeTenantPage === 0 ? 'none' : '0 14px 30px rgba(0,0,0,0.28)';
                                            }}
                                        >
                                            <svg
                                                aria-hidden="true"
                                                viewBox="0 0 24 24"
                                                style={{ width: 22, height: 22 }}
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2.1"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 5l-7 7 7 7" />
                                            </svg>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setTenantPage((currentPage) => Math.min(totalTenantPages - 1, currentPage + 1))}
                                            disabled={safeTenantPage >= totalTenantPages - 1}
                                            aria-label="Next tenant slide"
                                            className="pointer-events-auto"
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: 52,
                                                height: 52,
                                                borderRadius: '50%',
                                                border: `1px solid ${safeTenantPage >= totalTenantPages - 1 ? `${T.accent}16` : `${T.accent}3A`}`,
                                                background: safeTenantPage >= totalTenantPages - 1 ? 'rgba(220,165,86,0.07)' : 'rgba(36,19,8,0.88)',
                                                color: safeTenantPage >= totalTenantPages - 1 ? 'rgba(255,255,255,0.32)' : T.accent,
                                                cursor: safeTenantPage >= totalTenantPages - 1 ? 'not-allowed' : 'pointer',
                                                transition:
                                                    'transform .32s ease, background .32s ease, border-color .32s ease, color .32s ease, box-shadow .32s ease, opacity .32s ease',
                                                backdropFilter: 'blur(10px)',
                                                boxShadow: safeTenantPage >= totalTenantPages - 1 ? 'none' : `0 16px 34px ${T.accent}24`,
                                                transform: 'translateX(64px)',
                                                opacity: safeTenantPage >= totalTenantPages - 1 ? 0.45 : 0.96,
                                            }}
                                            onMouseEnter={(e) => {
                                                if (safeTenantPage >= totalTenantPages - 1) return;
                                                e.currentTarget.style.transform = 'translateX(68px) scale(1.06)';
                                                e.currentTarget.style.background = 'rgba(58,31,10,0.98)';
                                                e.currentTarget.style.boxShadow = `0 20px 40px ${T.accent}2C`;
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateX(64px) scale(1)';
                                                e.currentTarget.style.background =
                                                    safeTenantPage >= totalTenantPages - 1 ? 'rgba(220,165,86,0.07)' : 'rgba(36,19,8,0.88)';
                                                e.currentTarget.style.boxShadow =
                                                    safeTenantPage >= totalTenantPages - 1 ? 'none' : `0 16px 34px ${T.accent}24`;
                                            }}
                                        >
                                            <svg
                                                aria-hidden="true"
                                                viewBox="0 0 24 24"
                                                style={{ width: 22, height: 22 }}
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2.1"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div
                                        className="flex items-center justify-center gap-4 md:hidden"
                                        style={{
                                            marginTop: 24,
                                        }}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setTenantPage((currentPage) => Math.max(0, currentPage - 1))}
                                            disabled={safeTenantPage === 0}
                                            aria-label="Previous tenant slide"
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: 46,
                                                height: 46,
                                                borderRadius: '50%',
                                                border: `1px solid ${safeTenantPage === 0 ? `${T.ink}12` : `${T.ink}26`}`,
                                                background: safeTenantPage === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(12,7,20,0.78)',
                                                color: safeTenantPage === 0 ? 'rgba(255,255,255,0.28)' : T.ink,
                                            }}
                                        >
                                            <svg
                                                aria-hidden="true"
                                                viewBox="0 0 24 24"
                                                style={{ width: 20, height: 20 }}
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2.1"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 5l-7 7 7 7" />
                                            </svg>
                                        </button>

                                        <div
                                            style={{
                                                minWidth: 64,
                                                textAlign: 'center',
                                                fontFamily: T.mono,
                                                fontSize: 11,
                                                letterSpacing: '.16em',
                                                color: T.accent,
                                            }}
                                        >
                                            {safeTenantPage + 1} / {totalTenantPages}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setTenantPage((currentPage) => Math.min(totalTenantPages - 1, currentPage + 1))}
                                            disabled={safeTenantPage >= totalTenantPages - 1}
                                            aria-label="Next tenant slide"
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: 46,
                                                height: 46,
                                                borderRadius: '50%',
                                                border: `1px solid ${safeTenantPage >= totalTenantPages - 1 ? `${T.accent}16` : `${T.accent}3A`}`,
                                                background: safeTenantPage >= totalTenantPages - 1 ? 'rgba(220,165,86,0.07)' : 'rgba(36,19,8,0.88)',
                                                color: safeTenantPage >= totalTenantPages - 1 ? 'rgba(255,255,255,0.32)' : T.accent,
                                            }}
                                        >
                                            <svg
                                                aria-hidden="true"
                                                viewBox="0 0 24 24"
                                                style={{ width: 20, height: 20 }}
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2.1"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </>
                            ) : null}
                        </>
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
