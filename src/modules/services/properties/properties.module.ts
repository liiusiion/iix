import { Module } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertiesRepositoryModule } from '../../repositories/properties/properties-repository.module';

@Module({
  providers: [PropertiesService],
  exports: [PropertiesService],
  imports: [PropertiesRepositoryModule],
})
export class PropertiesModule {}
