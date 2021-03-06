import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './commons/filter/http-exception.filter'
import { graphqlUploadExpress } from 'graphql-upload'
import { json } from 'express'

async function bootstrap() {

  const app = await NestFactory.create(AppModule)
  app.useGlobalFilters(new HttpExceptionFilter())
  app.use(graphqlUploadExpress())
  app.use(json({ limit: '100mb' }))
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
  await app.listen(3000)
}
bootstrap()