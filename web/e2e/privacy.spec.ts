import { expect, test } from "@playwright/test";

test("privacy states the key path and does not claim the key stays in the browser", async ({
  page,
}) => {
  await page.goto("/privacy-and-keys");
  await expect(
    page.getByRole("heading", { level: 1, name: "Privacy and keys" }),
  ).toBeVisible();
  await expect(page.getByRole("list", { name: "Key path" })).toBeVisible();
  await expect(page.getByText("stateless")).toBeVisible();
  await expect(page.getByText(/never leaves your browser/i)).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "Where your key goes" }),
  ).toHaveAttribute("href", "/notes/where-your-key-goes");
});
