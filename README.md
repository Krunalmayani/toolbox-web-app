# ToolBox

A one-page tools web app built with React + Vite, implemented from the ToolBox Figma design.

**Live:** _see deployment URL_
**Design:** https://www.figma.com/design/JxyxlxiS8ChgcEf5Z8IEyL

## What it is

A single-page catalogue of 40 browser-based utilities. Everything runs client-side —
there is no backend, no database and no authentication.

- Sticky header with logo, category nav, search and a dark-mode toggle
- Hero with a large search bar and popular-search chips
- Seven category tabs (All, Text, Developer, Image, PDF, Generator, Converter)
- Five tool sections — Popular, Developer, Text, Image, Generators
- Tool cards open a centred modal containing the working tool interface
- Responsive desktop / tablet / mobile layouts; the modal becomes a bottom sheet on mobile

## Stack

| | |
|---|---|
| Framework | React 18 + Vite 6 (JavaScript) |
| Styling | Tailwind CSS v4, CSS-variable design tokens |
| Icons | lucide-react |
| Extra | `qrcode`, lazy-loaded only when the QR tool opens |

## Design tokens

`src/index.css` holds the colour, radius and shadow tokens ported from the Figma
variable collections. Light values sit on `:root` and the dark theme re-declares the
same token names under `.dark`, so components never need `dark:` variants.

## Structure

```
src/
  components/        page sections (Header, Hero, CategoryTabs, ToolCard, ToolModal, Footer)
    ui/              primitives mirroring the Figma components (Button, IconTile, Chip, Field)
  tools/             the tool panels rendered inside the modal, grouped by domain
    index.js         id -> panel registry
  data/tools.js      the tool catalogue, sections and nav content
  lib/               small helpers (clipboard, download, canvas, colour maths)
  hooks/             useDarkMode, useLockBodyScroll
```

## Commands

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
npm run preview  # serve the production build
```

## Tool coverage

31 of the 33 catalogue entries are fully implemented client-side. **PDF Merger** and
**Barcode Generator** show their designed panel with an explicit "not wired up" state —
their engines would need a heavyweight dependency (PDF writing, barcode symbologies)
that was left out to keep the bundle small.
