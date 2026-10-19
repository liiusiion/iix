import { Injectable } from '@nestjs/common';
import { InjectDb } from '../../../common/decorators/inject-db.decorator';
import { properties } from '../../../db/schema';
import { CreateProperty } from './types/properties-repository.types';
import { DrizzleDb } from '../../../common/modules/drizzle/drizzle.module';

@Injectable()
export class PropertiesRepository {
  constructor(@InjectDb() private readonly db: DrizzleDb) {}

  public async createProperty(data: CreateProperty) {
    const inserted = await this.db.insert(properties).values(data).returning({
      id: properties.id,
    });

    return inserted[0];
  }

  public async retrieveProperty(id: string) {
    try {
      const property = await this.db.query.properties.findFirst({
        where: {
          id,
        },
      });

      console.log({ property });
      return property;
    } catch (error) {
      console.log(error);
    }
  }
}
