/**
 * Device frames for Live Preview — CSS viewport sizes (logical px).
 * Includes popular iPhone, Android, tablet and desktop presets.
 */

export type DeviceFamily = "iphone" | "android" | "tablet" | "desktop";

export type DevicePreset = {
  id: string;
  family: DeviceFamily;
  label: string;
  /** Short chip label */
  short: string;
  width: number;
  height: number;
  /** Phone chrome radius */
  radius?: number;
};

/** Legacy ids mapped to new presets (persist migration). */
export const LEGACY_DEVICE_MAP: Record<string, string> = {
  mobile: "iphone-se",
  tablet: "ipad-air",
  desktop: "desktop-fhd",
};

export const DEVICE_PRESETS: DevicePreset[] = [
  // ── iPhone (most used + 17 line) ─────────────────────────────
  {
    id: "iphone-se",
    family: "iphone",
    label: "iPhone SE (3rd)",
    short: "SE",
    width: 375,
    height: 667,
    radius: 36,
  },
  {
    id: "iphone-13",
    family: "iphone",
    label: "iPhone 13 / 14",
    short: "13/14",
    width: 390,
    height: 844,
    radius: 44,
  },
  {
    id: "iphone-14-pro",
    family: "iphone",
    label: "iPhone 14 Pro",
    short: "14 Pro",
    width: 393,
    height: 852,
    radius: 48,
  },
  {
    id: "iphone-15",
    family: "iphone",
    label: "iPhone 15",
    short: "15",
    width: 393,
    height: 852,
    radius: 48,
  },
  {
    id: "iphone-15-pro-max",
    family: "iphone",
    label: "iPhone 15 Pro Max",
    short: "15 PM",
    width: 430,
    height: 932,
    radius: 52,
  },
  {
    id: "iphone-16",
    family: "iphone",
    label: "iPhone 16",
    short: "16",
    width: 393,
    height: 852,
    radius: 48,
  },
  {
    id: "iphone-16-pro",
    family: "iphone",
    label: "iPhone 16 Pro",
    short: "16 Pro",
    width: 402,
    height: 874,
    radius: 50,
  },
  {
    id: "iphone-16-pro-max",
    family: "iphone",
    label: "iPhone 16 Pro Max",
    short: "16 PM",
    width: 440,
    height: 956,
    radius: 54,
  },
  {
    id: "iphone-17-air",
    family: "iphone",
    label: "iPhone 17 Air",
    short: "17 Air",
    width: 420,
    height: 912,
    radius: 50,
  },
  {
    id: "iphone-17-pro",
    family: "iphone",
    label: "iPhone 17 Pro",
    short: "17 Pro",
    width: 402,
    height: 874,
    radius: 50,
  },
  {
    id: "iphone-17-pro-max",
    family: "iphone",
    label: "iPhone 17 Pro Max",
    short: "17 PM",
    width: 440,
    height: 956,
    radius: 54,
  },

  // ── Android ──────────────────────────────────────────────────
  {
    id: "galaxy-s24",
    family: "android",
    label: "Galaxy S24",
    short: "S24",
    width: 360,
    height: 780,
    radius: 36,
  },
  {
    id: "galaxy-s24-ultra",
    family: "android",
    label: "Galaxy S24 Ultra",
    short: "S24U",
    width: 384,
    height: 824,
    radius: 28,
  },
  {
    id: "galaxy-s25",
    family: "android",
    label: "Galaxy S25",
    short: "S25",
    width: 360,
    height: 780,
    radius: 36,
  },
  {
    id: "galaxy-s25-ultra",
    family: "android",
    label: "Galaxy S25 Ultra",
    short: "S25U",
    width: 412,
    height: 915,
    radius: 28,
  },
  {
    id: "pixel-8",
    family: "android",
    label: "Pixel 8",
    short: "P8",
    width: 412,
    height: 915,
    radius: 40,
  },
  {
    id: "pixel-9",
    family: "android",
    label: "Pixel 9",
    short: "P9",
    width: 412,
    height: 915,
    radius: 40,
  },
  {
    id: "pixel-9-pro-xl",
    family: "android",
    label: "Pixel 9 Pro XL",
    short: "P9 XL",
    width: 448,
    height: 998,
    radius: 42,
  },
  {
    id: "oneplus-12",
    family: "android",
    label: "OnePlus 12",
    short: "OP12",
    width: 450,
    height: 1000,
    radius: 36,
  },
  {
    id: "xiaomi-14",
    family: "android",
    label: "Xiaomi 14",
    short: "Mi 14",
    width: 393,
    height: 873,
    radius: 38,
  },
  {
    id: "nothing-phone-2",
    family: "android",
    label: "Nothing Phone (2)",
    short: "NP2",
    width: 412,
    height: 915,
    radius: 36,
  },

  // ── Tablets ──────────────────────────────────────────────────
  {
    id: "ipad-mini",
    family: "tablet",
    label: "iPad mini",
    short: "mini",
    width: 744,
    height: 1133,
    radius: 24,
  },
  {
    id: "ipad-air",
    family: "tablet",
    label: "iPad Air 11″",
    short: "Air",
    width: 820,
    height: 1180,
    radius: 22,
  },
  {
    id: "ipad-pro-11",
    family: "tablet",
    label: "iPad Pro 11″",
    short: "Pro 11",
    width: 834,
    height: 1194,
    radius: 20,
  },
  {
    id: "ipad-pro-13",
    family: "tablet",
    label: "iPad Pro 13″",
    short: "Pro 13",
    width: 1024,
    height: 1366,
    radius: 20,
  },
  {
    id: "galaxy-tab-s9",
    family: "tablet",
    label: "Galaxy Tab S9",
    short: "Tab S9",
    width: 800,
    height: 1280,
    radius: 16,
  },
  {
    id: "galaxy-tab-s9-ultra",
    family: "tablet",
    label: "Galaxy Tab S9 Ultra",
    short: "Tab U",
    width: 920,
    height: 1440,
    radius: 16,
  },

  // ── Desktop ──────────────────────────────────────────────────
  {
    id: "desktop-hd",
    family: "desktop",
    label: "Desktop HD",
    short: "HD",
    width: 1440,
    height: 900,
  },
  {
    id: "desktop-fhd",
    family: "desktop",
    label: "Desktop Full HD",
    short: "FHD",
    width: 1920,
    height: 1080,
  },
  {
    id: "desktop-qhd",
    family: "desktop",
    label: "Desktop QHD",
    short: "QHD",
    width: 2560,
    height: 1440,
  },
];

export const DEFAULT_DEVICE_ID = "iphone-se";

export function resolveDeviceId(raw: string | undefined | null): string {
  if (!raw) return DEFAULT_DEVICE_ID;
  if (LEGACY_DEVICE_MAP[raw]) return LEGACY_DEVICE_MAP[raw];
  if (DEVICE_PRESETS.some((d) => d.id === raw)) return raw;
  return DEFAULT_DEVICE_ID;
}

export function getDevice(id: string): DevicePreset {
  const resolved = resolveDeviceId(id);
  return DEVICE_PRESETS.find((d) => d.id === resolved) ?? DEVICE_PRESETS[0];
}

export function devicesByFamily(family: DeviceFamily): DevicePreset[] {
  return DEVICE_PRESETS.filter((d) => d.family === family);
}

export const FAMILY_LABEL: Record<DeviceFamily, string> = {
  iphone: "iPhone",
  android: "Android",
  tablet: "Tablety",
  desktop: "Desktop",
};
