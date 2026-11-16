import { Injectable, NotFoundException } from '@nestjs/common';
import { PropertiesRepository } from '../../repositories/properties/properties.repository.js';
import type { CreatePropertyDto } from '../../../entrypoints/api/properties/dto/request/create-property.schema.js';

@Injectable()
export class PropertiesService {
  constructor(private readonly propertiesRepository: PropertiesRepository) {}

  public createProperty(payload: CreatePropertyDto) {
    return this.propertiesRepository.createProperty(payload);
  }

  public async retrieveProperty(id: string) {
    const property = await this.propertiesRepository.retrieveProperty(id);

    if (!property) {
      throw new NotFoundException('Property not found.');
    }

    return property;
  }
}
