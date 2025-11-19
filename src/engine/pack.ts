// path: src/engine/pack.ts

import JSZip from 'jszip'
import type { Pack, FitManifest } from './model'

/**
 * Loads a FitPack from a ZIP file
 * Expected structure:
 * - manifest.json (required)
 * - workouts/*.json
 * - phases/*.md
 * - exercises/*.md
 * - meals/*.json
 * - recovery/*.md
 * - covers/*.jpg
 */
export async function loadZip(file: File): Promise<Pack> {
  const zip = await JSZip.loadAsync(file)

  // Load manifest
  const manifestRaw = await mustRead(zip, 'manifest.json')
  const manifest: FitManifest = JSON.parse(manifestRaw)

  // Load all files
  const files: Record<string, string> = {}

  await Promise.all(
    Object.keys(zip.files).map(async (path) => {
      const entry = zip.file(path)
      if (!entry || entry.dir) return

      const ext = path.split('.').pop()?.toLowerCase()

      // Text files
      if (ext === 'md' || ext === 'json' || ext === 'txt') {
        const content = await entry.async('string')
        files['/' + path.replace(/^\//, '')] = content
        return
      }

      // Image files
      if (ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'webp' || ext === 'gif') {
        const blob = await entry.async('blob')
        const dataUrl = await blobToDataURL(blob)
        files['/' + path.replace(/^\//, '')] = dataUrl
        return
      }
    })
  )

  return { manifest, files }
}

async function mustRead(zip: JSZip, path: string): Promise<string> {
  const f = zip.file(path) || zip.file('/' + path)
  if (!f) throw new Error(`Missing required file: ${path}`)
  return f.async('string')
}

function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}
