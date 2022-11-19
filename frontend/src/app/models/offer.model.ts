export interface Offer {
  id: string,
  imdb_id: string,
  imdb_episode_id?: string,
  serie: boolean,
  tmdb?: string,
  tvdb?: string,
  title?: string,
  otitle?: string,
  original?: boolean,
  season?: string,
  episode?: string,
  episodetitle?: string,
  oepisodetitle?: string,
  year?: string,
  directors?: string,
  actors?: string,
  companies?: string,
  countries?: string,
  genres?: string,
  channel?: string,
  banners?: string,
  posters?: string,
  pid?: string,
  provider?: string,
  url?: string,
  seasonurl?: string,
  episodeurl?: string,
  language?: string,
  subtitles?: string,
  audio?: string,
  runtime?: string,
  fsk?: string,
}
