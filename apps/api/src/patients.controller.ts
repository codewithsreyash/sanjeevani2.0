import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';

@Controller('patients')
export class PatientsController {
  @Get()
  async listPatients(@Query('q') q?: string) {
    const patients = [
      { id: 'pat_ramesh_patil', fullName: 'Ramesh Patil', age: 42, gender: 'Male', village: 'Shivapur Sector 2', district: 'Pune', mockAbhaId: '91-8765-4321-0987' },
      { id: 'pat_sunita_patil', fullName: 'Sunita Patil', age: 38, gender: 'Female', village: 'Shivapur Sector 2', district: 'Pune', mockAbhaId: '91-8765-4321-0988' },
      { id: 'pat_aarav_patil', fullName: 'Aarav Patil', age: 8, gender: 'Male', village: 'Shivapur Sector 1', district: 'Pune', mockAbhaId: '91-8765-4321-0989' },
      { id: 'pat_parvati_patil', fullName: 'Parvati Patil', age: 68, gender: 'Female', village: 'Shivapur Sector 2', district: 'Pune', mockAbhaId: '91-8765-4321-0990' },
    ];

    if (q) {
      const lower = q.toLowerCase();
      return patients.filter(
        (p) => p.fullName.toLowerCase().includes(lower) || p.mockAbhaId.includes(q)
      );
    }
    return patients;
  }

  @Get(':id')
  async getPatient(@Param('id') id: string) {
    return {
      id,
      fullName: 'Ramesh Patil',
      age: 42,
      gender: 'Male',
      village: 'Shivapur Sector 2',
      district: 'Pune',
      mockAbhaId: '91-8765-4321-0987',
      isAbhaLinked: true,
    };
  }

  @Post()
  async createPatient(@Body() body: any) {
    return {
      id: `pat_${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
    };
  }

  @Get(':id/vitals')
  async getPatientVitals(@Param('id') id: string) {
    return [
      {
        id: 'vit_001',
        patientId: id,
        temperature: 38.5,
        heartRate: 98,
        bloodPressure: '130/85',
        spO2: 92,
        weight: 65,
        recordedBy: 'wrk_sunita_more',
        recordedAt: '2026-09-04T09:00:00.000Z',
      },
    ];
  }

  @Post(':id/vitals')
  async recordVitals(@Param('id') id: string, @Body() body: any) {
    return {
      id: `vit_${Date.now()}`,
      patientId: id,
      ...body,
      recordedAt: new Date().toISOString(),
    };
  }

  @Get(':id/encounters')
  async getPatientEncounters(@Param('id') id: string) {
    return [
      {
        id: 'enc_001',
        patientId: id,
        doctorId: 'doc_ananya_deshmukh',
        chiefComplaint: 'High-grade fever for 5 days with breathlessness and low SpO2 (92%)',
        clinicalNotes: 'Acute lower respiratory tract infection. Requires specialist review.',
        diagnosis: 'LRTI with Hypoxia',
        status: 'COMPLETED',
        startedAt: '2026-09-04T09:15:00.000Z',
        completedAt: '2026-09-04T09:45:00.000Z',
      },
    ];
  }
}
