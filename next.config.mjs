/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add the redirects function here
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;