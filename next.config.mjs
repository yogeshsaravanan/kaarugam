/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Product photos are served from Supabase Storage (public bucket).
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co" }],
  },
};
export default nextConfig;
