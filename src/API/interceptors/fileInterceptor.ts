import { FileInterceptor } from '@nestjs/platform-express';
import * as crypto from 'crypto';
import { Configs } from '../../config/config';
import * as fs from 'fs';
import * as path from 'path';
import { diskStorage } from 'multer';

export const FileUploadInterceptor = FileInterceptor('image', {
  storage: diskStorage({
    destination: '/public/products',
    filename: function(req, file, cb) {
      const newName = crypto
        .createHmac('sha256', Configs.imageSecret)
        .update((new Date()).toDateString())
        .digest('hex');
      if (fs.existsSync(path.join('/public/products', file.originalname))) {
        cb("Error");
      } else {
        cb(null, newName + file.originalname.split(".")[1]);
      }
    },
  }),
});