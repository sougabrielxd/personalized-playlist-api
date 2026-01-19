export interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{
    id: string;
    name: string;
  }>;
  album: {
    id: string;
    name: string;
    images: Array<{
      url: string;
      height: number;
      width: number;
    }>;
  };
  duration_ms: number;
  external_urls: {
    spotify: string;
  };
  preview_url: string | null;
}

export interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrack[];
    total: number;
    limit: number;
    offset: number;
  };
}

export interface SpotifyRecommendationsResponse {
  tracks: SpotifyTrack[];
  seeds: Array<{
    initialPoolSize: number;
    afterFilteringSize: number;
    afterRelinkingSize: number;
    id: string;
    type: string;
    href: string;
  }>;
}

export interface SpotifyRecommendationsParams {
  seed_genres?: string[];
  seed_artists?: string[];
  seed_tracks?: string[];
  limit?: number;
  min_energy?: number;
  max_energy?: number;
  min_valence?: number;
  max_valence?: number;
  min_tempo?: number;
  max_tempo?: number;
  target_duration_ms?: number;
}
