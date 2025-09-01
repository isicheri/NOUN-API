// pdf.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PdfCategory } from '@prisma/client';
const B2 = require("backblaze-b2");  
import { ConfigService } from '@nestjs/config';
import { AuthRequest } from '../auth/types/auth-types';
import { EmailService } from 'src/utilities/email/email.service';

@Injectable()
export class PdfService {
  private b2:any;
  constructor(private prisma: PrismaService,private configService: ConfigService,private emailService:EmailService) {
    this.b2 = new B2({
      applicationKey: this.configService.get<string>("APPLICATION_KEY")!,
      applicationKeyId: this.configService.get<string>("APPLICATION_KEY_ID")!
    })
  }
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


  async downloadpdf(pdfId: string,req:AuthRequest) {
      const pdf = await this.prisma.pDF.findUnique({where: {id: pdfId}});
      if(!pdf) {
        throw new NotFoundException("Pdf not found!");
      }
    if (!req.user?.userId) {
    throw new BadRequestException('Cannot continue with this request');
  }

  // 3. Optional: Prevent duplicate downloads
  // Consider using connectOrCreate or a composite unique constraint
  try {
    await this.prisma.download.create({
      data: {
        userId: req.user.userId,
        pdfId: pdf.id,
      },
    });
  } catch (err) {
   return {message: "Something went wrong!",success: false}
  }

       let signedUrl = await this.getSignedUrl(pdf.fileKey);
       if(!signedUrl) {
        throw new BadRequestException("Something went wrong!");
       }
       const htmlContent = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
    <!-- Logo -->
    <div style="text-align: center; margin-bottom: 20px;">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 120" width="160" height="50" role="img" aria-labelledby="title desc">
        <title id="title">Nounedu Logo</title>
        <desc id="desc">A stylized open-book icon with a graduation cap, with Nounedu branding in greenyellow.</desc>
        <defs>
          <linearGradient id="bookGrad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stop-color="#ADFF2F"/>
            <stop offset="1" stop-color="#9ACD32"/>
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000" flood-opacity="0.2"/>
          </filter>
        </defs>
        <g transform="translate(20,20)" filter="url(#shadow)">
          <path d="M0,0 L40,30 L0,60 Z" fill="url(#bookGrad)" />
          <path d="M40,0 L80,30 L40,60 Z" fill="url(#bookGrad)" />
          <polygon points="10,10 40,0 70,10 40,20" fill="#2F4F2F"/>
          <line x1="40" y1="20" x2="40" y2="30" stroke="#2F4F2F" stroke-width="2"/>
        </g>
        <text x="110" y="70" font-family="Inter, system-ui, Arial" font-size="48" font-weight="700" fill="#2F4F2F">
          Nounedu
        </text>
      </svg>
    </div>

    <h2 style="color: #2F4F2F;">Your PDF Download is Ready!</h2>

    <p style="font-size: 16px; color: #333;">
      Hello ${req.user.email.split("@")[0] || ''},
    </p>
    <p style="font-size: 16px; color: #333;">
      Thank you for using Nounedu. Your requested PDF <strong>"${pdf.title}"</strong> is now ready to download.
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${signedUrl}" 
         style="background-color: #ADFF2F; color: #2F4F2F; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
        Download PDF
      </a>
    </div>

    <p style="font-size: 14px; color: #555;">
      Or copy and paste this link into your browser:
    </p>
    <p style="font-size: 14px; color: #2F4F2F; word-break: break-word;">
      ${signedUrl}
    </p>

    <hr style="margin: 40px 0; border: none; border-top: 1px solid #eeeeee;">

    <p style="font-size: 12px; color: #999999;">
      If you didn’t request this download or received this by mistake, you can ignore this email.
    </p>
  </div>
`;

    let mail =  this.emailService.sendMail({to: req.user.email,from: "info@nounedu.net"},htmlContent,"Requesting Pdf Download");
    return mail;    
  }

  private async getSignedUrl(fileKey: string): Promise<string> {
  // Authorize
  await this.b2.authorize();
  // Generate signed URL (valid for e.g. 15 minutes = 900s)
  const response = await this.b2.getDownloadAuthorization({
    bucketId: this.configService.get<string>("B2_BUCKET_ID")!,
    fileNamePrefix: fileKey, // file path in bucket
    validDurationInSeconds: 900,
  });
  const baseUrl = `https://f005.backblazeb2.com/file/NounEdu-pdfs/${fileKey}`;
  const signedUrl = `${baseUrl}?Authorization=${response.data.authorizationToken}`;

  return signedUrl;
}
  
}