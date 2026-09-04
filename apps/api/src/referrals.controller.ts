import { Controller, Post, Get, Param, Body } from '@nestjs/common';

@Controller('referrals')
export class ReferralsController {
  @Post()
  async createReferral(@Body() body: any) {
    const code = `REF-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    return {
      id: `ref_${Date.now()}`,
      referralCode: code,
      patientId: body.patientId || 'pat_ramesh_patil',
      sourceFacilityId: body.sourceFacilityId || 'fac_shivapur_phc',
      destinationFacilityId: body.destinationFacilityId || 'fac_mulshi_rh',
      referringDoctorId: body.referringDoctorId || 'doc_ananya_deshmukh',
      reason: body.reason || 'Escalation required due to persistent fever & hypoxia',
      priority: body.priority || 'HIGH',
      currentState: 'CREATED',
      createdAt: new Date().toISOString(),
    };
  }

  @Post(':id/transition')
  async transitionState(
    @Param('id') id: string,
    @Body('nextState') nextState: string,
    @Body('notes') notes: string,
  ) {
    return {
      id,
      currentState: nextState,
      notes: notes || `State transitioned to ${nextState}`,
      updatedAt: new Date().toISOString(),
    };
  }
}
