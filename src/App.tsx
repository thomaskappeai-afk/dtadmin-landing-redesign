import { useEffect, useRef, useState } from 'react'
import { motion, MotionConfig, AnimatePresence, animate, useMotionValue, useTransform, useScroll, useSpring, useInView, useReducedMotion } from 'motion/react'
import { ArrowRight, ArrowUpRight, Check, Xmark, Calendar, Mail, Phone, MapPin, Link as LinkIcon, Database, Compass, Shop, Globe, Coins, StatsUpSquare, Building, Sparks, Menu } from 'iconoir-react'

const ease = [0.23, 1, 0.32, 1] as const
const reveal = { initial: { opacity: 0, y: 14 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-60px' }, transition: { duration: 0.45, ease } }

function Logo({ light = false }: { light?: boolean }) {
  // Officiële logobestanden uit de huisstijlgids v1.0: horizontaal (min. 200px) en de variant op donkere achtergrond (gestapeld, min. 120px).
  return light ? (
    <a href="#top" className="inline-block" aria-label="DT Admin, naar boven"><img src="./logo-donker.png" alt="DT Admin" width={160} height={122} className="h-auto w-[160px]" /></a>
  ) : (
    <a href="#top" className="inline-block py-2" aria-label="DT Admin, naar boven"><img src="./logo-horizontaal.png" alt="DT Admin" width={216} height={54} className="h-auto w-[200px] sm:w-[216px]" /></a>
  )
}

function Counter({ to }: { to: number }) {
  const v = useMotionValue(to * 0.86)
  const txt = useTransform(v, (x) => '€ ' + Math.round(x).toLocaleString('nl-NL'))
  useEffect(() => { const c = animate(v, to, { duration: 0.9, ease }); return () => c.stop() }, [to, v])
  return <motion.span className="tnum">{txt}</motion.span>
}

const channels = [
  { n: 'Shopify', omzet: 48200, marge: 31, w: 100 },
  { n: 'Bol', omzet: 29400, marge: 18, w: 61 },
  { n: 'Amazon', omzet: 15200, marge: 9, w: 32 },
]

function Dashboard() {
  const [tab, setTab] = useState<'maand' | 'kwartaal'>('maand')
  const bars = [38, 52, 44, 61, 57, 72, 66, 81, 74, 88, 79, 95]
  return (
    <div className="brackets relative">
      
      <div className="rounded-[28px] bg-navy p-2 shadow-[0_30px_60px_-20px_rgba(6,30,82,.45)]">
        <div className="rounded-[22px] bg-ink p-5 text-paper sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[14px] text-gold-light">Noordlijn · bedrijfsresultaat</p>
              <p className="font-display text-[40px] font-semibold leading-tight tracking-tight sm:text-[44px]"><Counter to={tab === 'maand' ? 12560 : 34910} /></p>
            </div>
            <div className="flex rounded-full bg-navy p-1 text-[14px]" role="tablist">
              {(['maand', 'kwartaal'] as const).map((t) => (
                <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className="relative rounded-full px-3 py-1.5 capitalize">
                  {tab === t && <motion.span layoutId="tab" className="absolute inset-0 rounded-full bg-gold" transition={{ duration: 0.25, ease }} />}
                  <span className={`relative ${tab === t ? 'text-ink font-medium' : 'text-paper'}`}>{t}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-5 flex h-28 items-end gap-1.5" aria-hidden>
            {bars.map((h, i) => (
              <motion.div className={`flex-1 rounded-md ${i === bars.length - 1 ? 'bg-gold' : 'bg-navy'}`} key={tab+i} initial={{ scaleY: 0.4 }} animate={{ scaleY: 1 }} style={{ height: `${h}%`, originY: 1 }} transition={{ duration: 0.6, delay: i * 0.025, ease }} />
            ))}
          </div>
          <div className="mt-5 space-y-3">
            {channels.map((c) => (
              <div key={c.n} className="grid grid-cols-[80px_1fr_auto] items-center gap-3 text-[14px]">
                <span className="text-paper">{c.n}</span>
                <div className="h-2 overflow-hidden rounded-full bg-navy"><motion.div className="h-full rounded-full bg-gold" initial={{ width: `${c.w * 0.7}%` }} animate={{ width: `${c.w}%` }} transition={{ duration: 0.7, ease }} /></div>
                <span className="tnum w-24 text-right text-paper">{c.marge}% marge</span>
              </div>
            ))}
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-navy p-3.5"><p className="text-[14px] text-gold-light">Btw-reserve</p><p className="tnum font-display text-xl font-semibold">€ 6.420</p></div>
            <div className="rounded-2xl bg-gold p-3.5 text-ink"><p className="text-[14px] text-ink">Vrij op te nemen</p><p className="tnum font-display text-xl font-semibold">€ 4.100</p></div>
          </div>
        </div>
      </div>
      <Ticker />
      <p className="mt-8 text-center text-[14px] text-muted sm:text-right">Voorbeeldcijfers, geen klantdata.</p>
    </div>
  )
}


function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const x = useSpring(scrollYProgress, { stiffness: 220, damping: 40, restDelta: 0.001 })
  return <motion.div className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gold" style={{ scaleX: x }} aria-hidden />
}

function InViewCounter({ to, prefix = '€ ' }: { to: number; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const v = useMotionValue(0)
  const txt = useTransform(v, (x) => prefix + Math.round(x).toLocaleString('nl-NL'))
  useEffect(() => { if (inView) { const c = animate(v, to, { duration: 1.1, ease }); return () => c.stop() } }, [inView, to, v])
  return <motion.span ref={ref} className="tnum">{txt}</motion.span>
}

const payouts = [
  ['Bol-uitbetaling geboekt', '07:42'],
  ['Stripe-payout gesplitst in omzet en kosten', '07:44'],
  ['Btw-reserve aangevuld met € 312', '07:45'],
  ['Amazon-settlement gecontroleerd', '07:47'],
]
function Ticker() {
  const [i, setI] = useState(0)
  const reduce = useReducedMotion()
  useEffect(() => { if (reduce) return; const t = setInterval(() => setI((x) => (x + 1) % payouts.length), 2600); return () => clearInterval(t) }, [reduce])
  return (
    <div className="absolute -bottom-6 -left-4 z-10 hidden h-[52px] w-[340px] overflow-hidden rounded-2xl border border-line bg-paper-2 shadow-[0_12px_30px_-12px_rgba(6,30,82,.35)] sm:block" aria-live="polite">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div key={i} initial={{ y: 26, opacity: 0, filter: 'blur(4px)' }} animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }} exit={{ y: -26, opacity: 0, filter: 'blur(4px)' }} transition={{ duration: 0.4, ease }} className="flex h-[52px] items-center gap-2.5 px-4 text-[14px] text-text">
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-gold text-ink"><Check width={16} height={16} /></span>
          <span className="flex-1 truncate">{payouts[i][0]}</span><span className="tnum text-muted">{payouts[i][1]}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function Marquee() {
  const reduce = useReducedMotion()
  const items = ['Shopify', 'Bol', 'Amazon', 'Mollie', 'Stripe', 'Bank', 'Belastingdienst', 'KvK']
  const row = [...items, ...items]
  return (
    <div className="border-y border-line bg-paper-2 py-5" aria-label="Wij koppelen met Shopify, Bol, Amazon, Mollie, Stripe en je bank">
      <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
        <motion.div className="flex w-max gap-12 pr-12" animate={reduce ? undefined : { x: ['0%', '-50%'] }} transition={{ duration: 28, ease: 'linear', repeat: Infinity }} aria-hidden>
          {row.map((t, k) => <span key={k} className="flex items-center gap-12 font-display text-[22px] font-bold text-navy">{t}<span className="size-2 rounded-full bg-gold" /></span>)}
        </motion.div>
      </div>
    </div>
  )
}

function Steps() {
  const ref = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 60%'] })
  const w = useSpring(scrollYProgress, { stiffness: 160, damping: 30 })
  return (
    <div className="relative">
      <div className="absolute left-7 right-7 top-[52px] hidden h-[3px] rounded-full bg-navy md:block" aria-hidden><motion.div className="h-full origin-left rounded-full bg-gold" style={{ scaleX: w }} /></div>
      <ol ref={ref} className="relative grid gap-4 md:grid-cols-3">
        {steps.map(([I, t, d], i) => (
          <motion.li key={t} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.5, delay: i * 0.12, ease }} whileHover={{ y: -6 }} className="rounded-3xl bg-navy p-7">
            <div className="flex items-center justify-between"><span className="grid size-12 place-items-center rounded-2xl bg-gold text-ink"><I width={24} height={24} /></span><span className="font-display text-[15px] text-gold-light tnum">0{i + 1}</span></div>
            <h3 className="mt-6 text-[26px] font-semibold">{t}</h3><p className="mt-2 text-paper">{d}</p>
          </motion.li>
        ))}
      </ol>
    </div>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  const links = [['Werkwijze', '#werkwijze'], ['Dashboard', '#dashboard'], ['Tarieven', '#tarieven'], ['Team', '#team'], ['Uitleg', '#uitleg']]
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper">
      <div className="mx-auto flex h-[84px] max-w-[1240px] items-center justify-between px-5 sm:px-8">
        <Logo />
        <nav className="hidden gap-7 text-[15px] text-muted lg:flex">{links.map(([l, h]) => <a key={h} href={h} className="transition-colors hover:text-ink">{l}</a>)}</nav>
        <div className="flex items-center gap-2">
          <a href="#contact" className="btn hidden rounded-full bg-ink px-4 py-2.5 text-[15px] font-medium text-paper hover:bg-ink-2 sm:inline-flex sm:items-center sm:gap-2"><Calendar width={18} height={18} />Plan een kennismaking</a>
          <button className="grid size-10 place-items-center rounded-full border border-line lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}><Menu width={20} height={20} /></button>
        </div>
      </div>
      {open && <nav className="border-t border-line px-5 py-3 lg:hidden">{links.map(([l, h]) => <a key={h} href={h} onClick={() => setOpen(false)} className="block py-2.5 text-[16px]">{l}</a>)}</nav>}
    </header>
  )
}

function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const dy = useTransform(scrollYProgress, [0, 1], [0, -80])
  const rot = useTransform(scrollYProgress, [0, 1], [0, -2])
  const stats = [['14 dagen', 'tot een live administratie'], ['Binnen 1 werkdag', 'reactie, meestal binnen een paar uur'], ['Maandelijks', 'opzegbaar, één maand termijn']]
  return (
    <section ref={ref} id="top" className="relative overflow-hidden">
      <div className="grain pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className="relative mx-auto grid max-w-[1240px] items-center gap-12 px-5 pb-16 pt-10 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-24 lg:pt-16">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-1.5 text-[14px] text-muted"><span className="size-2 rounded-full bg-navy" />Online boekhouder voor webshops</p>
          <h1 className="mt-5 text-[44px] font-semibold sm:text-[60px] lg:text-[72px]">De cijfers van je webshop, <span className="relative whitespace-nowrap"><span className="relative z-10">elke ochtend</span><span className="absolute inset-x-0 bottom-[0.08em] -z-0 h-[0.32em] rounded bg-gold" aria-hidden /></span> bij.</h1>
          <p className="mt-5 max-w-[34ch] text-[19px] leading-relaxed text-muted sm:text-[20px]">Voor ondernemers die verkopen via Shopify, Bol of Amazon. Wij doen de administratie en de aangiften, van eenmanszaak tot BV met holding.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#contact" className="btn inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3.5 text-[16px] font-medium text-paper hover:bg-ink-2">Plan een kennismaking <ArrowRight width={18} height={18} /></a>
            <a href="#dashboard" className="btn inline-flex items-center gap-2 rounded-full border border-navy bg-paper px-5 py-3.5 text-[16px] font-medium hover:bg-paper-2">Bekijk het dashboard</a>
          </div>
          <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-line pt-6">
            {stats.map(([a, b]) => <div key={a}><dt className="font-display text-[18px] font-semibold leading-tight sm:text-[22px]">{a}</dt><dd className="mt-1 text-[14px] leading-snug text-muted">{b}</dd></div>)}
          </dl>
        </div>
        <motion.div style={{ y: dy, rotate: rot }}><Dashboard /></motion.div>
      </div>
    </section>
  )
}

function DarkWrap({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 30%'] })
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1])
  const radius = useTransform(scrollYProgress, [0, 1], [48, 0])
  return <div ref={ref} className="px-0"><motion.div style={{ scale, borderRadius: radius }} className="overflow-hidden">{children}</motion.div></div>
}

function Section({ id, eyebrow, title, intro, children, dark = false }: { id?: string; eyebrow?: string; title: string; intro?: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <section id={id} className={dark ? 'bg-ink text-paper' : ''}>
      <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 lg:py-28">
        <motion.div {...reveal} className="max-w-[720px]">
          {eyebrow && <p className={`text-[15px] font-medium ${dark ? 'text-gold-light' : 'text-navy'}`}>{eyebrow}</p>}
          <h2 className="mt-2 text-[36px] font-semibold sm:text-[48px]">{title}</h2>
          {intro && <p className={`mt-4 text-[18px] ${dark ? 'text-paper' : 'text-muted'}`}>{intro}</p>}
        </motion.div>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  )
}

const pains = [
  ['Bonnetjes op zondag', 'De administratie wacht tot het weekend, omdat er doordeweeks niemand aan toekomt.'],
  ['Een boekhouder die je tools niet opent', 'Stripe, Mollie, Bol en Amazon leveren uitbetalingen, geen facturen. Wie dat niet inziet, boekt ze verkeerd.'],
  ['Eén pdf per jaar', 'Een jaarrekening achteraf zegt niet of een kanaal deze maand geld kost.'],
  ['Btw als verrassing', 'Btw die je in het buitenland moet afdragen, en geld dat Bol nog vasthoudt, horen in een maandelijkse reserve. Niet in een naheffing achteraf.'],
]
const steps = [
  [LinkIcon, 'Koppelen', 'Bank en uitbetalingen van Mollie, Stripe, Bol en Amazon komen in één administratie. Jij houdt je eigen login.'],
  [Database, 'Bijhouden', 'Wij boeken de regels, doen de aangiften en zetten het geld voor de btw apart.'],
  [Compass, 'Sturen', 'Elke maand praten we over marge, kas en wat je kunt opnemen of moet reserveren.'],
] as const
const result = [['Omzet', '92.800'], ['Inkoop', '−42.690'], ['Na inkoop', '50.110', 1], ['Advertenties', '−16.700'], ['Betaalkosten', '−2.230'], ['Verzending en opslag', '−7.420'], ['Overige kosten', '−11.200'], ['Bedrijfsresultaat', '12.560', 2], ['Per saldo te betalen', '6.420', 1]] as const
const multi = [
  [Globe, 'Verkoop aan consumenten in de EU', 'Verkoop je aan particulieren in andere EU-landen, of stuur je pakketten van buiten de EU tot €150, dan zetten we die btw elke maand apart. Je ziet het terug in het dashboard.'],
  [Coins, 'Uitbetalingen van Bol en Amazon', 'Geld dat Bol nog vasthoudt, en een Amazon-uitbetaling met commissie en verzending erin, splitsen we uit. Dat is niet zomaar omzet.'],
  [StatsUpSquare, 'Marge per kanaal', 'Shopify, Bol en Amazon naast elkaar, na advertenties en betaalkosten.'],
  [Building, 'Verkoop aan bedrijven in de EU', 'Factureer je een ondernemer in een ander EU-land, dan is die factuur meestal zonder Nederlandse btw. Wij doen de lijst die de Belastingdienst daarbij vraagt.'],
] as const
const plans = [
  ['Start', 'Eenmanszaak', '189', 'Je boekhouding, de btw-aangifte en je aangifte inkomstenbelasting.'],
  ['Vennoot', 'VOF', '229', 'Hetzelfde, voor een bedrijf met twee eigenaren, inclusief ieders aangifte inkomstenbelasting.'],
  ['BV', 'BV', '279', 'De belasting van de BV, de jaarrekening, het deponeren bij de KvK, en het loon dat je jezelf als directeur betaalt.'],
  ['Structuur', 'BV + holding', '429', 'Twee administraties: je werk-BV en de holding die de aandelen houdt, plus de belasting op dividend.'],
]
const quotes = [
  ['Ik zie nu per kanaal of een sale iets oplevert. Daarvoor kreeg ik één keer per jaar een map.', 'Lina Vos', 'Atelier Noord'],
  ['De Bol-uitbetalingen klopten eindelijk met de omzet. Dat had mijn vorige kantoor nooit uit elkaar gehaald.', 'Sam el Idrissi', 'Hull & Home'],
  ['We sturen een vraag en krijgen dezelfde week antwoord, in gewoon Nederlands.', 'Eva Bergman', 'Studio Berg'],
]
const articles = [
  ['Uitbetalingen', 'Hoe boek je een Bol-uitbetaling?'],
  ['EU-verkoop', 'Btw bij verkoop aan consumenten in de EU'],
  ['Rechtsvorm', 'Eenmanszaak of BV: wanneer overstappen?'],
  ['Uitbetalingen', 'Amazon-settlements uit elkaar halen'],
  ['Tarief', 'Wat zit er in het tarief, en wat niet?'],
  ['Sturen', 'Marge per kanaal: waar begin je?'],
]

function Cookie() {
  const [show, setShow] = useState(() => { try { return !localStorage.getItem('dt-cookie') } catch { return true } })
  if (!show) return null
  const close = () => { try { localStorage.setItem('dt-cookie', '1') } catch { /* */ } setShow(false) }
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.3, ease }} className="fixed bottom-3 left-3 right-3 z-50 flex items-center gap-3 rounded-2xl bg-ink px-4 py-2.5 text-[14px] text-paper shadow-lg sm:left-auto sm:max-w-[420px]">
      <span className="flex-1 leading-snug">Alleen functionele cookies. <a href="#privacy" className="underline underline-offset-2">Privacy</a></span>
      <button onClick={close} className="btn rounded-full bg-gold px-3.5 py-1.5 font-medium text-ink">Prima</button>
    </motion.div>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ScrollProgress />
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Section eyebrow="Het probleem" title="Herken je dit?" intro="De meeste online ondernemers herkennen minstens twee van deze vier.">
          <div className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-2">
            {pains.map(([t, d], i) => (
              <motion.div {...reveal} key={t} whileHover={{ backgroundColor: '#FFFFFF' }} className="bg-paper p-7 sm:p-9"><span className="font-display text-[15px] font-semibold text-navy tnum">0{i + 1}</span><h3 className="mt-3 text-[24px] font-semibold">{t}</h3><p className="mt-2 text-muted">{d}</p></motion.div>
            ))}
          </div>
        </Section>
        <DarkWrap><Section id="werkwijze" dark eyebrow="Werkwijze" title="Koppelen, bijhouden, sturen." intro="Geen jaarrapport achteraf. Een administratie die meeloopt met je uitbetalingen.">
          <Steps />
        </Section></DarkWrap>
        <Section id="dashboard" eyebrow="Dashboard" title="Zo ziet een ochtend eruit." intro="Noordlijn is een verzonnen woonwinkel op Shopify, Bol en Amazon. De cijfers zijn voorbeeld. De opbouw is dezelfde als bij een echte klant.">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
            <motion.div {...reveal} className="rounded-3xl bg-gold p-8 sm:p-10">
              <p className="text-[15px] font-medium">Bedrijfsresultaat · Noordlijn</p>
              <p className="mt-2 font-display text-[64px] font-semibold leading-none tracking-tight tnum sm:text-[80px]"><InViewCounter to={12560} /></p>
              <p className="mt-3 text-[17px]">Omzet € 92.800</p>
              <div className="mt-8 space-y-3">{channels.map((c) => <div key={c.n}><div className="flex justify-between text-[15px]"><span>{c.n}</span><span className="tnum">€ {c.omzet.toLocaleString('nl-NL')}</span></div><div className="mt-1 h-2.5 rounded-full bg-paper"><div className="h-full rounded-full bg-ink" style={{ width: `${c.w}%` }} /></div></div>)}</div>
              <p className="mt-8 text-[14px] text-ink">Voorbeeldcijfers, geen klantdata.</p>
            </motion.div>
            <motion.div {...reveal} className="rounded-3xl border border-line bg-paper p-6 sm:p-8">
              <p className="text-[15px] font-medium text-muted">Resultaat</p>
              <table className="mt-3 w-full text-[16px]"><caption className="sr-only">Cijfers in een tabel</caption><tbody>
                {result.map(([k, v, s]) => <tr key={k} className={`border-b border-line last:border-0 ${s === 2 ? 'font-semibold' : ''}`}><th scope="row" className={`py-3 text-left font-normal ${s ? 'font-medium' : 'text-muted'}`}>{k}</th><td className={`py-3 text-right tnum ${s === 2 ? 'text-navy text-[20px] font-display' : ''}`}>€ {v}</td></tr>)}
              </tbody></table>
            </motion.div>
          </div>
        </Section>
        <Section eyebrow="Meerdere kanalen" title="Gebouwd voor verkoop via meerdere kanalen." intro="Een gewone aangifte ziet één bedrag op je bank. Wij zien welk kanaal dat bedrag heeft gemaakt.">
          <div className="grid gap-x-10 gap-y-10 md:grid-cols-2">
            {multi.map(([I, t, d]) => <motion.div {...reveal} key={t} className="flex gap-5"><span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-line bg-paper-2"><I width={22} height={22} /></span><div><h3 className="text-[22px] font-semibold">{t}</h3><p className="mt-2 text-muted">{d}</p></div></motion.div>)}
          </div>
        </Section>
        <section id="tarieven" className="bg-paper-2">
          <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 lg:py-28">
            <motion.div {...reveal} className="max-w-[720px]"><p className="text-[15px] font-medium text-navy">Tarieven</p><h2 className="mt-2 text-[36px] font-semibold sm:text-[48px]">Een helder tarief per rechtsvorm.</h2><p className="mt-4 text-[17px] text-muted">Vanaf-prijzen bij 30 inkoopfacturen per maand, btw eens per kwartaal, één verkoopkanaal, twee manieren van betalen en omzet tot €25.000 per maand.</p></motion.div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {plans.map(([n, v, p, d]) => { const hot = n === 'BV'; return (
                <motion.div {...reveal} whileHover={{ y: -6 }} key={n} className={`relative flex flex-col rounded-3xl p-7 ${hot ? 'brackets bg-ink text-paper' : 'border border-line bg-paper'}`}>
                  <div className="flex items-start justify-between gap-2"><div><h3 className="text-[22px] font-semibold">{n}</h3><p className={`text-[15px] ${hot ? 'text-gold-light' : 'text-muted'}`}>{v}</p></div>{hot && <span className="whitespace-nowrap rounded-full bg-gold px-2.5 py-1 text-[14px] font-medium text-ink">Meest gekozen</span>}</div>
                  <p className="mt-6 font-display text-[48px] font-semibold leading-none tnum">€ {p}</p>
                  <p className={`mt-2 text-[14px] ${hot ? 'text-gold-light' : 'text-muted'}`}>per maand · excl. btw</p>
                  <p className={`mt-5 flex-1 text-[16px] ${hot ? 'text-paper' : 'text-muted'}`}>{d}</p>
                  <a href="#contact" className={`btn mt-6 inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-[15px] font-medium ${hot ? 'bg-gold text-ink' : 'border border-navy hover:bg-paper-2'}`}>Kennismaken <ArrowRight width={16} height={16} /></a>
                </motion.div>) })}
            </div>
            <div className="mt-6 flex flex-col gap-4 rounded-3xl border border-line bg-paper p-6 sm:flex-row sm:items-center sm:p-7">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gold"><Sparks width={22} height={22} /></span>
              <p className="flex-1 text-muted"><strong className="font-semibold text-ink">Virtual CFO.</strong> Iemand die met je meekijkt naar het geld is een aanvulling vanaf € 650 per maand. Het boekhoudprogramma rekenen we door, meestal €15–30 per administratie. Geen marge.</p>
            </div>
          </div>
        </section>
        <Section id="team" eyebrow="Team" title="Een klein team, geen dossiernummer." intro="Maud en Julian doen het werk zelf. Geen stagiair op je administratie, geen accountancy-jargon als antwoord.">
          <div className="grid gap-4 md:grid-cols-2">
            {[['MV', 'Maud Visser', 'Partner, fiscaal', 'Maud schrijft de aangiften en de jaarrekening in gewoon Nederlands. Ze komt uit een klassiek kantoor en miste daar de payouts van een webshop.'], ['JW', 'Julian de Wit', 'Partner, systemen', 'Julian koppelt bank, Shopify, Bol en Amazon aan de administratie. Als een settlement niet klopt, zoekt hij de regel, niet een excuus.']].map(([i, n, r, d]) => (
              <motion.div {...reveal} key={n} className="flex gap-5 rounded-3xl border border-line p-7"><span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-ink font-display text-[22px] font-semibold text-gold-light">{i}</span><div><h3 className="text-[24px] font-semibold">{n}</h3><p className="text-[15px] font-medium text-navy">{r}</p><p className="mt-3 text-muted">{d}</p></div></motion.div>
            ))}
          </div>
          <p className="mt-4 text-[14px] text-muted">De namen van de partners zijn placeholders tot de echte vennoten zijn ingevuld.</p>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {quotes.map(([q, n, c]) => <motion.figure {...reveal} key={n} className="flex flex-col rounded-3xl bg-paper-2 p-7"><blockquote className="flex-1 font-display text-[21px] font-medium leading-snug tracking-tight">“{q}”</blockquote><figcaption className="mt-6 text-[15px]"><span className="font-semibold">{n}</span> <span className="text-muted">· {c}</span></figcaption></motion.figure>)}
          </div>
          <p className="mt-4 text-[14px] text-muted">De citaten zijn placeholders, geen klantervaringen en geen beoordelingen.</p>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl bg-ink p-7 text-paper"><h3 className="text-[24px] font-semibold">Dit is voor jou als</h3><ul className="mt-5 space-y-3">{['Je verkoopt online en je omzet loopt via Mollie, Stripe, Shopify, Bol of Amazon.', 'Je wilt sturen op marge en kas, niet alleen een aangifte afvinken.', 'Je zit in een eenmanszaak, VOF of BV en wilt kunnen doorgroeien zonder van kantoor te wisselen.'].map((x) => <li key={x} className="flex gap-3"><Check className="mt-1 shrink-0 text-gold-light" width={20} height={20} />{x}</li>)}</ul></div>
            <div className="rounded-3xl border border-line p-7"><h3 className="text-[24px] font-semibold">Dit is niet voor jou als</h3><ul className="mt-5 space-y-3 text-muted">{['Je zoekt een controle-boekhouder voor een eenmanszaak zonder omzet.', 'Je wilt alles zelf blijven boeken en alleen een check achteraf.'].map((x) => <li key={x} className="flex gap-3"><Xmark className="mt-1 shrink-0" width={20} height={20} />{x}</li>)}</ul></div>
          </div>
        </Section>
        <Section id="uitleg" eyebrow="Uitleg" title="Uitleg waar je een webshop mee kunt sturen." intro="Korte artikelen over uitbetalingen, verkopen in andere EU-landen, je rechtsvorm en het tarief. Algemene uitleg, geen advies voor jouw aangifte.">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map(([c, t]) => <motion.a {...reveal} whileHover={{ y: -4 }} href="#uitleg" key={t} className="group flex min-h-[170px] flex-col justify-between rounded-3xl border border-line p-6 transition-colors hover:bg-paper-2"><span className="text-[14px] font-medium text-navy">{c}</span><span className="flex items-end justify-between gap-4"><span className="font-display text-[22px] font-semibold leading-tight tracking-tight">{t}</span><ArrowUpRight className="shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" width={22} height={22} /></span></motion.a>)}
          </div>
        </Section>
        <section id="contact" className="px-5 pb-20 sm:px-8">
          <motion.div {...reveal} className="relative mx-auto max-w-[1240px] overflow-hidden rounded-[32px] bg-ink px-7 py-14 text-paper sm:px-14 sm:py-20">
            <div className="brackets pointer-events-none absolute inset-8 sm:inset-10" aria-hidden />
            <div className="relative max-w-[640px]"><h2 className="text-[38px] font-semibold sm:text-[56px]">Klaar om je cijfers elke ochtend te zien?</h2><p className="mt-4 text-[18px] text-paper">Plan een kennismaking van 20 minuten. We kijken samen naar je kanalen en je huidige administratie.</p>
              <div className="mt-8 flex flex-wrap gap-3"><a href="mailto:hallo@dtadmin.nl?subject=Kennismaking" className="btn inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3.5 font-medium text-ink"><Calendar width={18} height={18} />Plan een kennismaking</a><a href="mailto:hallo@dtadmin.nl" className="btn inline-flex items-center gap-2 rounded-full border border-gold-light px-5 py-3.5 font-medium"><Mail width={18} height={18} />hallo@dtadmin.nl</a></div></div>
          </motion.div>
        </section>
      </main>
      <footer className="bg-ink text-paper">
        <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div><Logo light /><p className="mt-6 max-w-[30ch] text-[15px] text-paper">Administratie, aangiften en financieel inzicht voor webshops.</p></div>
          <div><h4 className="text-[15px] font-semibold text-gold-light">Diensten</h4><ul className="mt-3 space-y-2 text-[15px] text-paper"><li><a href="#tarieven">Tarieven</a></li><li><a href="#werkwijze">Werkwijze</a></li><li><a href="#dashboard">Dashboard</a></li><li><a href="#tarieven">Virtual CFO</a></li></ul></div>
          <div><h4 className="text-[15px] font-semibold text-gold-light">Contact</h4><ul className="mt-3 space-y-2 text-[15px] text-paper"><li className="flex gap-2"><Mail width={18} height={18} className="mt-0.5" />hallo@dtadmin.nl</li><li className="flex gap-2"><Phone width={18} height={18} className="mt-0.5" />[telefoonnummer]</li><li className="flex gap-2"><MapPin width={18} height={18} className="mt-0.5" />[adres]</li><li className="flex gap-2"><Shop width={18} height={18} className="mt-0.5" />KvK [nummer]</li></ul></div>
          <div><h4 className="text-[15px] font-semibold text-gold-light">Juridisch</h4><ul className="mt-3 space-y-2 text-[15px] text-paper"><li id="privacy"><a href="#privacy">Privacyverklaring</a></li><li><a href="#voorwaarden">Algemene voorwaarden</a></li><li><a href="#cookies">Cookies</a></li></ul></div>
        </div>
        <div className="mx-auto max-w-[1240px] border-t border-navy px-5 py-5 text-[14px] text-paper sm:px-8">© 2026 DT Admin B.V.</div>
      </footer>
      <Cookie />
    </MotionConfig>
  )
}
