import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';

async function bootstrap() {
  const gcpKeysPath = process.env.GCP_KEY_FILENAME;
  const gcpKeysContent = process.env.GCP_KEYS_JSON_STRING;
  await fs.writeFileSync(gcpKeysPath, gcpKeysContent);

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'https://shared-folders-client.vercel.app'
    ],
    credentials: true
  });
  
  await app.listen(process.env.PORT);
}
bootstrap();
