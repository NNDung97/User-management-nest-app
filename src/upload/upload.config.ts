import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

export const avatarStorage = diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/avatars';
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${req.params.id}-${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});