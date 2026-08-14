import type { NextConfig } from "next";

const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseHostname
      ? [
          {
            protocol: "https",
            hostname: supabaseHostname,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
    // Safe here: these are static SVGs authored for this repo (unit cover
    // art in public/covers/), never user-uploaded content, so the usual
    // SVG-script XSS concern this flag guards against doesn't apply.
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
