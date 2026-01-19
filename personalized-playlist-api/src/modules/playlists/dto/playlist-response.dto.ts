import { ApiProperty } from '@nestjs/swagger';

export class TrackDto {
  @ApiProperty({ example: '4uLU6hMCjMI75M1A2tKUQC' })
  id: string;

  @ApiProperty({ example: 'Blinding Lights' })
  name: string;

  @ApiProperty({
    example: ['The Weeknd'],
    type: [String],
  })
  artists: string[];

  @ApiProperty({ example: 'After Hours' })
  album: string;

  @ApiProperty({ example: 200000 })
  durationMs: number;

  @ApiProperty({
    example: 'https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC',
    nullable: true,
  })
  spotifyUrl: string;

  @ApiProperty({
    example: 'https://i.scdn.co/image/...',
    nullable: true,
  })
  albumImageUrl: string | null;

  @ApiProperty({
    example: 'https://p.scdn.co/mp3-preview/...',
    nullable: true,
  })
  previewUrl: string | null;
}

export class PlaylistResponseDto {
  @ApiProperty({ example: 'Happy Pop Playlist' })
  name: string;

  @ApiProperty({ example: 'A personalized playlist based on your preferences' })
  description: string;

  @ApiProperty({ type: [TrackDto] })
  tracks: TrackDto[];

  @ApiProperty({ example: 3600000 })
  totalDurationMs: number;

  @ApiProperty({ example: 60 })
  totalDurationMinutes: number;

  @ApiProperty({ example: 20 })
  trackCount: number;
}
