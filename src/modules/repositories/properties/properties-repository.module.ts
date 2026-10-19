import { Module } from '@nestjs/common';
import { PropertiesRepository } from './properties.repository';

@Module({
  providers: [PropertiesRepository],
  exports: [PropertiesRepository],
})
export class PropertiesRepositoryModule {}
