import { Controller, Post, HttpCode, HttpStatus, Res, Body, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { Public, GetCurrentUserId, GetCurrentUser } from './decorators'
import { SigninDto, SignupDto, TokensDto } from './dto'
import { RtGuard } from './guards'
import { Tokens } from './utils/types'
import { Response } from 'express'

@Controller('auth')
@ApiTags('Authorization')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ description: 'Signup locally' })
  @ApiOkResponse({ type: TokensDto })
  async signupLocal(@Res({ passthrough: true }) res: Response, @Body() dto: SignupDto): Promise<Tokens> {
    const { access_token, refresh_token } = await this.authService.signupLocal(dto)

    this.authService.addTokensToCookies(res, access_token, refresh_token)

    return { access_token, refresh_token }
  }

  @Public()
  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Signin locally' })
  @ApiOkResponse({ type: TokensDto })
  async signinLocal(@Res({ passthrough: true }) res: Response, @Body() dto: SigninDto): Promise<Tokens> {
    const { access_token, refresh_token } = await this.authService.signinLocal(dto)

    this.authService.addTokensToCookies(res, access_token, refresh_token)

    return { access_token, refresh_token }
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('local/refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Refresh tokens' })
  @ApiOkResponse({ type: TokensDto })
  async refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Tokens> {
    const { access_token, refresh_token } = await this.authService.refreshTokens(userId, refreshToken)

    this.authService.addTokensToCookies(res, access_token, refresh_token)

    return { refresh_token, access_token }
  }

  @Post('local/logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Logout' })
  @ApiOkResponse()
  async logout(@GetCurrentUserId() userId: number, @Res({ passthrough: true }) res: Response): Promise<boolean> {
    const isLogout = await this.authService.logout(userId)

    this.authService.clearCookies(res)

    return isLogout
  }
}