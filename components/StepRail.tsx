interface Step {
  heading: string
  detail: string
}

interface StepRailProps {
  steps: Step[]
}

/**
 * Numbered steps laid out left to right, joined by a hairline that runs through
 * the circles.
 *
 * The line is drawn as two half-width segments either side of each circle
 * rather than one line spanning the row: the first step hides its left half and
 * the last hides its right, so the rail stops at the end circles instead of
 * running off into whitespace.
 *
 * Every item is the same shape — rail, heading, detail — so all five headings
 * sit on one baseline. An earlier version hung the connector below the circle
 * and omitted it on the final step, which pushed that step's text up by the
 * height of the missing connector.
 */
export default function StepRail({ steps }: StepRailProps) {
  return (
    <ol className="flex flex-col lg:flex-row gap-10 lg:gap-0 list-none p-0 m-0">
      {steps.map((step, i) => (
        <li key={step.heading} className="lg:flex-1 flex flex-col items-center text-center gap-3">
          <div className="relative flex items-center justify-center w-full h-10">
            {/* Hidden on the stacked layout, where there is no row to join. */}
            <span
              aria-hidden
              className={`hidden lg:block absolute left-0 top-1/2 h-px w-1/2 bg-[#E5E7EB] ${
                i === 0 ? 'lg:hidden' : ''
              }`}
            />
            <span
              aria-hidden
              className={`hidden lg:block absolute right-0 top-1/2 h-px w-1/2 bg-[#E5E7EB] ${
                i === steps.length - 1 ? 'lg:hidden' : ''
              }`}
            />
            <span className="relative w-10 h-10 rounded-full bg-[#0066FF] text-white font-bold flex items-center justify-center shrink-0">
              {i + 1}
            </span>
          </div>
          <div className="flex flex-col gap-1 px-3">
            <h3 className="font-bold text-base text-[#1E2024]">{step.heading}</h3>
            <p className="text-sm text-[#6B7280]">{step.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
