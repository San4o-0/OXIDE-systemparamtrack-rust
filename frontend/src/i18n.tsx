import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Lang = 'uk' | 'en'
export const LANGS: Lang[] = ['uk', 'en']
const KEY = 'oxide.lang'

type Dict = Record<string, string>

const DICT: Record<Lang, Dict> = {
  uk: {
    'mark.kind': 'телеметрія',
    'face.cores': '{n} ядер',
    'signal.on': 'сигнал',
    'signal.off': 'немає зв’язку',
    overheat: 'перегрів',
    'theme.paper': 'папір',
    'theme.steel': 'сталь',
    'theme.aria': 'Перемкнути тему',
    'lang.aria': 'Змінити мову',
    'load.cpu': 'навантажити CPU',
    'load.ram': 'навантажити RAM',
    'load.stop': 'зупинити · {n}с',
    'standby.title': 'очікування сигналу',
    'standby.body': 'Потоку ще немає. Запусти бекенд — і трек оживе щосекунди.',
    'hero.head': 'загальне навантаження',
    'hero.temp': 'температура',
    'hero.peak': 'пік за {n}с',
    'hero.tick': 'такт',
    'hero.tickValue': '1.00 с',
    'vital.disks': 'Томи',
    'vital.cpu.sub': '{n} логічних ядер',
    'vital.cpu.subTemp': '{n} ядер · {t}°C',
    'vital.swap.sub': 'усього {x}',
    'vital.disks.sub': 'змонтованих',
    'panel.cpu': 'CPU · трек',
    'panel.ram': 'RAM · трек',
    'panel.net': 'Мережа',
    'panel.cores': 'Масив ядер',
    'panel.volumes': 'Томи',
    'note.samples': '{n} відліків · %',
    'note.matrix': 'ядро × час · {n}с · {k} логічних',
    'note.volumes': 'зайнято / усього',
    'net.rx': 'приймання',
    'net.tx': 'передавання',
    'matrix.waiting': 'Очікування відліків…',
    'disks.empty': 'Томів не знайдено.',
    colophon: 'OXIDE · приладова телеметрія',
  },
  en: {
    'mark.kind': 'telemetry',
    'face.cores': '{n} cores',
    'signal.on': 'signal',
    'signal.off': 'no signal',
    overheat: 'overheat',
    'theme.paper': 'paper',
    'theme.steel': 'steel',
    'theme.aria': 'Toggle theme',
    'lang.aria': 'Change language',
    'load.cpu': 'load CPU',
    'load.ram': 'load RAM',
    'load.stop': 'stop · {n}s',
    'standby.title': 'waiting for signal',
    'standby.body': 'No stream yet. Start the backend and the trace comes alive every second.',
    'hero.head': 'global load',
    'hero.temp': 'temperature',
    'hero.peak': 'peak / {n}s',
    'hero.tick': 'tick',
    'hero.tickValue': '1.00 s',
    'vital.disks': 'Volumes',
    'vital.cpu.sub': '{n} logical cores',
    'vital.cpu.subTemp': '{n} cores · {t}°C',
    'vital.swap.sub': 'total {x}',
    'vital.disks.sub': 'mounted',
    'panel.cpu': 'CPU · trace',
    'panel.ram': 'RAM · trace',
    'panel.net': 'Network',
    'panel.cores': 'Core array',
    'panel.volumes': 'Volumes',
    'note.samples': '{n} samples · %',
    'note.matrix': 'core × time · {n}s · {k} logical',
    'note.volumes': 'used / total',
    'net.rx': 'download',
    'net.tx': 'upload',
    'matrix.waiting': 'Waiting for samples…',
    'disks.empty': 'No volumes found.',
    colophon: 'OXIDE · instrument telemetry',
  },
}

export function readLang(): Lang {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === 'uk' || saved === 'en') return saved
  } catch {
    void 0
  }
  const nav = typeof navigator !== 'undefined' ? navigator.language.toLowerCase() : 'en'
  return nav.startsWith('uk') ? 'uk' : 'en'
}

type TParams = Record<string, string | number>

interface I18n {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: string, params?: TParams) => string
}

const I18nContext = createContext<I18n | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(readLang)

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem(KEY, lang)
    } catch {
      void 0
    }
  }, [lang])

  const t = (key: string, params?: TParams) => {
    let s = DICT[lang][key] ?? DICT.en[key] ?? key
    if (params) {
      for (const k of Object.keys(params)) s = s.replace(`{${k}}`, String(params[k]))
    }
    return s
  }

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>
}

export function useI18n(): I18n {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
