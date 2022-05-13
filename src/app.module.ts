import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointTransactionModule } from './apis/pointTransaction/pointTransaction.module';
import { RecipesModule } from './apis/recipes/recipes.module';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

@Module({
  imports: [
    RecipesModule,
    PointTransactionModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '12345678',
      database: 'project_test',
      entities: [__dirname + '/apis/**/*.entity.*'],
      synchronize: true,
      logging: true,
      retryAttempts: 30
    }),
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule { }
