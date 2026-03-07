import { Controller, Get, Query, BadRequestException, Redirect } from '@nestjs/common';
import { CloudinaryService } from '../common/services/cloudinary.service';

@Controller('resources')
export class ResourcesController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  /**
   * Returns a signed Cloudinary URL for the given resource URL.
   * Usage: GET /resources/signed-url?url=<encodedCloudinaryUrl>
   * The client is redirected directly to the signed URL so the file
   * opens / downloads without any 401 errors.
   */
  @Get('signed-url')
  @Redirect()
  getSignedUrl(@Query('url') fileUrl: string) {
    if (!fileUrl) {
      throw new BadRequestException('url query parameter is required');
    }

    const signedUrl = this.cloudinaryService.generateSignedUrl(fileUrl);
    return { url: signedUrl };
  }
}
