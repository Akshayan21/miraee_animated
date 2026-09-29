// Radii must stay under the distance from center to each edge (46%<50% sides, 44%<46% top)
// so the fade reaches full transparency before the box boundary — otherwise the photo's
// own rectangular edge shows through as a hard line. The vertical radius (44%) is smaller
// than the distance to the bottom edge (54%), so the fade finishes gradually over the
// shoulders/chest instead of chopping straight to a floating head. Kept as a literal
// string (not a shared constant) in both mask-image utilities below so Tailwind's static
// scanner sees each full class name — a template-literal interpolation would hide it.

type Variant = "device" | "hero";

export function MiraiAvatar({ variant = "device" }: { variant?: Variant } = {}) {
  const isHero = variant === "hero";

  return (
    <div className="relative h-full flex items-center justify-center" aria-label="Miraee, your AI travel companion" role="img">
      {!isHero && (
        <div className="absolute inset-x-[-16%] top-[2%] bottom-[-4%] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-brand)_46%,white),color-mix(in_srgb,var(--color-brand)_18%,white)_46%,transparent_70%)] blur-[2px]" />
      )}
      {/* object-cover so the rendered pixels fill the whole box — with
          object-contain the photo sits letterboxed well inside the box and
          the mask's fade radius (relative to the box) never reaches it.
          The black stop (72%, up from 58%) keeps more of the face fully
          opaque before the fade starts — at 58% she read as washed-out/
          ghostly rather than a solid presence; the outer 100% stop is
          unchanged so it still clears the box edge per the note above.

          The source photo only fades naturally near the bottom shoulders —
          the top (hair) and sides are a flat studio white with no built-in
          falloff, so a bottom-only linear mask left a hard white rectangle
          on three sides once composited over a coloured backdrop. The hero
          box shares the device box's aspect ratio closely enough that the
          same all-sides radial mask (already verified edge-to-edge here)
          blends it cleanly in both places. */}
      {/* eslint-disable-next-line @next/next/no-img-element -- fixed-aspect brand asset, no responsive sizes needed */}
      <img
        src="/brand/icons/Avatar-1337.webp"
        alt=""
        className={
          isHero
            ? "relative z-1 w-full h-full object-cover object-top [mask-image:radial-gradient(ellipse_46%_44%_at_50%_46%,black_72%,transparent_100%)] [-webkit-mask-image:radial-gradient(ellipse_46%_44%_at_50%_46%,black_72%,transparent_100%)] [mask-size:100%_100%] [-webkit-mask-size:100%_100%] [mask-repeat:no-repeat] [-webkit-mask-repeat:no-repeat] [filter:drop-shadow(0_30px_60px_rgba(34,25,45,.32))_saturate(1.08)_contrast(1.04)]"
            : "relative z-1 w-full h-full object-cover object-top [mask-image:radial-gradient(ellipse_46%_44%_at_50%_46%,black_72%,transparent_100%)] [-webkit-mask-image:radial-gradient(ellipse_46%_44%_at_50%_46%,black_72%,transparent_100%)] [mask-size:100%_100%] [-webkit-mask-size:100%_100%] [mask-repeat:no-repeat] [-webkit-mask-repeat:no-repeat] [filter:drop-shadow(0_22px_46px_rgba(34,25,45,.4))_saturate(1.15)_contrast(1.08)_brightness(1.03)]"
        }
      />
    </div>
  );
}
