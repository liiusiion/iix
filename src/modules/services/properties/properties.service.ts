import { Injectable, NotFoundException } from '@nestjs/common';
import { PropertiesRepository } from '../../repositories/properties/properties.repository';
import { CreateProperty } from '../../../entrypoints/api/properties/dto/request/create-property.schema';

@Injectable()
export class PropertiesService {
  constructor(private readonly propertiesRepository: PropertiesRepository) {}

  public createProperty(payload: CreateProperty) {
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
