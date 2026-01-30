#!/usr/bin/env bun
import { randomBytes } from 'node:crypto'
import { mkdir, writeFile, access, readFile } from 'node:fs/promises'
import { join } from 'node:path'

const title = process.argv.slice(2).join(' ').trim()
if (!title) {
  console.error('Usage: new-card-id.js "Short title"')
  process.exit(1)
}

const slugChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const bytes = randomBytes(6)

let slug = ''
for (const b of bytes) {
  slug += slugChars[b % slugChars.length]
}

const safeTitle =
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'card'

const cardId = `REF-${slug}-${safeTitle}`
const cardsDir = join(process.cwd(), '.sdlc', 'plan', 'cards')
const filename = `${cardId}.md`
const filepath = join(cardsDir, filename)
const templatePath = join(
  process.cwd(),
  '.claude',
  'skills',
  'planning',
  'references',
  'card-template.md',
)

await mkdir(cardsDir, { recursive: true })

try {
  await access(filepath)
  console.error(`Card already exists: ${filepath}`)
  process.exit(1)
} catch {
  // File does not exist, continue.
}

const today = new Date().toISOString().slice(0, 10)
const template = await readFile(templatePath, 'utf8')
const content = template
  .replace(/^# Card Template/m, `# Card: ${title}`)
  .replace(/^Card ID:.*$/m, `Card ID: ${cardId}`)
  .replace(/^Title:.*$/m, `Title: ${title}`)
  .replace(/^Last updated:.*$/m, `Last updated: ${today}`)

await writeFile(filepath, content, 'utf8')
console.log(join('.sdlc', 'plan', 'cards', filename))
