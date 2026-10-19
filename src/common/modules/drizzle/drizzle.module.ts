import { Global, Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../../../db/schema';
import { dbConfig } from '../../../configs/db.config';
import { injectionToken } from '../../helpers/injection-token.helper';
import { defineRelationsPart, sql } from 'drizzle-orm';
import { bookingsRelations } from '../../../db/schema';

const db = drizzle({
  connection: {
    connectionString: dbConfig.DB_URL,
  },
  logger: true,
  relations: { ...defineRelationsPart(schema), ...bookingsRelations },
});

export type DrizzleDb = typeof db;

@Global()
@Module({
  providers: [
    {
      provide: injectionToken.drizzle,
      useFactory: async (): Promise<DrizzleDb> => {
        await db.execute(sql`select 'Drizzle ORM connected successfully!'`);
        return db;
      },
    },
  ],
  exports: [injectionToken.drizzle],
})
export class DrizzleModule {}
