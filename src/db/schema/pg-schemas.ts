import { snakeCase } from 'drizzle-orm/pg-core';

export const mainSchema = snakeCase.schema('main');
