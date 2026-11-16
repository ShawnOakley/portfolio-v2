import { expect, test } from "@playwright/test";

test("learn lists the explainers", async ({ page }) => {
  await page.goto("/learn");
  await expect(
    page.getByRole("link", { name: "Citation anatomy" }),
  ).toHaveAttribute("href", "/learn/citation-anatomy");
  await expect(
    page.getByRole("link", { name: "Citation failures" }),
  ).toBeVisible();
});

test("citation failures uses the public opinion and does not discuss the lawyers", async ({
  page,
}) => {
  await page.goto("/learn/citation-failures");
  await expect(
    page.getByRole("heading", { name: "A case that does not exist" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Mata v. Avianca/ }),
  ).toHaveAttribute("href", /justia\.com/);
  await expect(page.locator("body")).not.toContainText("Schwartz");
  await expect(page.locator("body")).not.toContainText("LoDuca");
});

test("the evaluation counts can be changed from the keyboard", async ({
  page,
}) => {
  await page.goto("/learn/evaluation");
  const predictedYes = page.getByRole("spinbutton", {
    name: "Actual yes, predicted yes",
  });
  await predictedYes.fill("40");
  await expect(page.getByRole("figure", { name: "Precision" })).toContainText(
    "40 of 45",
  );
});
