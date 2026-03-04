/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: '192.168.5.12',
                port: '',
            },
        ],
        domains: ['image.pngaaa.com', 'muradevelopment.site', 'queencitysemarang.cloud', 'placehold.co', 'mysrland.id'],
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
