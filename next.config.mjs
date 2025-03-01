/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'windyimage.s3.ap-northeast-1.amazonaws.com',
                port: '',
                pathname: '/**',
            } ,
            {
                protocol: 'https',
                hostname: 'bucket4image.s3.ap-northeast-1.amazonaws.com',
                port: '',
                pathname: '/**',
            }            
        ]
    }
};

export default nextConfig;
