/**
 * Consistent section heading with precision aesthetic.
 * Features: calibration mark line + heading + optional subtitle.
 */
export default function SectionHeading({ heading, subtitle }) {
  return (
    <div className="mx-auto max-w-2xl">
      {/* Calibration mark */}
      <div className="mb-6 flex items-center gap-4">
        <div className="h-px w-10 bg-sapphire/50" />
        <div className="h-1 w-1 rounded-full bg-sapphire" />
        <div className="h-px w-0.5 bg-sapphire/30" />
      </div>

      <h2 className="font-heading text-3xl font-bold tracking-precision text-graphite-900 sm:text-4xl lg:text-5xl">
        {heading}
      </h2>

      {subtitle && (
        <p className="mt-5 max-w-xl text-base leading-relaxed text-graphite-500 sm:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}
