import Button from './ui/Button'
import IconTile from './ui/IconTile'

/** Mirrors the Figma `ToolCard` component. */
export default function ToolCard({ tool, onOpen }) {
  return (
    <article className="group flex h-full flex-col rounded-lg border border-line bg-surface p-5 shadow-xs transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-md">
      <IconTile icon={tool.icon} color={tool.color} />
      <h3 className="t-h4 mt-4 text-ink">{tool.name}</h3>
      <p className="t-body-sm mt-1.5 text-ink-2">{tool.desc}</p>
      <Button
        variant="secondary"
        className="mt-5 w-full group-hover:border-line-strong"
        onClick={() => onOpen(tool.id)}
      >
        Open Tool
      </Button>
    </article>
  )
}
