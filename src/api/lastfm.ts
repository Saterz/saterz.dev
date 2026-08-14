const LASTFM_URL = "https://ws.audioscrobbler.com/2.0"
const LASTFM_USERNAME = "Saterz_"

const apiKey = import.meta.env.VITE_LASTFM_API_KEY

type ImageSize = "small" | "medium" | "large" | "extralarge"

interface LastFmImage {
  size: ImageSize
  '#text': string
}

export function getLastFMImage(images: LastFmImage[], size: ImageSize) {
  return images.find((image) => image.size === size)?.["#text"]
}

export async function getRecentTracks(limit: number) {
  const response = await fetch(LASTFM_URL + `/?method=user.getrecenttracks&user=${LASTFM_USERNAME}&api_key=${apiKey}&limit=${limit}&format=json`)
  const data = await response.json()
  return data.recenttracks
}
