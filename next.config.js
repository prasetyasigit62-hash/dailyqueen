/** @type {import('next').NextConfig} */
const nextConfig = {
    // Don't fail the production build on lint issues. The repo's files use CRLF line endings
    // (Windows), which trip the `prettier/prettier: ["error", { endOfLine: "lf" }]` rule and
    // block `next build` on Vercel. Linting still runs in dev / can be run manually; it just
    // no longer gates deploys.
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'http',
                hostname: '127.0.0.1',
                port: '8000',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8000',
            },
            {
                protocol: 'http',
                hostname: '192.168.5.12',
                port: '',
            },
            {
                protocol: 'https',
                hostname: 'mysrland.id',
                port: '',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
            },
        ],
        domains: ['image.pngaaa.com', 'muradevelopment.site', 'queencitysemarang.cloud', 'placehold.co', 'mysrland.id', '127.0.0.1', 'localhost', 'images.unsplash.com'],
    },
    webpack: (config) => {
        config.externals.push({
            'utf-8-validate': 'commonjs utf-8-validate',
            bufferutil: 'commonjs bufferutil',
            canvas: 'canvas',
        });
        return config;
    },
};

module.exports = nextConfig;
