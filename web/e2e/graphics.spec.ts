import { expect, test } from "@playwright/test";

test("graphics lists the two viewers and the older experiments", async ({
  page,
}) => {
  await page.goto("/about");
  await page.getByRole("button", { name: "Current Projects" }).click();
  await page
    .getByRole("main")
    .getByRole("link", { name: "Graphics", exact: true })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Graphics");
  await expect(page.getByText("Two viewers.")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Gaussian splats" }),
  ).toHaveAttribute("href", "/graphics/splats");
  await expect(
    page.getByRole("link", { name: "Projection viewer" }),
  ).toHaveAttribute("href", "/graphics/projection");
  await expect(
    page.getByRole("link", { name: "A-Frame robot" }),
  ).toHaveAttribute("href", "https://github.com/ShawnOakley/a-frame-robot");
});

test("the splat page credits Hover and the lion scan", async ({ page }) => {
  await page.goto("/graphics/splats");
  await expect(
    page.getByRole("heading", { name: "Gaussian splats" }),
  ).toBeVisible();
  await expect(page.getByText("work from Hover")).toBeVisible();
  await expect(page.getByRole("link", { name: "Renaud" })).toHaveAttribute(
    "href",
    "https://superspl.at/user?id=rohls",
  );
});
