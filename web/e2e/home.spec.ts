import { expect, test } from "@playwright/test";

test("home page introduces the portfolio, with the disclaimer", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Shawn Oakley",
  );
  await expect(page.locator("main .lede")).toHaveText(
    "A portfolio of software projects.",
  );
  await expect(
    page.getByRole("main").getByRole("link", { name: "Legal AI" }),
  ).toHaveAttribute("href", "/cite-checker");
  await expect(
    page.getByRole("main").getByRole("link", { name: "Graphics", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("contentinfo")).toContainText(
    "Not legal services or legal advice",
  );
  await expect(page.getByRole("contentinfo")).not.toContainText("engine:");
  await expect(page.getByRole("contentinfo")).not.toContainText("Long Beach");
});
