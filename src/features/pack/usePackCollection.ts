// path: src/features/pack/usePackCollection.ts

import { useEffect, useState } from 'react'
import { getAllPacks, addPack, removePack, type PackRecord } from '../../engine/db'
import { loadZip } from '../../engine/pack'
import type { Pack } from '../../engine/model'

export function usePackCollection() {
  const [packs, setPacks] = useState<PackRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load all packs from DB on mount
  useEffect(() => {
    ;(async () => {
      try {
        const loaded = await getAllPacks()
        setPacks(loaded)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  // Get the first pack (for MVP we only support one active pack)
  const activePack: Pack | undefined = packs.length
    ? { manifest: packs[0].manifest, files: packs[0].files }
    : undefined

  async function handleAddZip(file: File) {
    const pack = await loadZip(file)
    const title = file.name.replace(/\.zip$/i, '')
    const record = await addPack(pack, title)
    setPacks(prev => [...prev, record])
  }

  async function handleAddZipFromUrl(url: string) {
    const res = await fetch(url)
    if (!res.ok) throw new Error('Failed to fetch pack')
    const blob = await res.blob()
    const fileName = url.split('/').pop() || 'remote-pack.zip'
    const file = new File([blob], fileName, { type: 'application/zip' })
    await handleAddZip(file)
  }

  async function handleRemovePack(id: string) {
    await removePack(id)
    setPacks(prev => prev.filter(p => p.id !== id))
  }

  return {
    packs,
    activePack,
    isLoading,
    addZip: handleAddZip,
    addZipFromUrl: handleAddZipFromUrl,
    removePack: handleRemovePack
  }
}
