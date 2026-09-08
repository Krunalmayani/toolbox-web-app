import { useMemo, useState } from 'react'
import { SearchX } from 'lucide-react'
import Header from './components/Header'
import Hero from './components/Hero'
import CategoryTabs from './components/CategoryTabs'
import ToolSection from './components/ToolSection'
import ToolGrid from './components/ToolGrid'
import ToolModal from './components/ToolModal'
import Footer from './components/Footer'
import Button from './components/ui/Button'
import useDarkMode from './hooks/useDarkMode'
import { ALL_TOOLS, SECTIONS, TOOLS } from './data/tools'

export default function App() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [openTool, setOpenTool] = useState(null)
  const [dark, toggleDark] = useDarkMode()

  const filtering = query.trim().length > 0 || category !== 'All'

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return ALL_TOOLS.filter((tool) => {
      const matchesCategory = category === 'All' || tool.category === category
      const matchesQuery =
        !needle ||
        tool.name.toLowerCase().includes(needle) ||
        tool.desc.toLowerCase().includes(needle) ||
        tool.category.toLowerCase().includes(needle)
      return matchesCategory && matchesQuery
    })
  }, [query, category])

  const reset = () => {
    setQuery('')
    setCategory('All')
  }

  const scrollToResults = () => {
    document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div id="top" className="min-h-dvh bg-canvas">
      <Header
        query={query}
        onQuery={setQuery}
        onCategory={(next) => {
          setCategory(next)
          scrollToResults()
        }}
        dark={dark}
        onToggleDark={toggleDark}
      />

      <main>
        <Hero query={query} onQuery={setQuery} onSubmit={scrollToResults} />

        <CategoryTabs
          value={category}
          onChange={(next) => {
            setCategory(next)
            scrollToResults()
          }}
        />

        <div id="tools" className="scroll-mt-[124px]">
          {filtering ? (
            <section className="bg-canvas">
              <div className="gutter">
                <div className="shell py-12 lg:py-16">
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <h2 className="t-h1 text-ink">
                        {category === 'All' ? 'Search results' : `${category} Tools`}
                      </h2>
                      <p className="t-body mt-1 text-ink-2">
                        {results.length} tool{results.length === 1 ? '' : 's'}
                        {query.trim() ? ` matching “${query.trim()}”` : ''}.
                      </p>
                    </div>
                    <Button variant="secondary" onClick={reset}>
                      Clear filters
                    </Button>
                  </div>

                  <div className="mt-7">
                    {results.length ? (
                      <ToolGrid tools={results} onOpen={setOpenTool} />
                    ) : (
                      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-line-strong bg-subtle px-6 py-16 text-center">
                        <SearchX size={22} className="text-ink-3" />
                        <p className="t-h4 text-ink">No tools match that search</p>
                        <p className="t-body-sm max-w-[360px] text-ink-2">
                          Try a different keyword, or browse everything from the All tab.
                        </p>
                        <Button variant="secondary" className="mt-1" onClick={reset}>
                          Show all tools
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          ) : (
            SECTIONS.map((section) => (
              <ToolSection
                key={section.id}
                section={section}
                tools={section.tools.map((id) => ({
                  id,
                  key: `${section.id}-${id}`,
                  ...TOOLS[id],
                }))}
                onOpen={setOpenTool}
                onViewAll={() => {
                  setCategory('All')
                  setQuery('')
                  scrollToResults()
                }}
              />
            ))
          )}
        </div>
      </main>

      <Footer />

      <ToolModal toolId={openTool} onClose={() => setOpenTool(null)} />
    </div>
  )
}
