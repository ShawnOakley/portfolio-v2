import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/** Every route that exists. Add new routes here when they ship. */
const ROUTES = [
  "/",
  "/about",
  "/graphics",
  "/graphics/splats",
  "/graphics/projection",
  "/learn",
  "/learn/citation-anatomy",
  "/learn/citation-failures",
  "/learn/evaluation",
  "/notes",
  "/notes/no-rich-text-editor",
  "/notes/where-your-key-goes",
  "/notes/why-the-engine-stays-python",
  "/privacy-and-keys",
  "/colophon",
  "/styleguide",
];

for (const scheme of ["light", "dark"] as const) {
  test.describe(`accessibility, ${scheme} mode`, () => {
    test.use({ colorScheme: scheme });

    for (const route of ROUTES) {
      test(`${route} has no axe violations`, async ({ page }) => {
        await page.goto(route);
        const results = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
          .analyze();
        expect(
          results.violations.map((v) => ({
            id: v.id,
            nodes: v.nodes.map((n) => n.target.join(" ")),
          })),
        ).toEqual([]);
      });
    }
  });
}

test("skip link is the first focus stop and targets main", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await expect(skip).toHaveAttribute("href", "#main");
});

test("unknown note returns the not-found page", async ({ page }) => {
  const res = await page.goto("/notes/no-such-note");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "No page at this address",
  );
});
