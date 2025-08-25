import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { Auth } from '@/auth/decorators/auth.decorator';
import { UserRole } from '@/auth/enums/user-role.enum';
import { AuthType } from '@/auth/enums/auth-type.enum';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';

// Configure multer for file storage
const storage = diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = './uploads/images';
    // Create directory if it doesn't exist
    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// File filter for image validation
const imageFilter = (
  req: any,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
    return cb(
      new HttpException(
        'Only image files are allowed (jpg, jpeg, png, gif, webp)',
        HttpStatus.BAD_REQUEST,
      ),
      false,
    );
  }
  cb(null, true);
};

@ApiTags('Admin - File Upload')
@Controller('admin/upload')
@Auth(AuthType.Bearer, UserRole.ADMIN)
export class UploadController {
  @Post('image')
  @ApiOperation({ summary: 'Upload image file' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'Image uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        filename: { type: 'string' },
        path: { type: 'string' },
        size: { type: 'number' },
        url: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid file type or size' })
  @UseInterceptors(
    FileInterceptor('image', {
      storage,
      fileFilter: imageFilter,
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    // Return file information
    return {
      filename: file.filename,
      path: file.path,
      size: file.size,
      url: `/uploads/images/${file.filename}`, // URL for frontend to access the image
    };
  }
}
