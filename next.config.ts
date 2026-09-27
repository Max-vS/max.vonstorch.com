import { withBotId } from "botid/next/config";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  typedRoutes: true,
  // `use cache` + cacheLife/cacheTag replace the route segment configs.
  cacheComponents: true,
};

export default withBotId(nextConfig);
