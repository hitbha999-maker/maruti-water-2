import { useState } from 'react'

/** The sequence every system on the site follows, largest to smallest. */
export const DEFAULT_STAGES = [
  { n: 1, name: 'Sediment', detail: 'Sand, silt and rust are taken out first. On plants this is a sand-and-pebble bed in an FRP vessel; on a domestic cabinet it is a spun PP cartridge.' },
  { n: 2, name: 'Carbon', detail: 'Granular activated carbon and a carbon block adsorb chlorine, odour and organic matter — mainly to protect the membrane, which chlorine destroys.' },
  { n: 3, name: 'Pre-filter', detail: 'A finer polish before the membrane. On the plants this is the 20" big-blue jumbo housing carrying PP and CTO cartridges.' },
  { n: 4, name: 'High-pressure pump', detail: 'The membrane only works under pressure. Domestic units use a small booster; plants use a multi-stage vertical pump.' },
  { n: 5, name: 'RO membrane', detail: 'The separation stage. Dissolved salts, hardness and heavy metals stay on the reject side. Element size scales with capacity: 4021, then 4040, then 8040.' },
  { n: 6, name: 'UV / UF', detail: 'Fitted on the models that carry it. UV inactivates bacteria and cysts; UF is a hollow-fibre backstop that keeps working without power.' },
  { n: 7, name: 'Alkaline / mineral', detail: 'RO strips minerals along with everything else. The alkaline cartridge puts taste and mineral balance back before the water reaches the tap.' },
  { n: 8, name: 'Storage & delivery', detail: 'A food-grade tank, a pressure tank or a plant buffer, then the tap. Storage size is what decides whether the system ever feels slow.' },
]

export default function StageDiagram({ invert = false, stages = DEFAULT_STAGES }) {
  const [active, setActive] = useState(4)
  const st = stages[active]

  const line = invert ? 'bg-white/12' : 'bg-line'
  const text = invert ? 'text-white' : 'text-ink'
  const dim = invert ? 'text-white/50' : 'text-muted'

  return (
    <div>
      <div className="relative h-2.5 overflow-hidden rounded-full">
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, #a3792f 0%, #8f8a4a 16%, #6f9a86 34%, #2f8fc4 52%, #4fd8e4 70%, #a8ecf4 86%, #eafbff 100%)',
          }}
        />
      </div>
      <div className={`mt-2 flex justify-between text-[11.5px] font-medium ${dim}`}>
        <span>Raw feed water</span>
        <span>At the tap</span>
      </div>

      <div className="relative mt-8">
        <div className={`absolute top-6 right-6 left-6 hidden h-px md:block ${line}`} />
        <ol className="relative grid grid-cols-4 gap-y-6 md:grid-cols-8 md:gap-0">
          {stages.map((s, i) => {
            const on = i === active
            return (
              <li key={s.n} className="flex flex-col items-center text-center">
                <button
                  onClick={() => setActive(i)}
                  aria-pressed={on}
                  aria-label={`Stage ${s.n}: ${s.name}`}
                  className={`relative grid h-12 w-12 place-items-center rounded-full border font-display text-[14px] font-bold transition-all duration-400 ${
                    on
                      ? invert
                        ? 'scale-110 border-transparent bg-white text-black'
                        : 'scale-110 border-transparent bg-blue text-white'
                      : invert
                        ? 'border-white/20 bg-steel text-white/70 hover:border-white/60'
                        : 'border-line bg-white/5 text-muted hover:border-white/40 hover:text-ink'
                  }`}
                  style={{ transitionTimingFunction: 'var(--ease-out-quint)' }}
                >
                  {s.n}
                  {on && (
                    <span
                      className={`absolute inset-0 rounded-full ${invert ? 'bg-white' : 'bg-blue'} animate-pulse-ring`}
                    />
                  )}
                </button>
                <span
                  className={`mt-3 max-w-[96px] font-display text-[12.5px] leading-tight font-semibold ${
                    on ? text : dim
                  }`}
                >
                  {s.name}
                </span>
              </li>
            )
          })}
        </ol>
      </div>

      <div
        className={`mt-8 rounded-3xl border p-6 md:p-7 ${
          invert ? 'border-white/12 bg-white/[0.04]' : 'border-line bg-mist'
        }`}
      >
        <p className={`eyebrow ${invert ? 'text-white/40' : 'text-muted-2'}`}>
          Stage {st.n} of {stages.length}
        </p>
        <h3 className={`display-3 mt-3 ${invert ? 'text-white' : ''}`}>{st.name}</h3>
        <p className={`mt-3 max-w-2xl text-[15px] leading-relaxed ${dim}`}>{st.detail}</p>
      </div>
    </div>
  )
}
