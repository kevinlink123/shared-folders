import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/storage')
export class FileUploadController {
	constructor(private fileUploadService: FileUploadService) {}
    @Get()
	getAllFiles() {
		console.log("AAAAA");
		return this.fileUploadService.getAllFiles();
	}
	
	@Post('/upload')
	@UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
		return this.fileUploadService.uploadFile(file);
	}
}
