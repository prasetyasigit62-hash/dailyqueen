/**
 * Normalises a floor label coming from the API (e.g. "Lantai 1", "Lantai 2", "Ground Floor")
 * into a consistent English label for display. The DB still stores "Lantai X"; this only
 * affects what the user sees so floor labels read uniformly in English across the site.
 *
 * Examples:
 *   "Lantai 1"      -> "1st Floor"
 *   "Lantai 2"      -> "2nd Floor"
 *   "Lantai 3"      -> "3rd Floor"
 *   "Ground Floor"  -> "Ground Floor" (unchanged)
 *   "Lantai Dasar"  -> "Ground Floor"
 * Anything unrecognised is returned as-is so we never blank out a label.
 */
export function formatFloorLabel(raw?: string | null): string {
    if (!raw) return '';
    const value = raw.trim();
    const lower = value.toLowerCase();

    // Ground floor variants.
    if (lower.includes('ground') || lower.includes('dasar') || lower === 'gf' || lower === 'lg') {
        return 'Ground Floor';
    }

    // "Lantai N" -> "Nth Floor".
    const match = lower.match(/(?:lantai|floor|lt\.?|l)\s*0*(\d+)/) || lower.match(/^0*(\d+)$/);
    if (match) {
        const n = parseInt(match[1], 10);
        return `${ordinal(n)} Floor`;
    }

    // Already English / unknown — leave untouched.
    return value;
}

function ordinal(n: number): string {
    const mod100 = n % 100;
    if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
    switch (n % 10) {
        case 1:
            return `${n}st`;
        case 2:
            return `${n}nd`;
        case 3:
            return `${n}rd`;
        default:
            return `${n}th`;
    }
}
