import { expect, test } from "@playwright/test";

test("about states the work, the bar status once, and how to reach him", async ({
  page,
}) => {
  await page.goto("/about");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("About");
  await expect(
    page.getByRole("link", { name: "Cite-checker" }),
  ).toHaveAttribute("href", "/");
  await expect(
    page.getByRole("link", { name: "This site" }).first(),
  ).toHaveAttribute("href", "/colophon");
  const bar = page.getByText("New York bar admission: inactive.");
  await expect(bar).toHaveCount(1);
  await expect(
    page.getByRole("link", { name: "shawnoakley@gmail.com" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "GitHub" })).toHaveAttribute(
    "href",
    "https://github.com/ShawnOakley",
  );
  await expect(page.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
    "href",
    "https://www.linkedin.com/in/s-oakley",
  );
});
