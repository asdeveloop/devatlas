// packages/ui/add-ui-deps.ts

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// --- ESM Support for __dirname ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// اصلاح مسیرها بر اساس مکان فعلی فایل در packages/ui
const UI_PKG_PATH = path.resolve(__dirname, "package.json");
const ROOT_PKG_PATH = path.resolve(__dirname, "../../package.json");

type PackageJson = {
  name?: string;
  version?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  [key: string]: unknown; // تغییر any به unknown برای رفع خطای ESLint
};

const REQUIRED_DEPS: Record<string, string> = {
  // Radix
  "@radix-ui/react-accordion": "^1.1.2",
  "@radix-ui/react-alert-dialog": "^1.1.2",
  "@radix-ui/react-aspect-ratio": "^1.1.2",
  "@radix-ui/react-avatar": "^1.1.2",
  "@radix-ui/react-checkbox": "^1.1.2",
  "@radix-ui/react-collapsible": "^1.1.2",
  "@radix-ui/react-context-menu": "^1.1.2",
  "@radix-ui/react-dialog": "^1.1.2",
  "@radix-ui/react-dropdown-menu": "^2.1.2",
  "@radix-ui/react-hover-card": "^1.1.2",
  "@radix-ui/react-label": "^2.1.0",
  "@radix-ui/react-menubar": "^1.1.2",
  "@radix-ui/react-navigation-menu": "^1.1.4",
  "@radix-ui/react-popover": "^1.1.2",
  "@radix-ui/react-progress": "^1.1.2",
  "@radix-ui/react-radio-group": "^1.2.2",
  "@radix-ui/react-scroll-area": "^1.2.2",
  "@radix-ui/react-select": "^2.1.2",
  "@radix-ui/react-separator": "^1.1.2",
  "@radix-ui/react-slider": "^1.2.2",
  "@radix-ui/react-slot": "^1.1.2",
  "@radix-ui/react-switch": "^1.1.2",
  "@radix-ui/react-tabs": "^1.1.2",
  "@radix-ui/react-toast": "^1.2.4",
  "@radix-ui/react-toggle": "^1.1.2",
  "@radix-ui/react-toggle-group": "^1.1.2",
  "@radix-ui/react-tooltip": "^1.1.4",

  // Other UI deps
  "react-day-picker": "^8.10.1",
  "recharts": "^2.12.7",
  "cmdk": "^0.2.1",
  "input-otp": "^1.2.4",
  "vaul": "^0.9.0",
  "sonner": "^1.5.0",
  "next-themes": "^0.3.0",
  "embla-carousel-react": "^8.1.8",
  "@base-ui/react": "^0.2.0",
};

function readJson(p: string): PackageJson {
  const raw = fs.readFileSync(p, "utf8");
  return JSON.parse(raw) as PackageJson;
}

function writeJson(p: string, data: PackageJson) {
  const formatted = JSON.stringify(data, null, 2) + "\n";
  fs.writeFileSync(p, formatted, "utf8");
}

function main() {
  if (!fs.existsSync(UI_PKG_PATH)) {
    console.error(`UI package.json not found at: ${UI_PKG_PATH}`);
    process.exit(1);
  }

  const rootPkg = fs.existsSync(ROOT_PKG_PATH) ? readJson(ROOT_PKG_PATH) : {};
  const uiPkg = readJson(UI_PKG_PATH);

  uiPkg.dependencies = uiPkg.dependencies ?? {};
  uiPkg.peerDependencies = uiPkg.peerDependencies ?? {};
  uiPkg.devDependencies = uiPkg.devDependencies ?? {};

  // استخراج وابستگی‌های ریشه برای حفظ یکپارچگی نسخه‌ها
  const rootDeps = {
    ...(rootPkg.dependencies as Record<string, string> ?? {}),
    ...(rootPkg.devDependencies as Record<string, string> ?? {}),
  };

  let changed = false;

  for (const [dep, defaultVersion] of Object.entries(REQUIRED_DEPS)) {
    // اگر پکیج قبلاً وجود دارد، رد شو
    if (uiPkg.dependencies[dep] || uiPkg.peerDependencies[dep]) {
      continue;
    }

    const version = rootDeps[dep] ?? defaultVersion;
    uiPkg.dependencies[dep] = version;
    changed = true;
    console.log(`Added dependency to @devatlas/ui: ${dep}@${version}`);
  }

  if (!changed) {
    console.log("No dependencies were added; UI package already has required deps.");
    return;
  }

  writeJson(UI_PKG_PATH, uiPkg);
  console.log(`Successfully updated ${UI_PKG_PATH}`);
}

main();
