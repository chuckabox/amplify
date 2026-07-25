import { cn } from "@/lib/utils";

/*
  Placeholder photography, mounted.

  The print equivalent of the double-bezel: an outer mat of sunk stock holding
  an inner plate, with the image duotoned into the palette and a manila wash
  laid over it so photographs read as art direction rather than a stock drop-in.

  Images are seeded from picsum so each slot is stable across reloads. Swap the
  `src` for a real asset and nothing about the layout changes.
*/
export function PhotoPlate({
  seed,
  alt,
  width = 1200,
  height = 800,
  className,
  imageClassName,
  caption,
  priority = false,
  bare = false,
}: {
  seed: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  imageClassName?: string;
  caption?: string;
  priority?: boolean;
  /** Drop the mat and mount — for full-bleed backdrops. */
  bare?: boolean;
}) {
  return (
    <figure className={cn(!bare && "plate", className)}>
      <div
        className={cn(
          "relative overflow-hidden",
          bare ? "h-full w-full" : "plate-core",
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://picsum.photos/seed/${seed}/${width}/${height}`}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className={cn(
            "duotone h-full w-full object-cover",
            imageClassName,
          )}
        />
        {/* manila wash — pulls the photograph into the paper palette */}
        <span
          className="pointer-events-none absolute inset-0 bg-[#efe8d8] mix-blend-color opacity-45"
          aria-hidden
        />
        <span
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#171a14]/45 via-transparent to-transparent"
          aria-hidden
        />
      </div>
      {caption && (
        <figcaption className="px-1 pt-2 text-[11px] tracking-[0.06em] text-ink-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
