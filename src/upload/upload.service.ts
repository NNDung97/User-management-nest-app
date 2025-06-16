import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
    getFilePath(describer: string, filename: string): string {
        return `./uploads/${describer}/${filename}`;
    }
}