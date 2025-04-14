import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "88zflda82j.ufs.sh",
        port: "",
        pathname: "/f/**",
      },
    ],
  },
  experimental: {
    ppr: true,
  },
}

export default nextConfig
