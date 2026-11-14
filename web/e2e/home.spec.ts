import { expect, test } from "@playwright/test";

test("home page states what the software does, with the disclaimer", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "checks a brief’s citations",
  );
  await expect(page.getByRole("contentinfo")).toContainText(
    "Not legal services or legal advice",
  );
});

test("footer degrades when the API is not running", async ({ page }) => {
  // The web app is tested alone here; /api/health has no backend behind it.
  await page.goto("/");
  await expect(page.getByTestId("engine-version")).toHaveText(
    "engine: unavailable",
  );
});
