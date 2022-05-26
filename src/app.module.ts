import * as redisStore from 'cache-manager-redis-store';
// import GraphQLJSON from 'graphql-type-json';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisClientOptions } from 'redis';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './apis/auth/auth.module';
import { PaymentTransactionModule } from './apis/Transactions/paymentTransaction.module';
import { RecipesModule } from './apis/recipes/recipes.module';
import { UserModule } from './apis/user/user.module';
import { RecipesReplyModule } from './apis/recipiesReply/recipesReply.module';
import { RecipeScrapModule } from './apis/recipeScrap/recipeScrap.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    RecipesModule,
    PaymentTransactionModule,
    RecipesReplyModule,
    RecipeScrapModule,

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
      // cors: {
      //   origin: 'http://localhost:3000',
      //   credentials: true,
      //   // frontend 배포 이후
      //   // origin: 'https://vegantable.shop',
      // },      
      bodyParserConfig: {
        limit: "100mb"
      },
      // resolvers: { JSON: GraphQLJSON },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'vegan-database',
      // host: "10.31.224.4", 
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'vegan-docker02',
      entities: [__dirname + '/apis/**/*.entity.*'],
      synchronize: true,
      logging: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      url: 'redis://vegan-redis:6379',
      isGlobal: true,
    }),
  ],
})

export class AppModule { }