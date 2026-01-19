import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PlaylistsService } from './playlists.service';
import { GeneratePlaylistDto } from './dto/generate-playlist.dto';
import { PlaylistResponseDto } from './dto/playlist-response.dto';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';

@ApiTags('Playlists')
@Controller('api/playlists')
@UseGuards(ApiKeyGuard)
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @Post('generate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Generate a personalized playlist',
    description:
      'Generate a personalized music playlist based on mood, genre, energy level, and duration preferences.',
  })
  @ApiResponse({
    status: 200,
    description: 'Playlist generated successfully',
    type: PlaylistResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request parameters',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing API key',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiBearerAuth('api-key')
  async generate(@Body() dto: GeneratePlaylistDto): Promise<PlaylistResponseDto> {
    return this.playlistsService.generatePlaylist(dto);
  }
}
