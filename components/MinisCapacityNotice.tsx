import Callout from './Callout'

/**
 * Temporary notice while the 9:30 AM MINIs class is full.
 *
 * Kept as its own component so it can appear on more than one page (I'm New
 * now, the MINIs ministry page later) and be removed everywhere at once when
 * the class has room again.
 */
export default function MinisCapacityNotice() {
  return (
    <Callout tone="warning" title="9:30 AM MINIs is full">
      <p>
        Our 9:30 AM MINIs class (ages 2–6) isn&apos;t taking new kids right now. The 11:30 AM class always has
        room.
      </p>
    </Callout>
  )
}
