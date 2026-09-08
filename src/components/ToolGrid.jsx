import ToolCard from './ToolCard'

export default function ToolGrid({ tools, onOpen }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
      {tools.map((tool) => (
        <ToolCard key={tool.key ?? tool.id} tool={tool} onOpen={onOpen} />
      ))}
    </div>
  )
}
