import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.zenflow.app",
  appName: "ZenFlow",
  webDir: "out",
  server: {
    androidScheme: "https",
  },
};

export default config;
