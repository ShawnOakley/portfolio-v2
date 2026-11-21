import { expect, test } from "@playwright/test";

test("graphics lists the splat viewer", async ({ page }) => {
  await page.goto("/about");
  await page.getByRole("button", { name: "Current Projects" }).click();
  await page
    .getByRole("main")
    .getByRole("link", { name: "Graphics", exact: true })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Graphics");
  await expect(page.getByText("A Gaussian splat viewer in")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Gaussian splats" }),
  ).toHaveAttribute("href", "/graphics/splats");
  await expect(
    page.getByRole("link", { name: "Projection viewer" }),
  ).toHaveCount(0);
  await expect(page.getByRole("link", { name: "A-Frame robot" })).toHaveCount(
    0,
  );
});

test("the splat page credits Hover and the lion scan", async ({ page }) => {
  await page.goto("/graphics/splats");
  await expect(
    page.getByRole("heading", { name: "Gaussian splats" }),
  ).toBeVisible();
  await expect(page.getByText("splats at Hover")).toBeVisible();
  await expect(page.getByRole("link", { name: "Renaud" })).toHaveAttribute(
    "href",
    "https://superspl.at/user?id=rohls",
  );
  await page.getByRole("link", { name: "Back to Graphics" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Graphics");
});

test("the projection page returns to the graphics index", async ({ page }) => {
  await page.goto("/graphics/projection");
  await page.getByRole("link", { name: "Back to Graphics" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Graphics");
});
