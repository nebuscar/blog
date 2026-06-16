import { cpSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";

const source = join(process.cwd(), "dist", "pagefind");
const target = join(process.cwd(), "public", "pagefind");

if (!existsSync(source)) {
  throw new Error("Pagefind output not found. Run pagefind before copying.");
}

rmSync(target, { recursive: true, force: true });
cpSync(source, target, { recursive: true });
