import { Module } from '@nestjs/common';
import { SyncController } from './sync.controller';
import { AuthController } from './auth.controller';
import { TriageController } from './triage.controller';
import { ReferralsController } from './referrals.controller';
import { PatientsController } from './patients.controller';
import { FacilitiesController } from './facilities.controller';
import { AppointmentsController } from './appointments.controller';
import { FollowupsController } from './followups.controller';

@Module({
  imports: [],
  controllers: [
    AuthController,
    SyncController,
    TriageController,
    ReferralsController,
    PatientsController,
    FacilitiesController,
    AppointmentsController,
    FollowupsController,
  ],
  providers: [],
})
export class AppModule {}
