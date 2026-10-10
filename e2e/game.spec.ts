import { expect, test } from "@playwright/test";

const ERAS = ["Switches", "Symbols", "Rules", "Statistics", "Gradients", "Tokens", "Recursion", "Matter", "Earth", "Shells"];

test("the first screen is the panel, and the first deposit makes an op", async ({ page }) => {
  await page.goto("/?seed=1&silent&fresh");
  await expect(page.locator(".panel0 .deposit")).toBeVisible();
  await expect(page.locator(".hud-compute")).toHaveText(/0 ops\/s/);
  await page.locator(".panel0 .switch").nth(7).click();
  await page.locator(".panel0 .deposit").click();
  // On a phone the Log is a tab; on a laptop it's a column and the tab is hidden.
  const logTab = page.locator('.tab[data-tab="log"]');
  if (await logTab.isVisible()) await logTab.click();
  await expect(page.locator(".log-entry").first()).toContainText("1 op");
});

for (const era of [0, 3, 6, 9]) {
  test(`era ${era} (${ERAS[era]}) renders without console errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    await page.goto(`/?era=${era}&seed=1&silent&fresh`);
    await expect(page.locator(".hud-year .sevenseg")).toBeVisible();
    await expect(page.locator('.tab[data-tab="era"]')).toBeVisible();
    await page.locator('.tab[data-tab="era"]').click();
    await page.locator('.tab[data-tab="build"]').click();
    await page.locator('.tab[data-tab="research"]').click();
    await expect(page).toHaveScreenshot(`era-${era}.png`, { maxDiffPixelRatio: 0.2 });
    expect(errors).toEqual([]);
  });
}

test("the bot plays the whole game at speed and reaches an ending", async ({ page }) => {
  test.setTimeout(240_000);
  await page.goto("/?seed=1&speed=600&autoplay&silent&fresh");
  await expect(page.locator(".ending")).toBeVisible({ timeout: 200_000 });
  await expect(page.locator(".ending-title")).not.toBeEmpty();
});

test("a save survives reload and reports time away", async ({ page }) => {
  await page.goto("/?era=2&seed=1&silent&fresh&now=2026-10-06T12:00:00Z");
  await expect(page.locator(".hud-year .sevenseg")).toHaveAttribute("aria-label", /1974/);
  await page.evaluate(() => document.dispatchEvent(new Event("visibilitychange")));
  await page.waitForTimeout(200);
  await page.goto("/?silent&now=2026-10-06T13:00:00Z");
  await expect(page.locator(".modal.away")).toBeVisible();
  await expect(page.locator(".modal.away")).toContainText("While you were away");
});
