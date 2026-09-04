import { Controller, Post, Body } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('request-otp')
  async requestOtp(@Body('phoneNumber') phoneNumber: string) {
    return {
      status: 'OTP_SENT',
      phoneNumber,
      developmentOtp: '123456',
      message: 'Use development OTP 123456 for hackathon evaluation',
    };
  }

  @Post('verify-otp')
  async verifyOtp(
    @Body('phoneNumber') phoneNumber: string,
    @Body('otp') otp: string,
    @Body('role') role: string,
  ) {
    if (otp !== '123456') {
      return { status: 'ERROR', message: 'Invalid OTP code' };
    }

    return {
      status: 'SUCCESS',
      accessToken: `jwt_access_mock_${Date.now()}`,
      refreshToken: `jwt_refresh_mock_${Date.now()}`,
      user: {
        id: `usr_${Date.now()}`,
        phoneNumber,
        role: role || 'PATIENT',
      },
    };
  }
}
