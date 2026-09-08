/**
 * Single source of truth for the tool catalogue.
 *
 * `TOOLS` is keyed by id so a tool can appear in several sections (exactly as
 * it does in the Figma file — e.g. JSON Formatter sits in both Popular Tools
 * and Developer Tools) without the copy being duplicated.
 */

export const CATEGORIES = [
  'All',
  'Text',
  'Developer',
  'Image',
  'PDF',
  'Generator',
  'Converter',
]

export const TOOLS = {
  'json-formatter': {
    name: 'JSON Formatter',
    desc: 'Beautify, minify and validate JSON in one click.',
    icon: 'Braces',
    color: 'blue',
    category: 'Developer',
  },
  'image-compressor': {
    name: 'Image Compressor',
    desc: 'Shrink PNG and JPG files without visible quality loss.',
    icon: 'Image',
    color: 'emerald',
    category: 'Image',
  },
  'password-generator': {
    name: 'Password Generator',
    desc: 'Create strong, random passwords with custom rules.',
    icon: 'KeyRound',
    color: 'rose',
    category: 'Generator',
  },
  'word-counter': {
    name: 'Word Counter',
    desc: 'Count words, characters, sentences and reading time.',
    icon: 'BookOpen',
    color: 'violet',
    category: 'Text',
  },
  'base64-encoder': {
    name: 'Base64 Encoder',
    desc: 'Encode or decode text and files to Base64 instantly.',
    icon: 'Lock',
    color: 'amber',
    category: 'Converter',
  },
  'color-picker': {
    name: 'Color Picker',
    desc: 'Pick colors and convert between HEX, RGB and HSL.',
    icon: 'Droplet',
    color: 'cyan',
    category: 'Converter',
  },
  'qr-code-generator': {
    name: 'QR Code Generator',
    desc: 'Turn any link or text into a downloadable QR code.',
    icon: 'QrCode',
    color: 'violet',
    category: 'Generator',
  },
  'pdf-merger': {
    name: 'PDF Merger',
    desc: 'Combine multiple PDF files into a single document.',
    icon: 'FileText',
    color: 'rose',
    category: 'PDF',
  },

  'regex-tester': {
    name: 'Regex Tester',
    desc: 'Test patterns against sample text with live matches.',
    icon: 'Code2',
    color: 'violet',
    category: 'Developer',
  },
  'jwt-decoder': {
    name: 'JWT Decoder',
    desc: 'Inspect header, payload and expiry of any token.',
    icon: 'KeyRound',
    color: 'amber',
    category: 'Developer',
  },
  'uuid-generator': {
    name: 'UUID Generator',
    desc: 'Generate v4 UUIDs in bulk and copy them instantly.',
    icon: 'Terminal',
    color: 'emerald',
    category: 'Generator',
  },
  'url-encoder': {
    name: 'URL Encoder',
    desc: 'Encode and decode URLs and query parameters.',
    icon: 'Link2',
    color: 'cyan',
    category: 'Converter',
  },
  'hash-generator': {
    name: 'Hash Generator',
    desc: 'Create SHA-1, SHA-256 and SHA-512 hashes from text.',
    icon: 'Lock',
    color: 'rose',
    category: 'Developer',
  },
  'cron-parser': {
    name: 'Cron Parser',
    desc: 'Translate cron expressions into plain English.',
    icon: 'Clock',
    color: 'blue',
    category: 'Developer',
  },
  'diff-checker': {
    name: 'Diff Checker',
    desc: 'Compare two blocks of text side by side.',
    icon: 'Copy',
    color: 'violet',
    category: 'Developer',
  },

  'case-converter': {
    name: 'Case Converter',
    desc: 'Switch between camel, snake, kebab and title case.',
    icon: 'Type',
    color: 'blue',
    category: 'Text',
  },
  'lorem-ipsum': {
    name: 'Lorem Ipsum',
    desc: 'Generate placeholder paragraphs, words or lists.',
    icon: 'Sparkles',
    color: 'amber',
    category: 'Generator',
  },
  'text-diff': {
    name: 'Text Diff',
    desc: 'Highlight what changed between two versions.',
    icon: 'Copy',
    color: 'emerald',
    category: 'Text',
  },
  'remove-duplicates': {
    name: 'Remove Duplicates',
    desc: 'Strip repeated lines and tidy up long lists.',
    icon: 'CheckCheck',
    color: 'cyan',
    category: 'Text',
  },
  'markdown-preview': {
    name: 'Markdown Preview',
    desc: 'Write Markdown and see the rendered result live.',
    icon: 'BookOpen',
    color: 'rose',
    category: 'Text',
  },
  'slug-generator': {
    name: 'Slug Generator',
    desc: 'Turn any headline into a clean URL slug.',
    icon: 'Link2',
    color: 'blue',
    category: 'Text',
  },
  'text-sorter': {
    name: 'Text Sorter',
    desc: 'Sort lines alphabetically, numerically or randomly.',
    icon: 'SlidersHorizontal',
    color: 'violet',
    category: 'Text',
  },

  'image-resizer': {
    name: 'Image Resizer',
    desc: 'Set exact dimensions or scale by percentage.',
    icon: 'Ruler',
    color: 'blue',
    category: 'Image',
  },
  'image-cropper': {
    name: 'Image Cropper',
    desc: 'Crop to a ratio or draw a custom selection.',
    icon: 'Crop',
    color: 'violet',
    category: 'Image',
  },
  'format-converter': {
    name: 'Format Converter',
    desc: 'Convert between PNG, JPG and WebP.',
    icon: 'Repeat',
    color: 'amber',
    category: 'Converter',
  },
  'color-extractor': {
    name: 'Color Extractor',
    desc: 'Pull a palette of dominant colors from any image.',
    icon: 'Palette',
    color: 'rose',
    category: 'Image',
  },
  'image-to-base64': {
    name: 'Image to Base64',
    desc: 'Turn images into inline data URIs for the web.',
    icon: 'Image',
    color: 'cyan',
    category: 'Converter',
  },
  'background-remover': {
    name: 'Background Remover',
    desc: 'Cut out the subject and export a clean PNG.',
    icon: 'Droplet',
    color: 'violet',
    category: 'Image',
  },
  'favicon-generator': {
    name: 'Favicon Generator',
    desc: 'Produce every favicon size from one source file.',
    icon: 'Upload',
    color: 'blue',
    category: 'Image',
  },

  'gradient-generator': {
    name: 'Gradient Generator',
    desc: 'Design CSS gradients and copy the snippet.',
    icon: 'Palette',
    color: 'cyan',
    category: 'Generator',
  },
  'meta-tag-generator': {
    name: 'Meta Tag Generator',
    desc: 'Build Open Graph and SEO tags for any page.',
    icon: 'Globe',
    color: 'blue',
    category: 'Generator',
  },
  'fake-data-generator': {
    name: 'Fake Data Generator',
    desc: 'Mock names, emails and addresses for testing.',
    icon: 'BookOpen',
    color: 'violet',
    category: 'Generator',
  },
  'barcode-generator': {
    name: 'Barcode Generator',
    desc: 'Create EAN, UPC and Code 128 barcodes.',
    icon: 'SlidersHorizontal',
    color: 'emerald',
    category: 'Generator',
  },
}

export const SECTIONS = [
  {
    id: 'popular',
    title: 'Popular Tools',
    subtitle: 'The utilities people reach for most often this week.',
    tint: false,
    tools: [
      'json-formatter',
      'image-compressor',
      'password-generator',
      'word-counter',
      'base64-encoder',
      'color-picker',
      'qr-code-generator',
      'pdf-merger',
    ],
  },
  {
    id: 'developer',
    title: 'Developer Tools',
    subtitle: 'Format, inspect and convert the things you ship.',
    tint: true,
    tools: [
      'json-formatter',
      'regex-tester',
      'jwt-decoder',
      'uuid-generator',
      'url-encoder',
      'hash-generator',
      'cron-parser',
      'diff-checker',
    ],
  },
  {
    id: 'text',
    title: 'Text Tools',
    subtitle: 'Clean up, count and transform copy in seconds.',
    tint: false,
    tools: [
      'word-counter',
      'case-converter',
      'lorem-ipsum',
      'text-diff',
      'remove-duplicates',
      'markdown-preview',
      'slug-generator',
      'text-sorter',
    ],
  },
  {
    id: 'image',
    title: 'Image Tools',
    subtitle: 'Resize, convert and optimise images in the browser.',
    tint: true,
    tools: [
      'image-compressor',
      'image-resizer',
      'image-cropper',
      'format-converter',
      'color-extractor',
      'image-to-base64',
      'background-remover',
      'favicon-generator',
    ],
  },
  {
    id: 'generators',
    title: 'Generators',
    subtitle: 'Create the data, assets and boilerplate you need.',
    tint: false,
    tools: [
      'password-generator',
      'qr-code-generator',
      'uuid-generator',
      'lorem-ipsum',
      'gradient-generator',
      'meta-tag-generator',
      'fake-data-generator',
      'barcode-generator',
    ],
  },
]

/** Flat, de-duplicated list used by search and category filtering. */
export const ALL_TOOLS = Object.entries(TOOLS).map(([id, tool]) => ({ id, ...tool }))

export const POPULAR_SEARCHES = [
  'JSON Formatter',
  'Image Compressor',
  'Password Generator',
  'Word Counter',
]

export const NAV_LINKS = [
  { label: 'Text', category: 'Text' },
  { label: 'Developer', category: 'Developer' },
  { label: 'Image', category: 'Image' },
  { label: 'PDF', category: 'PDF' },
  { label: 'Generators', category: 'Generator' },
  { label: 'Converters', category: 'Converter' },
]

export const FOOTER_GROUPS = [
  {
    heading: 'Categories',
    links: ['Text Tools', 'Developer Tools', 'Image Tools', 'PDF Tools', 'Generators'],
  },
  {
    heading: 'Popular',
    links: ['JSON Formatter', 'Password Generator', 'Image Compressor', 'QR Code Generator'],
  },
  { heading: 'Company', links: ['About', 'Changelog', 'Roadmap', 'Contact'] },
  { heading: 'Legal', links: ['Privacy', 'Terms', 'Cookies'] },
]
