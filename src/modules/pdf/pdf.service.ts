// pdf.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PdfCategory } from '@prisma/client';

@Injectable()
export class PdfService {
  constructor(private prisma: PrismaService) {}

  async getPdfs({
    category,
    search,
    level,
    isFree,
    page,
    limit,
  }: {
    category?: PdfCategory;
    search?: string;
    level?: string;
    isFree?: boolean;
    page: number;
    limit: number;
  }) {
    const where: any = {};

    if (category) where.category = category;
    if (level) where.level = level;
    if (typeof isFree === 'boolean') where.isFree = isFree;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { courseCode: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.pDF.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.pDF.count({ where }),
    ]);

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  };

  



}
