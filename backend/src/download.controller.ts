import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { existsSync } from 'fs';
import { join } from 'path';

@Controller('api')
export class DownloadController {
  private apkPath(): string {
    return join(__dirname, '..', '..', 'apk', 'thekedari.apk');
  }

  @Get('download/apk')
  downloadApk(@Res() res: Response) {
    const apkPath = this.apkPath();
    if (!existsSync(apkPath)) {
      return res.status(404).json({
        message: 'APK not available. Run npm run build:apk locally, commit backend/apk/thekedari.apk, and redeploy the API.',
      });
    }

    res.setHeader('Content-Type', 'application/vnd.android.package-archive');
    res.setHeader('Content-Disposition', 'attachment; filename="thekedari.apk"');
    res.setHeader('Cache-Control', 'no-cache');
    return res.sendFile(apkPath);
  }

  @Get('download/apk/info')
  apkInfo(@Res() res: Response) {
    const apkPath = this.apkPath();
    let version = '1.0.0';
    try {
      const pkgPath = join(__dirname, '..', '..', 'package.json');
      version = require(pkgPath).version;
    } catch {
      /* use default */
    }
    return res.json({
      available: existsSync(apkPath),
      version,
      downloadUrl: '/api/download/apk',
    });
  }
}
