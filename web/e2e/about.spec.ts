import { expect, test } from "@playwright/test";
import { resumePdfPath } from "../src/lib/site";

test("about states the work and how to reach him", async ({ page }) => {
  await page.goto("/about");
  const download = page.getByRole("link", { name: "Download Resume" });
  await expect(download).toHaveAttribute("href", resumePdfPath);
  const pdf = await page.request.get(resumePdfPath);
  expect(pdf.ok()).toBeTruthy();
  expect(pdf.headers()["content-type"] ?? "").toContain("pdf");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("About");
  await expect(page.locator("main .lede")).toHaveText(
    "I trained and practiced as a lawyer, then spent ten years as a software engineer. These are the parts of that work the tools come from.",
  );
  await expect(page.getByRole("heading", { name: "Additional" })).toHaveCount(
    0,
  );
  await expect(page.getByRole("heading", { name: "Experience" })).toHaveCount(
    0,
  );
  const law = page.getByRole("button", { name: /^Law\b/ });
  await expect(law).toHaveAttribute("aria-expanded", "false");
  const projects = page.getByRole("button", { name: "Current Projects" });
  await expect(projects).toHaveAttribute("aria-expanded", "false");
  await expect(
    page.getByRole("heading", {
      name: "Volunteer, unlawful detainer answer clinic",
    }),
  ).toHaveCount(0);

  const legal = page.getByRole("main").getByRole("link", { name: "Legal AI" });
  const graphics = page
    .getByRole("main")
    .getByRole("link", { name: "Graphics", exact: true });
  await expect(legal).toHaveCount(0);
  await projects.click();
  await expect(projects).toHaveAttribute("aria-expanded", "true");
  await expect(legal).toHaveCount(1);
  await expect(legal).toHaveAttribute("href", "/cite-checker");
  await expect(graphics).toHaveCount(1);
  await expect(graphics).toHaveAttribute("href", "/graphics");

  await law.click();
  await expect(law).toHaveAttribute("aria-expanded", "true");
  await expect(legal).toHaveCount(2);
  await expect(legal.nth(1)).toHaveAttribute("href", "/cite-checker");
  await expect(graphics).toHaveCount(2);
  await expect(graphics.nth(1)).toHaveAttribute("href", "/graphics");
  await expect(
    page.getByRole("heading", {
      name: "Volunteer, unlawful detainer answer clinic",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "This site" }).first(),
  ).toHaveAttribute("href", "/colophon");
  await expect(page.getByText("New York bar admission: inactive.")).toHaveCount(
    0,
  );
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

  await page.getByRole("button", { name: /Paul Hastings/ }).click();
  await expect(page.getByRole("status")).toContainText(
    "Scientific resource on Hatch-Waxman",
  );
});
