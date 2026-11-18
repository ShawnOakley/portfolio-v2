import { expect, test } from "@playwright/test";

test("the root opens the résumé", async ({ page }) => {
  const response = await page.request.get("/", { maxRedirects: 0 });
  expect(response.status()).toBe(307);
  expect(response.headers().location).toMatch(/\/about$/);

  await page.goto("/");
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("About");
  await expect(page.getByRole("link", { name: "About" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await expect(
    page.getByRole("heading", { name: "Career and Education" }),
  ).toBeVisible();
  await expect(page.getByRole("contentinfo")).toContainText(
    "Not legal services or legal advice",
  );
  await expect(page.getByRole("contentinfo")).not.toContainText("engine:");
  await expect(page.getByRole("contentinfo")).not.toContainText("Long Beach");
});
