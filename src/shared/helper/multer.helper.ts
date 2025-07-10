// shared/helpers/multer.helper.ts
import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerStudentPhotoStorage = diskStorage({
  destination: './uploads/student-photos',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    cb(null, `photo-${uniqueSuffix}${ext}`);
  },
});
