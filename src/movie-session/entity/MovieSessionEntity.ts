import { ApiProperty } from '@nestjs/swagger'
import { Currency, MovieSession } from '@prisma/client'
import { Type } from 'class-transformer'
import { IsDate, IsEnum, IsInt, IsString } from 'class-validator'
import { CurrencyEnum } from '../../utils/types'

export class MovieSessionEntity implements MovieSession {
  constructor(movieSession: MovieSession) {
    this.id = movieSession.id
    this.startDate = movieSession.startDate
    this.endDate = movieSession.endDate
    this.movieId = movieSession.movieId
    this.cinemaId = movieSession.cinemaId
    this.price = movieSession.price
    this.currency = movieSession.currency
  }

  @IsInt()
  @ApiProperty({ example: 1 })
  id: number

  @Type(() => Date)
  @IsDate()
  @ApiProperty({ example: '2023-03-24T10:25:01.504Z' })
  startDate: Date

  @IsDate()
  @Type(() => Date)
  @ApiProperty()
  endDate: Date

  @IsInt()
  @ApiProperty({ example: 1 })
  movieId: number

  @IsInt()
  @ApiProperty({ example: 1 })
  cinemaId: number

  @IsInt()
  @ApiProperty({ example: 40 })
  price: number

  @IsString()
  @IsEnum(Currency)
  @ApiProperty({
    enumName: 'CurrencyEnum',
    enum: CurrencyEnum,
    example: CurrencyEnum.USD,
  })
  currency: Currency
}