import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';

@Controller('followups')
export class FollowupsController {
  @Get()
  async listFollowups(@Query('workerId') workerId?: string) {
    return [
      {
        id: 'flw_1',
        patientId: 'pat_ramesh_patil',
        patientName: 'Ramesh Patil',
        assignedWorkerId: 'wrk_sunita_more',
        type: 'Post-Consultation & Referral Return',
        priority: 'HIGH',
        dueDate: '2026-09-04',
        status: 'DUE_TODAY',
        notes: 'Verify BP & medication compliance following Mulshi RH referral consultation.',
        village: 'Shivapur Sector 2',
      },
      {
        id: 'flw_2',
        patientId: 'pat_sunita_patil',
        patientName: 'Sunita Patil',
        assignedWorkerId: 'wrk_sunita_more',
        type: 'Maternal Care (ANC 2nd Trimester)',
        priority: 'PRIORITY',
        dueDate: '2026-09-04',
        status: 'DUE_TODAY',
        notes: 'Check hemoglobin, IFA tablet supply & blood pressure.',
        village: 'Shivapur Sector 2',
      },
      {
        id: 'flw_3',
        patientId: 'pat_parvati_patil',
        patientName: 'Parvati Patil',
        assignedWorkerId: 'wrk_sunita_more',
        type: 'Hypertension Community Check',
        priority: 'HIGH',
        dueDate: '2026-09-02',
        status: 'OVERDUE',
        notes: 'Record BP reading & check Amlodipine 5mg refill.',
        village: 'Shivapur Sector 2',
      },
    ];
  }

  @Put(':id/complete')
  async completeFollowup(@Param('id') id: string, @Body() body: any) {
    return {
      id,
      status: 'COMPLETED',
      outcome: body.outcome || 'Outreach completed successfully',
      completedAt: new Date().toISOString(),
    };
  }

  @Post()
  async createFollowup(@Body() body: any) {
    return {
      id: `flw_${Date.now()}`,
      ...body,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
  }
}
