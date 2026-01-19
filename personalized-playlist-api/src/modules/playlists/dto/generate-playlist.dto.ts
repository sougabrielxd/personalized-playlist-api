import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  Min,
  Max,
  IsArray,
  ArrayMinSize,
} from 'class-validator';

export enum Mood {
  HAPPY = 'happy',
  SAD = 'sad',
  ENERGETIC = 'energetic',
  CALM = 'calm',
  ROMANTIC = 'romantic',
  FOCUSED = 'focused',
  PARTY = 'party',
  CHILL = 'chill',
}

export enum EnergyLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export class GeneratePlaylistDto {
  @ApiProperty({
    description: 'Mood of the playlist',
    enum: Mood,
    example: Mood.HAPPY,
  })
  @IsEnum(Mood)
  mood: Mood;

  @ApiProperty({
    description: 'Music genre(s)',
    example: ['pop', 'rock'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  genres?: string[];

  @ApiProperty({
    description: 'Energy level of the playlist',
    enum: EnergyLevel,
    example: EnergyLevel.MEDIUM,
    required: false,
  })
  @IsOptional()
  @IsEnum(EnergyLevel)
  energyLevel?: EnergyLevel;

  @ApiProperty({
    description: 'Desired duration in minutes',
    example: 60,
    minimum: 5,
    maximum: 300,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(5)
  @Max(300)
  duration?: number;
}
