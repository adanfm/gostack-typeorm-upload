import multer from 'multer';
import path from 'path';
import cryto from 'crypto';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');
export default {
  directory: tmpFolder,
  storage: multer.diskStorage({
    destination: tmpFolder,
    filename(request, file, callback) {
      const fileHash = cryto.randomBytes(10).toString('HEX');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};
