import { expect, test } from "@playwright/test";

test("design notes and the colophon return to Notes", async ({ page }) => {
  await page.goto("/notes/design");
  await page.getByRole("link", { name: "Back to Notes" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Notes");

  await page.goto("/colophon");
  await page.getByRole("link", { name: "Back to Notes" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Notes");
});

test("a design note returns to the design notes index", async ({ page }) => {
  await page.goto("/notes/no-rich-text-editor");
  await page
    .getByRole("link", {
      name: "Back to Citation Checker Implementation Notes",
    })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Citation Checker Implementation Notes",
  );
});
