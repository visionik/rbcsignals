interface VideoEmbedProps {
  url: string
  title?: string
  aspectRatio?: '16/9' | '4/3' | '1/1'
}

export function VideoEmbed({ url, title = 'Video', aspectRatio = '16/9' }: VideoEmbedProps) {
  // Extract video ID and provider
  const getEmbedUrl = (url: string): string | null => {
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/)
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`
    }

    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`
    }

    // Already an embed URL
    if (url.includes('/embed/')) {
      return url
    }

    return null
  }

  const embedUrl = getEmbedUrl(url)

  if (!embedUrl) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-600">
        Invalid video URL
      </div>
    )
  }

  const aspectRatioClass = {
    '16/9': 'aspect-video',
    '4/3': 'aspect-[4/3]',
    '1/1': 'aspect-square',
  }[aspectRatio]

  return (
    <div className={`relative w-full ${aspectRatioClass} rounded-lg overflow-hidden bg-gray-900`}>
      <iframe
        src={embedUrl}
        title={title}
        className="absolute inset-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}
