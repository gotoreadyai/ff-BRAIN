// path: src/features/pack/PackLoader.tsx

import { type ChangeEvent } from 'react'

type PackLoaderProps = {
  onZipUpload: (file: File) => Promise<void>
}

export default function PackLoader({ onZipUpload }: PackLoaderProps) {
  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    await onZipUpload(f)
    e.target.value = ''
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="w-[480px] bg-white rounded-3xl p-10 shadow-2xl border border-gray-100">
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mb-6 shadow-lg">
            <span className="text-4xl">💪</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            FitPack AI
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            Inteligentny trener z reinforcement learning
          </p>

          {/* Upload button */}
          <label className="w-full cursor-pointer group">
            <div className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-3">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <span>Wgraj FitPack (ZIP)</span>
            </div>
            <input
              type="file"
              accept=".zip"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {/* Info */}
          <div className="mt-8 p-4 bg-purple-50 rounded-xl border border-purple-100">
            <p className="text-sm text-purple-900 font-medium mb-2">
              📦 Co to jest FitPack?
            </p>
            <ul className="text-xs text-purple-700 space-y-1 text-left">
              <li>• Kompletny program treningowy w ZIP</li>
              <li>• AI dostosowuje intensywność do Twoich postępów</li>
              <li>• Automatyczna prewencja kontuzji</li>
              <li>• Adaptacja do poziomu snu i regeneracji</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
