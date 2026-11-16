import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { PropertiesService } from '../../../modules/services/properties/properties.service.js';
import {
  CreatePropertySchema,
  type CreatePropertyDto,
} from './dto/request/create-property.schema.js';
import { EntityIdResponseSchema } from '../common/dto/response/entity-id-response.schema.js';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  EntityIdPathSchema,
  type EntityIdPathDto,
} from '../common/dto/request/entity-id-path.schema.js';
import { RetrievePropertySchema } from './dto/response/retrieve-property.schema.js';
import { AllowAnonymous, Roles } from '@thallesp/nestjs-better-auth';
import { Role } from '../../../db/schema/index.js';
import { ApiSchemaResponse } from '../../../common/decorators/api-schema-response.decorator.js';

@ApiTags('Properties')
@Controller('properties')
export class PropertiesController {
  constructor(private readonly accommodationsService: PropertiesService) {}

  @ApiSchemaResponse({
    status: HttpStatus.CREATED,
    schema: EntityIdResponseSchema,
  })
  @ApiOperation({
    summary: 'Create a Property.',
  })
  @Roles([Role.Admin])
  @Post()
  public createProperty(@Body({ schema: CreatePropertySchema }) body: CreatePropertyDto) {
    return this.accommodationsService.createProperty(body);
  }

  @ApiSchemaResponse({
    status: HttpStatus.OK,
    schema: RetrievePropertySchema,
  })
  @ApiOperation({
    summary: 'Retrieve a Property.',
  })
  @AllowAnonymous()
  @Get(':id')
  public retrieveProperty(@Param({ schema: EntityIdPathSchema }) params: EntityIdPathDto) {
    return this.accommodationsService.retrieveProperty(params.id);
  }
}
