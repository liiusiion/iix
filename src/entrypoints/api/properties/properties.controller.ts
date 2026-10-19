import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PropertiesService } from '../../../modules/services/properties/properties.service';
import { CreatePropertyDto } from './dto/request/create-property.schema';
import { ZodResponse } from 'nestjs-zod';
import { EntityIdResponseDto } from '../common/dto/response/entity-id-response.schema';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EntityIdPathDto } from '../common/dto/request/entity-id-path.dto';
import { RetrievePropertyResponseDto } from './dto/response/retrieve-property.schema';

@ApiTags('Properties')
@Controller('properties')
export class PropertiesController {
  constructor(private readonly accommodationsService: PropertiesService) {}

  @ZodResponse({
    type: EntityIdResponseDto,
  })
  @ApiOperation({
    summary: 'Create a Property.',
  })
  @Post()
  public createProperty(@Body() body: CreatePropertyDto) {
    return this.accommodationsService.createProperty(body);
  }

  @ZodResponse({
    type: RetrievePropertyResponseDto,
  })
  @ApiOperation({
    summary: 'Retrieve a Property.',
  })
  @Get(':id')
  public retrieveProperty(@Param() params: EntityIdPathDto) {
    return this.accommodationsService.retrieveProperty(params.id);
  }
}
