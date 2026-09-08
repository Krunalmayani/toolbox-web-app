import Placeholder from './Placeholder'
import {
  CronParser,
  DiffChecker,
  HashGenerator,
  JsonFormatter,
  JwtDecoder,
  RegexTester,
  UrlEncoder,
} from './developer'
import {
  CaseConverter,
  LoremIpsum,
  MarkdownPreview,
  RemoveDuplicates,
  SlugGenerator,
  TextSorter,
  WordCounter,
} from './text'
import {
  FakeDataGenerator,
  GradientGenerator,
  MetaTagGenerator,
  PasswordGenerator,
  QrCodeGenerator,
  UuidGenerator,
} from './generators'
import { Base64Encoder, ColorPicker } from './converters'
import {
  BackgroundRemover,
  ColorExtractor,
  FaviconGenerator,
  FormatConverter,
  ImageCompressor,
  ImageCropper,
  ImageResizer,
  ImageToBase64,
} from './image'

/** Maps a catalogue id to the panel rendered inside the tool modal. */
const REGISTRY = {
  'json-formatter': JsonFormatter,
  'regex-tester': RegexTester,
  'jwt-decoder': JwtDecoder,
  'url-encoder': UrlEncoder,
  'hash-generator': HashGenerator,
  'cron-parser': CronParser,
  'diff-checker': DiffChecker,
  'text-diff': DiffChecker,

  'word-counter': WordCounter,
  'case-converter': CaseConverter,
  'remove-duplicates': RemoveDuplicates,
  'text-sorter': TextSorter,
  'slug-generator': SlugGenerator,
  'lorem-ipsum': LoremIpsum,
  'markdown-preview': MarkdownPreview,

  'password-generator': PasswordGenerator,
  'uuid-generator': UuidGenerator,
  'qr-code-generator': QrCodeGenerator,
  'gradient-generator': GradientGenerator,
  'meta-tag-generator': MetaTagGenerator,
  'fake-data-generator': FakeDataGenerator,

  'base64-encoder': Base64Encoder,
  'color-picker': ColorPicker,

  'image-compressor': ImageCompressor,
  'image-resizer': ImageResizer,
  'image-cropper': ImageCropper,
  'format-converter': FormatConverter,
  'color-extractor': ColorExtractor,
  'image-to-base64': ImageToBase64,
  'background-remover': BackgroundRemover,
  'favicon-generator': FaviconGenerator,
}

export const getToolComponent = (id) => REGISTRY[id] ?? Placeholder
