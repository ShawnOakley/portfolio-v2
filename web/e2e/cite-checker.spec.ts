import { expect, test } from "@playwright/test";

test("the citation checker page states what it asks of a filing", async ({
  page,
}) => {
  await page.goto("/cite-checker");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Legal AI");
  await expect(page.getByText("checks a brief’s citations")).toBeVisible();
  await expect(page.getByText("Does the case exist?")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "design notes" }),
  ).toHaveAttribute("href", "/notes");
});
