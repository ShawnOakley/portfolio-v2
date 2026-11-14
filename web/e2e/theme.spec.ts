import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const paper = (page: import("@playwright/test").Page) =>
  page.evaluate(() => getComputedStyle(document.body).backgroundColor);

test.use({ colorScheme: "light" });

test("an explicit Dark choice overrides a light device and persists", async ({
  page,
}) => {
  await page.goto("/");
  const light = await paper(page);
  await expect(page.getByRole("radio", { name: "Auto" })).toBeChecked();

  await page.getByText("Dark", { exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  const dark = await paper(page);
  expect(dark).not.toBe(light);

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.getByRole("radio", { name: "Dark" })).toBeChecked();
  expect(await paper(page)).toBe(dark);
});

test("Auto returns to the device setting", async ({ page }) => {
  await page.goto("/");
  const light = await paper(page);
  await page.getByText("Dark", { exact: true }).click();
  await page.getByText("Auto", { exact: true }).click();
  await expect(page.locator("html")).not.toHaveAttribute("data-theme");
  expect(await paper(page)).toBe(light);
});

test("the control works from the keyboard", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("radio", { name: "Auto" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("explicit dark on a light device passes axe", async ({ page }) => {
  await page.goto("/styleguide");
  await page.getByText("Dark", { exact: true }).click();
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations.map((v) => v.id)).toEqual([]);
});
