import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import mainSource from "./main.tsx?raw";

// Entry-import-order guard. The palette must be imported from the entry module
// (never tree-shaken), and the site's own stylesheet must load AFTER the
// @lelcodes/ui imports so site rules win the cascade in the production bundle.
describe("entry import order", () => {
  it("imports the theme palette from the entry module", () => {
    expect(mainSource).toMatch(/import\s+["']@lelcodes\/ui\/theme\.css["']/);
  });

  it("imports the site stylesheet after the @lelcodes/ui imports", () => {
    const lastUi = mainSource.lastIndexOf("@lelcodes/ui");
    const siteCss = mainSource.indexOf("./index.css");
    expect(lastUi).toBeGreaterThanOrEqual(0);
    expect(siteCss).toBeGreaterThan(lastUi);
  });
});

describe("brand tokens", () => {
  const siteCss = readFileSync(fileURLToPath(new URL("./index.css", import.meta.url)), "utf8");

  it("derives the brand colour from the active theme accent", () => {
    expect(siteCss).toMatch(/--purple:\s*var\(--accent\)/);
    expect(siteCss).toMatch(/--purple-light:\s*color-mix\(in srgb, var\(--accent\)/);
  });
});
