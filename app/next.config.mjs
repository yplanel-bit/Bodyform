
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "www.inspireusafoundation.org" },
      { protocol: "https", hostname: "cdn.muscleandstrength.com" },
      { protocol: "https", hostname: "fitnessvolt.com" },
      { protocol: "https", hostname: "images.squarespace-cdn.com" }
    ]
  }
};
export default nextConfig;
