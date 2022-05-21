import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './commons/filter/http-exception.filter'
import { graphqlUploadExpress } from 'graphql-upload'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalFilters(new HttpExceptionFilter())
  app.use(graphqlUploadExpress())
  // app.enableCors({
  //   origin: 'http://itoutsider.shop',
  //   credentials: true,
  // })

  await app.listen(3000)
}
bootstrap()
