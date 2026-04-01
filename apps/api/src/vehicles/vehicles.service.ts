import { Injectable } from '@nestjs/common';
import { Vehicle } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateVehicleDto): Promise<Vehicle> {
    // Added 'await' to satisfy the linter
    return await this.prisma.vehicle.create({ data });
  }

  async findAll(): Promise<Vehicle[]> {
    return await this.prisma.vehicle.findMany();
  }

  async findAllAvailable(): Promise<Vehicle[]> {
    return await this.prisma.vehicle.findMany({
      where: {
        // You can add logic like: status: 'AVAILABLE'
      },
    });
  }

  async findOne(id: string): Promise<Vehicle | null> {
    return await this.prisma.vehicle.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateVehicleDto): Promise<Vehicle> {
    return await this.prisma.vehicle.update({ where: { id }, data });
  }

  async remove(id: string): Promise<Vehicle> {
    return await this.prisma.vehicle.delete({ where: { id } });
  }
}
