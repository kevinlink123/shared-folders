import {  Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FileUploadService {
    private readonly storage: Storage;
    private GCP_BUCKET = 'waisman-web-shared-folders';
    constructor() {
        const GCP_PROJECT_ID = 'shared-folders-410613';
        const GCP_KEY_FILE_PATH = 'gcp-key.json';

        this.storage = new Storage({
            projectId: GCP_PROJECT_ID,
            keyFilename: GCP_KEY_FILE_PATH,
        });
    }

    async getAllFiles() {
        const bucket = this.storage.bucket(this.GCP_BUCKET);
        const [files] = await bucket.getFiles();

        return files.map((file) => {
            return {
                publicUrl: file.publicUrl(),
                name: file.name
            }
        });
    }

    async uploadFile(file: Express.Multer.File) {
        try {
            console.log("Inicio");
            const GCP_BUCKET = 'waisman-web-shared-folders';
            const bucket = this.storage.bucket(GCP_BUCKET);
            const originalName = file.originalname;
            const filename = `${Date.now()}-${originalName}`;

            const blob = bucket.file(filename);
            const blobStream = blob.createWriteStream();

            const result = await new Promise((resolve, reject) => {
                blobStream.on('finish', () => {
                    resolve({
                        publicUrl: `https://storage.googleapis.com/${GCP_BUCKET}/${blob.name}`,
                        success: true
                    });
                }).on('error', (e) => {
                    console.log(e);
                    reject({
                        publicUrl: '',
                        success: false
                    });
                }).end(file.buffer);
            })
            console.log("Final");
            return result;
        } catch (e: any) {
            console.log(e);
        }
    }
}
