import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipesModule } from './apis/recipes/recipes.module';
import { PaymentTransactionModule } from './apis/Transactions/paymentTransaction.module';
import { UserModule } from './apis/user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';


@Module({
  imports: [
    UserModule,
    RecipesModule,
    PaymentTransactionModule,

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'vegan-database',
      // host: '10.114.130.181',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'vegan-docker02',
      entities: [__dirname + '/apis/**/*.entity.*'],
      synchronize: true,
      logging: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})


export class AppModule { }
