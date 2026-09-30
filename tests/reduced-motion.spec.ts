import { expect, test } from "@playwright/test";

const KEYFRAME_META = new Set(["offset", "easing", "composite"]);

test("reduced motion: running animations are opacity-only", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const running = await page.evaluate((metaKeys) => {
    const meta = new Set(metaKeys);

    return document.getAnimations().flatMap((animation) => {
      if (animation.playState !== "running") {
        return [];
      }

      const effect = animation.effect;
      if (!effect || !("getKeyframes" in effect)) {
        return [{ properties: ["<unknown>"] }];
      }

      const keyframes = (effect as KeyframeEffect).getKeyframes();
      const properties = [
        ...new Set(
          keyframes.flatMap((frame) =>
            Object.keys(frame).filter((key) => !meta.has(key)),
          ),
        ),
      ];

      return [{ properties }];
    });
  }, [...KEYFRAME_META]);

  for (const animation of running) {
    expect(animation.properties.every((property) => property === "opacity")).toBe(
      true,
    );
  }
});
