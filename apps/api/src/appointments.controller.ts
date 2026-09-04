import { Controller, Get, Post, Body, Param } from '@nestjs/common';

@Controller('appointments')
export class AppointmentsController {
  @Post('queue-token')
  async generateQueueToken(@Body() body: any) {
    const tokenNumber = `A-${String(Math.floor(Math.random() * 30) + 1).padStart(3, '0')}`;
    return {
      id: `qt_${Date.now()}`,
      tokenNumber,
      patientId: body.patientId || 'pat_ramesh_patil',
      facilityId: body.facilityId || 'fac_shivapur_phc',
      facilityName: body.facilityName || 'Shivapur Primary Health Centre (PHC)',
      desk: body.desk || 'OPD Desk 1',
      patientsAhead: Math.floor(Math.random() * 8) + 1,
      estimatedWaitMins: Math.floor(Math.random() * 20) + 10,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };
  }

  @Post()
  async bookAppointment(@Body() body: any) {
    return {
      id: `appt_${Date.now()}`,
      patientId: body.patientId || 'pat_ramesh_patil',
      facilityId: body.facilityId || 'fac_shivapur_phc',
      date: body.date || new Date().toISOString().split('T')[0],
      timeSlot: body.timeSlot || '11:30 AM',
      type: body.type || 'OPD',
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
    };
  }

  @Get('patient/:patientId')
  async getPatientAppointments(@Param('patientId') patientId: string) {
    return [
      {
        id: 'appt_001',
        patientId,
        facilityId: 'fac_mulshi_rh',
        facilityName: 'Mulshi Rural Hospital',
        date: '2026-09-04',
        timeSlot: '11:30 AM',
        type: 'REFERRAL_CONSULT',
        status: 'CONFIRMED',
        token: 'A-017',
      },
    ];
  }
}
