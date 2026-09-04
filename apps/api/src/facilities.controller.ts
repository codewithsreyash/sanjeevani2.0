import { Controller, Get, Query, Param } from '@nestjs/common';

@Controller('facilities')
export class FacilitiesController {
  private readonly facilities = [
    {
      id: 'fac_shivapur_sub',
      name: 'Shivapur Sub Centre',
      type: 'Sub Centre',
      district: 'Pune',
      taluka: 'Mulshi',
      latitude: 18.5204,
      longitude: 73.8567,
      services: ['Vitals Capture', 'Basic Medicines', 'ASHA Assisted Teleconsultation'],
      hasDoctor: false,
      approxWaitTimeMins: 10,
      isOpen: true,
    },
    {
      id: 'fac_shivapur_phc',
      name: 'Shivapur Primary Health Centre (PHC)',
      type: 'Primary Health Centre',
      district: 'Pune',
      taluka: 'Mulshi',
      latitude: 18.5350,
      longitude: 73.8750,
      services: ['Medical Officer OPD', 'Pathology Lab', 'Maternal & Child Health', 'Essential Medicines'],
      hasDoctor: true,
      approxWaitTimeMins: 22,
      isOpen: true,
    },
    {
      id: 'fac_mulshi_rh',
      name: 'Mulshi Rural Hospital',
      type: 'Rural Hospital',
      district: 'Pune',
      taluka: 'Mulshi',
      latitude: 18.5480,
      longitude: 73.8920,
      services: ['Inpatient Ward', 'Emergency Care', 'X-Ray & Ultrasound', 'Specialist Consults', 'Referral Desk'],
      hasDoctor: true,
      approxWaitTimeMins: 35,
      isOpen: true,
    },
    {
      id: 'fac_pune_dh',
      name: 'Pune District Hospital (Aundh)',
      type: 'District Hospital',
      district: 'Pune',
      taluka: 'Haveli',
      latitude: 18.5529,
      longitude: 73.8080,
      services: ['Multi-Specialty Care', 'ICU', 'Advanced Diagnostics', 'Comprehensive Pharmacy'],
      hasDoctor: true,
      approxWaitTimeMins: 45,
      isOpen: true,
    },
  ];

  @Get()
  async listFacilities(
    @Query('district') district?: string,
    @Query('type') type?: string,
  ) {
    let result = this.facilities;
    if (district) result = result.filter((f) => f.district === district);
    if (type) result = result.filter((f) => f.type === type);
    return result;
  }

  @Get(':id')
  async getFacility(@Param('id') id: string) {
    return this.facilities.find((f) => f.id === id) || { error: 'Facility not found' };
  }

  @Get(':id/inventory')
  async getFacilityInventory(@Param('id') id: string) {
    return [
      { medicineId: 'med_para_500', name: 'Paracetamol 500mg', stockQuantity: 1200, status: 'AVAILABLE' },
      { medicineId: 'med_amox_500', name: 'Amoxicillin 500mg', stockQuantity: 0, status: 'OUT_OF_STOCK' },
      { medicineId: 'med_salb_inh', name: 'Salbutamol Inhaler', stockQuantity: 12, status: 'LOW_STOCK' },
      { medicineId: 'med_ifa_tab', name: 'Iron Folic Acid Tablets', stockQuantity: 45, status: 'LOW_STOCK' },
      { medicineId: 'med_aml_5', name: 'Amlodipine 5mg', stockQuantity: 320, status: 'AVAILABLE' },
    ];
  }

  @Get(':id/queue')
  async getFacilityQueue(@Param('id') id: string) {
    return {
      facilityId: id,
      activeTokens: 14,
      nextToken: 'A-018',
      estimatedWaitMins: 22,
      updatedAt: new Date().toISOString(),
    };
  }
}
