import { expect, test } from "@playwright/test";

test("a short cite points back at the full citation from the keyboard", async ({
  page,
}) => {
  await page.goto("/learn/citation-anatomy");
  const supra = page.getByRole("button", { name: "supra" });
  await supra.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status")).toHaveText(
    "Supra. This points at the full citation.",
  );
  await expect(page.locator('[data-span="brown"]')).toHaveAttribute(
    "data-pointed",
    "true",
  );
});
