import { applyDecorators, HttpStatus, SerializeOptions } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import type { ZodType } from 'zod';

/**
 * Documents the response and makes the global serializer parse it with the schema, which strips
 * unknown keys. For array responses pass the item schema: the serializer parses each element.
 */
export const ApiSchemaResponse = ({ status, schema }: { status: HttpStatus; schema: ZodType }) =>
  applyDecorators(SerializeOptions({ schema }), ApiResponse({ status, standardSchema: schema }));
