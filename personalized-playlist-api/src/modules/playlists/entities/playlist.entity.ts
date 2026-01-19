import { TrackDto } from '../dto/playlist-response.dto';

export class Playlist {
  name: string;
  description: string;
  tracks: TrackDto[];
  totalDurationMs: number;
  totalDurationMinutes: number;
  trackCount: number;
  mood: string;
  genres?: string[];
  energyLevel?: string;
  createdAt: Date;

  constructor(partial: Partial<Playlist>) {
    Object.assign(this, partial);
    this.createdAt = new Date();
  }
}
