import { expect, test } from "@playwright/test";
import { LAYOUT_PROPERTIES } from "./layout-properties";

test("getAnimations() keyframes never animate layout properties", async ({
  page,
}) => {
  await page.goto("/");

  const { animationCount, violations } = await page.evaluate(
    (layoutProperties) => {
      const forbidden = new Set(layoutProperties);
      const kebab = (name: string) =>
        name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
      const animations = document.getAnimations();

      const found = animations.flatMap((animation, animationIndex) => {
        const effect = animation.effect;
        if (!effect || !("getKeyframes" in effect)) {
          return [];
        }

        const keyframes = (
          effect as KeyframeEffect
        ).getKeyframes() as Array<Record<string, unknown>>;

        return keyframes.flatMap((frame, frameIndex) =>
          Object.keys(frame)
            .filter(
              (key) =>
                key !== "offset" &&
                key !== "computedOffset" &&
                key !== "easing" &&
                key !== "composite",
            )
            .filter((key) => forbidden.has(kebab(key)))
            .map((property) => ({
              animationIndex,
              frameIndex,
              property,
            })),
        );
      });

      return { animationCount: animations.length, violations: found };
    },
    [...LAYOUT_PROPERTIES],
  );

  expect(
    animationCount,
    "motion lint must observe at least one animation",
  ).toBeGreaterThan(0);
  expect(violations).toEqual([]);
});

test("stylesheet @keyframes never animate layout properties", async ({
  page,
}) => {
  await page.goto("/");

  const { keyframeRuleCount, violations } = await page.evaluate(
    (layoutProperties) => {
      const forbidden = new Set(layoutProperties);
      const found: Array<{ name: string; property: string }> = [];
      let keyframeRuleCount = 0;

      for (const sheet of Array.from(document.styleSheets)) {
        let rules: CSSRuleList;
        try {
          rules = sheet.cssRules;
        } catch {
          continue;
        }

        for (const rule of Array.from(rules)) {
          if (!(rule instanceof CSSKeyframesRule)) {
            continue;
          }

          keyframeRuleCount += 1;

          for (const keyframe of Array.from(rule.cssRules)) {
            if (!(keyframe instanceof CSSKeyframeRule)) {
              continue;
            }

            for (const property of Array.from(keyframe.style)) {
              if (forbidden.has(property)) {
                found.push({ name: rule.name, property });
              }
            }
          }
        }
      }

      return { keyframeRuleCount, violations: found };
    },
    [...LAYOUT_PROPERTIES],
  );

  expect(
    keyframeRuleCount,
    "motion lint must observe at least one @keyframes rule",
  ).toBeGreaterThan(0);
  expect(violations).toEqual([]);
});
