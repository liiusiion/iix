import { Module } from '@nestjs/common';
import { PropertiesService } from './properties.service.js';
import { PropertiesRepositoryModule } from '../../repositories/properties/properties-repository.module.js';

@Module({
  providers: [PropertiesService],
  exports: [PropertiesService],
  imports: [PropertiesRepositoryModule],
})
export class PropertiesModule {}
