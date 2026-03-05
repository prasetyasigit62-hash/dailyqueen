/* eslint-disable no-console */

/**
 * Custom fetch wrapper with timeout and retry logic.
 * Optimized to be less noisy in Vercel logs and handle network errors.
 */

const fetchWithRetry = async (url: string, options: any = {}, attempt: number = 0): Promise<Response> => {
    const { timeout = 15000, retries = 3, ...fetchOptions } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...fetchOptions,
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

            if (response.status === 429 && attempt < retries - 1) {
                // Quiet warning for 429
                if (attempt === 0) console.warn(`[API] Rate limit hit for ${url}. Retrying...`);

                await new Promise((resolve) => {
                    setTimeout(resolve, (attempt + 1) * 3000);
                });
                return fetchWithRetry(url, options, attempt + 1);
            }

            // Handle Server Errors (5xx)
            if (response.status >= 500 && attempt < retries - 1) {
                await new Promise((resolve) => {
                    setTimeout(resolve, (attempt + 1) * 1000);
                });
                return fetchWithRetry(url, options, attempt + 1);
            }
        }

        return response;
    } catch (error: any) {
        clearTimeout(timeoutId);

        // Network or Timeout errors
        const isTimeout = error.name === 'AbortError';
        const isNetworkError = error.code === 'ENETUNREACH' || error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT';

        if (attempt < retries - 1 && (isTimeout || isNetworkError)) {
            // Silent retry for network/timeout to avoid log spam
            await new Promise((resolve) => {
                setTimeout(resolve, (attempt + 1) * 2000);
            });
            return fetchWithRetry(url, options, attempt + 1);
        }

        // Only log error on the FINAL attempt to reduce noise
        if (isTimeout) {
            console.error(`[API] Final Attempt Failed: Timeout after ${timeout}ms: ${url}`);
        } else {
            console.error(`[API] Final Attempt Failed: ${error.message} (${error.code}) for ${url}`);
            if (error.code === 'ENETUNREACH') {
                console.error(`[TIP] ENETUNREACH usually means IPv6 routing issues from Vercel. Try using an IPv4-only host if possible.`);
            }
        }

        throw error || new Error(`Failed to fetch ${url} after ${retries} retries`);
    }
};

export default fetchWithRetry;
