import { Injectable, Logger } from '@nestjs/common';
import { SpotifyService } from '../spotify/spotify.service';
import { GeneratePlaylistDto, Mood, EnergyLevel } from './dto/generate-playlist.dto';
import { Playlist } from './entities/playlist.entity';
import { TrackDto } from './dto/playlist-response.dto';
import { SpotifyTrack } from '../spotify/interfaces/spotify.interface';

@Injectable()
export class PlaylistsService {
  private readonly logger = new Logger(PlaylistsService.name);

  // Mood to Spotify audio features mapping
  private readonly moodToValence: Record<Mood, { min: number; max: number }> = {
    [Mood.HAPPY]: { min: 0.6, max: 1.0 },
    [Mood.SAD]: { min: 0.0, max: 0.4 },
    [Mood.ENERGETIC]: { min: 0.5, max: 1.0 },
    [Mood.CALM]: { min: 0.0, max: 0.5 },
    [Mood.ROMANTIC]: { min: 0.4, max: 0.8 },
    [Mood.FOCUSED]: { min: 0.3, max: 0.7 },
    [Mood.PARTY]: { min: 0.7, max: 1.0 },
    [Mood.CHILL]: { min: 0.0, max: 0.4 },
  };

  // Energy level to Spotify energy mapping
  private readonly energyLevelMapping: Record<EnergyLevel, { min: number; max: number }> = {
    [EnergyLevel.LOW]: { min: 0.0, max: 0.4 },
    [EnergyLevel.MEDIUM]: { min: 0.4, max: 0.7 },
    [EnergyLevel.HIGH]: { min: 0.7, max: 1.0 },
  };

  constructor(private readonly spotifyService: SpotifyService) {}

  /**
   * Generate a personalized playlist based on user preferences
   */
  async generatePlaylist(dto: GeneratePlaylistDto): Promise<Playlist> {
    this.logger.log(`Generating playlist with mood: ${dto.mood}`);

    try {
      // Map mood and energy level to Spotify parameters
      const spotifyParams = this.mapToSpotifyParams(dto);

      // Get recommended tracks from Spotify
      const recommendedTracks = await this.spotifyService.getRecommendations(
        spotifyParams,
      );

      // If we need more tracks or want specific duration, search for additional tracks
      let tracks = recommendedTracks;
      const targetDuration = dto.duration ? dto.duration * 60 * 1000 : null;

      if (targetDuration) {
        tracks = await this.adjustPlaylistDuration(
          recommendedTracks,
          targetDuration,
          dto,
        );
      }

      // Convert Spotify tracks to DTOs
      const trackDtos = this.mapTracksToDto(tracks);

      // Calculate total duration
      const totalDurationMs = trackDtos.reduce(
        (sum, track) => sum + track.durationMs,
        0,
      );

      // Generate playlist name and description
      const name = this.generatePlaylistName(dto);
      const description = this.generatePlaylistDescription(dto);

      return new Playlist({
        name,
        description,
        tracks: trackDtos,
        totalDurationMs,
        totalDurationMinutes: Math.round(totalDurationMs / 60000),
        trackCount: trackDtos.length,
        mood: dto.mood,
        genres: dto.genres,
        energyLevel: dto.energyLevel,
      });
    } catch (error) {
      this.logger.error('Failed to generate playlist', error);
      throw error;
    }
  }

  /**
   * Map user preferences to Spotify recommendation parameters
   */
  private mapToSpotifyParams(dto: GeneratePlaylistDto) {
    const params: any = {
      limit: 20,
    };

    // Set genres
    if (dto.genres && dto.genres.length > 0) {
      params.seed_genres = dto.genres.slice(0, 5); // Spotify allows max 5 seed genres
    }

    // Set valence based on mood
    const valenceRange = this.moodToValence[dto.mood];
    params.min_valence = valenceRange.min;
    params.max_valence = valenceRange.max;

    // Set energy based on energy level or mood
    if (dto.energyLevel) {
      const energyRange = this.energyLevelMapping[dto.energyLevel];
      params.min_energy = energyRange.min;
      params.max_energy = energyRange.max;
    } else {
      // Default energy based on mood
      if ([Mood.ENERGETIC, Mood.PARTY].includes(dto.mood)) {
        params.min_energy = 0.7;
        params.max_energy = 1.0;
      } else if ([Mood.CALM, Mood.CHILL, Mood.SAD].includes(dto.mood)) {
        params.min_energy = 0.0;
        params.max_energy = 0.4;
      }
    }

    return params;
  }

  /**
   * Adjust playlist to match target duration
   */
  private async adjustPlaylistDuration(
    initialTracks: SpotifyTrack[],
    targetDuration: number,
    dto: GeneratePlaylistDto,
  ): Promise<SpotifyTrack[]> {
    let tracks = [...initialTracks];
    let currentDuration = tracks.reduce((sum, track) => sum + track.duration_ms, 0);

    // If we need more tracks
    if (currentDuration < targetDuration) {
      const additionalTracks = await this.spotifyService.getRecommendations({
        ...this.mapToSpotifyParams(dto),
        limit: 50, // Get more tracks to choose from
      });

      // Add tracks until we reach target duration
      for (const track of additionalTracks) {
        if (tracks.find((t) => t.id === track.id)) continue; // Skip duplicates

        if (currentDuration + track.duration_ms <= targetDuration * 1.1) {
          tracks.push(track);
          currentDuration += track.duration_ms;
        }

        if (currentDuration >= targetDuration) break;
      }
    }

    // If we have too many tracks, trim to target duration
    if (currentDuration > targetDuration) {
      const trimmed: SpotifyTrack[] = [];
      let duration = 0;

      for (const track of tracks) {
        if (duration + track.duration_ms <= targetDuration) {
          trimmed.push(track);
          duration += track.duration_ms;
        } else {
          break;
        }
      }

      tracks = trimmed;
    }

    return tracks;
  }

  /**
   * Map Spotify tracks to TrackDto
   */
  private mapTracksToDto(tracks: SpotifyTrack[]): TrackDto[] {
    return tracks.map((track) => ({
      id: track.id,
      name: track.name,
      artists: track.artists.map((artist) => artist.name),
      album: track.album.name,
      durationMs: track.duration_ms,
      spotifyUrl: track.external_urls.spotify,
      albumImageUrl: track.album.images[0]?.url || null,
      previewUrl: track.preview_url,
    }));
  }

  /**
   * Generate playlist name based on preferences
   */
  private generatePlaylistName(dto: GeneratePlaylistDto): string {
    const moodNames: Record<Mood, string> = {
      [Mood.HAPPY]: 'Happy',
      [Mood.SAD]: 'Melancholic',
      [Mood.ENERGETIC]: 'Energetic',
      [Mood.CALM]: 'Calm',
      [Mood.ROMANTIC]: 'Romantic',
      [Mood.FOCUSED]: 'Focus',
      [Mood.PARTY]: 'Party',
      [Mood.CHILL]: 'Chill',
    };

    const genrePart = dto.genres && dto.genres.length > 0
      ? dto.genres[0].charAt(0).toUpperCase() + dto.genres[0].slice(1)
      : 'Music';

    return `${moodNames[dto.mood]} ${genrePart} Playlist`;
  }

  /**
   * Generate playlist description
   */
  private generatePlaylistDescription(dto: GeneratePlaylistDto): string {
    const parts: string[] = [];

    parts.push(`A personalized ${dto.mood} playlist`);

    if (dto.genres && dto.genres.length > 0) {
      parts.push(`featuring ${dto.genres.join(', ')} music`);
    }

    if (dto.energyLevel) {
      parts.push(`with ${dto.energyLevel} energy`);
    }

    if (dto.duration) {
      parts.push(`lasting approximately ${dto.duration} minutes`);
    }

    return parts.join(', ') + '.';
  }
}
