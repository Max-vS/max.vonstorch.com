import { execSync } from "child_process";
import type { NextConfig } from "next";

const getLastCommitDate = () => {
  try {
    const date = execSync("git log -1 --format=%cI").toString().trim();
    return date;
  } catch {
    return new Date().toISOString();
  }
};

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_BUILD_TIME: getLastCommitDate(),
  },
};

export default nextConfig;
