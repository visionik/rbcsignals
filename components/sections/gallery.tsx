'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface GalleryProps {
  images: Array<{
    src: string
    alt: string
    caption?: string
  }>
  columns?: 2 | 3 | 4
}

export function Gallery({ images, columns = 3 }: GalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  }

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
  }

  const closeLightbox = () => {
    setLightboxIndex(null)
  }

  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % images.length)
    }
  }

  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + images.length) % images.length)
    }
  }

  return (
    <>
      <div className={`grid grid-cols-1 ${gridCols[columns]} gap-4`}>
        {images.map((image, index) => (
          <div
            key={index}
            className="group relative aspect-video rounded-lg overflow-hidden cursor-pointer"
            onClick={() => openLightbox(index)}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-sm">{image.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            onClick={closeLightbox}
          >
            <X className="h-8 w-8" />
          </button>

          <button
            className="absolute left-4 text-white text-4xl hover:text-gray-300 transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              prevImage()
            }}
          >
            ‹
          </button>

          <button
            className="absolute right-4 text-white text-4xl hover:text-gray-300 transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              nextImage()
            }}
          >
            ›
          </button>

          <div className="max-w-7xl max-h-[90vh] flex flex-col items-center">
            {images[lightboxIndex] && (
              <>
                <img
                  src={images[lightboxIndex].src}
                  alt={images[lightboxIndex].alt}
                  className="max-w-full max-h-[80vh] object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
                {images[lightboxIndex].caption && (
                  <p className="text-white text-center mt-4 text-lg">
                    {images[lightboxIndex].caption}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
