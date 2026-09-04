import { Controller, Post, Body } from '@nestjs/common';

@Controller('sync')
export class SyncController {
  @Post('batch')
  async handleBatchSync(@Body() body: any) {
    const mutations = body.mutations || [];
    console.log(`Received batch sync of ${mutations.length} mutations from mobile client.`);

    const syncedUuids: string[] = [];
    const failedUuids: string[] = [];

    for (const mut of mutations) {
      if (mut.clientUuid) {
        syncedUuids.push(mut.clientUuid);
      } else {
        failedUuids.push(mut.clientUuid || 'unknown');
      }
    }

    return {
      status: 'SUCCESS',
      syncedUuids,
      failedUuids,
      timestamp: new Date().toISOString(),
    };
  }
}
