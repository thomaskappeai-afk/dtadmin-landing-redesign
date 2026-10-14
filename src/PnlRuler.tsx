import { useEffect, useState } from 'react'
import { motion, AnimatePresence, animate, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'

/** Noordlijn-voorbeeld (zelfde cijfers als het dashboard). Vpb 19% over € 12.560 → € 2.386 → netto € 10.174. */
export const pnl = [
  { label: 'Omzet', amount: 92800, kind: 'total' as const },
  { label: 'Inkoop', amount: -42690, kind: 'cost' as const },
  { label: 'Brutowinst', amount: 50110, kind: 'total' as const },
  { label: 'Advertenties', amount: -16700, kind: 'cost' as const },
  { label: 'Betaalkosten', amount: -2230, kind: 'cost' as const },
  { label: 'Verzending', amount: -7420, kind: 'cost' as const },
  { label: 'Overige', amount: -11200, kind: 'cost' as const },
  { label: 'Bedrijfsresultaat', amount: 12560, kind: 'total' as const },
  { label: 'Vpb 19%', amount: -2386, kind: 'cost' as const },
  { label: 'Nettowinst', amount: 10174, kind: 'net' as const },
]
const N = pnl.length
const fmt = (x: number) => (x < 0 ? '−€ ' : '€ ') + Math.abs(Math.round(x)).toLocaleString('nl-NL')
const ease = [0.23, 1, 0.32, 1] as const

function usePnl() {
  const { scrollYProgress } = useScroll()
  const reduce = useReducedMotion()
  const smooth = useSpring(scrollYProgress, { stiffness: 180, damping: 32, restDelta: 0.0005 })
  const p = reduce ? scrollYProgress : smooth
  const [idx, setIdx] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (v) => setIdx(Math.min(N - 1, Math.max(0, Math.round(v * (N - 1))))))
  const amount = useMotionValue(pnl[0].amount)
  useEffect(() => {
    const to = pnl[idx].amount
    if (reduce) { amount.set(to); return }
    const c = animate(amount, to, { duration: 0.4, ease }); return () => c.stop()
  }, [idx, reduce, amount])
  const text = useTransform(amount, fmt)
  return { p, idx, text, reduce }
}

const jump = (i: number) => {
  const max = Math.max(1, document.documentElement.scrollHeight - innerHeight)
  scrollTo({ top: (i / (N - 1)) * max, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
}

/** Desktop: vaste P&amp;L-liniaal in de rechtergutter (content heeft lg:pr-[5.5rem]). */
export function PnlRuler() {
  const { p, idx, text, reduce } = usePnl()
  const top = useTransform(p, (v) => `${v * 100}%`)
  const done = idx === N - 1
  return (
    <aside aria-label="Voorbeeld winst-en-verliesrekening, loopt mee met het scrollen" className="pnl-ruler fixed right-0 top-[calc(50%+56px)] z-30 hidden h-[min(52vh,520px)] w-[8rem] -translate-y-1/2 pr-3 lg:block">
      <div className="relative h-full">
        <div className="absolute right-[13px] top-0 h-full w-[2px] rounded-full bg-line" aria-hidden />
        <motion.div className="absolute right-[13px] top-0 w-[2px] origin-top rounded-full bg-navy" style={{ height: top }} aria-hidden />
        {pnl.map((r, i) => (
          <button key={r.label} type="button" onClick={() => jump(i)} title={`${r.label}: ${fmt(r.amount)}`} aria-label={`Ga naar ${r.label}`}
            className="absolute right-0 flex h-5 w-full -translate-y-1/2 items-center justify-end pr-[6px]" style={{ top: `${(i / (N - 1)) * 100}%` }}>
            <span className={`block h-[2px] rounded-full transition-[width] duration-300 ${r.kind !== 'cost' ? 'w-5' : 'w-3'} ${i < idx ? 'bg-navy' : i === idx ? 'bg-gold' : 'bg-line'}`} />
          </button>
        ))}
        <motion.div className="pointer-events-none absolute right-[5px] -translate-y-1/2" style={{ top }} aria-hidden>
          <motion.span className="block size-[18px] rounded-full border-[3px] border-paper bg-gold shadow-[0_2px_8px_rgba(6,30,82,.35)]"
            animate={done && !reduce ? { scale: [1, 1.4, 0.94, 1] } : { scale: 1 }} transition={{ duration: 0.55, ease }} />
        </motion.div>
        <div className="absolute inset-x-0 top-0 -translate-y-[calc(100%+10px)] rounded-xl border border-line bg-paper-2 px-2.5 py-2 text-right shadow-[0_8px_20px_-12px_rgba(6,30,82,.45)]" data-done={done ? '1' : '0'}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.p key={pnl[idx].label} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: reduce ? 0 : 0.22, ease }}
              className={`whitespace-nowrap text-[14px] font-medium leading-tight ${done ? 'text-navy' : 'text-muted'}`}>{pnl[idx].label}</motion.p>
          </AnimatePresence>
          <motion.p className={`tnum mt-0.5 text-[14px] font-semibold leading-tight text-navy`}>{text}</motion.p>
          <p className="mt-1 text-[14px] leading-none text-muted">voorbeeld</p>
        </div>
      </div>
      <p className="sr-only" aria-live="polite">{pnl[idx].label} {fmt(pnl[idx].amount)}</p>
    </aside>
  )
}

/** Mobiel: compacte balk in de sticky header — geen rechterliniaal (te smal, overlapt CTAs). */
export function PnlStrip() {
  const { p, idx, text } = usePnl()
  const done = idx === N - 1
  return (
    <div className="relative flex h-8 items-center justify-between gap-3 border-t border-line bg-paper-2 px-4 text-[14px] lg:hidden" role="status" aria-label="Voorbeeld winst-en-verliesrekening">
      <span className="min-w-0 truncate text-muted">Voorbeeld · <span className={`font-medium ${done ? 'text-navy' : 'text-text'}`}>{pnl[idx].label}</span></span>
      <motion.span className="tnum shrink-0 font-semibold text-navy">{text}</motion.span>
      <motion.span className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-gold" style={{ scaleX: p }} aria-hidden />
    </div>
  )
}
