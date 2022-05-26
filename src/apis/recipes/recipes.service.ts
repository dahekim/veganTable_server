import { ConflictException, createParamDecorator, ExecutionContext, Injectable } from "@nestjs/common";
import { addFieldMetadata, GqlExecutionContext } from "@nestjs/graphql";
import { InjectRepository } from "@nestjs/typeorm";
import { stringify } from "querystring";
import { Connection, getRepository, Repository } from "typeorm";
import { RecipesImage } from "../recipesImage/entities/recipesImage.entity";
import { CLASS_TYPE, User } from "../user/entities/user.entity";
import { CreateRecipesInput } from "./dto/createRecipes.input";
import { CATEGORY_TYPES, COOKING_LEVEL, Recipes } from "./entities/recipes.entity";
import { jsonToSchema } from "@walmartlabs/json-to-simple-graphql-schema";


@Injectable()
export class RecipesService {
    constructor(
        @InjectRepository(Recipes)
        private readonly recipesRepository: Repository<Recipes>,

        @InjectRepository(RecipesImage)
        private readonly recipesImageRepository: Repository<RecipesImage>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private readonly createRecipesInput: CreateRecipesInput,
    ) { }

    async fetchRecipesAll() {
        await this.recipesRepository.findOne({
            types: CATEGORY_TYPES.ALL
        });
    }
    async fetchRecipeTypes({ id, typesCode }) {
        const checkedType = await this.recipesRepository.findOne({
            where: { id }
        })
        const { types, ...rest } = checkedType
        if (checkedType.types !== 'ALL') {
            let typesEnum: CATEGORY_TYPES;
            if (typesCode === "VEGAN") typesEnum = CATEGORY_TYPES.VEGAN;
            else if (typesCode === "LACTO") typesEnum = CATEGORY_TYPES.LACTO;
            else if (typesCode === "OVO") typesEnum = CATEGORY_TYPES.OVO;
            else if (typesCode === "LACTO-OVO") typesEnum = CATEGORY_TYPES.LACTO_OVO;
            else if (typesCode === "PESCO") typesEnum = CATEGORY_TYPES.PESCO;
            else if (typesCode === "POLLO") typesEnum = CATEGORY_TYPES.POLLO;
            else {
                console.log('정확한 채식 타입을 선택해 주세요.');
                throw new ConflictException('적합한 채식 타입을 선택하지 않으셨습니다.');
            }
            const collectedTypes = await this.recipesRepository.create({
                types: typesEnum,
                ...rest
            });
            const result = await this.recipesRepository.save(collectedTypes);
            return result;
        }
    }

    async fetchMyRecipe({ id, user_id }) {
        return await getRepository(Recipes)
            .createQueryBuilder('recipes')
            .leftJoinAndSelect('recipes.id', 'id')
            .leftJoinAndSelect('recipes.user', 'user')
            .where('recipes.id = :recipesId', { id })
            .andWhere('user.user_id = :userUserId', { user_id })
            .orderBy('recipes.createdAt', 'DESC')
            .getManyAndCount();
    }

    async fetchRecipeIsPro({ isPro }) {
        return await getRepository(Recipes)
            .createQueryBuilder('recipes')
            .leftJoinAndSelect('recipes.user', 'user')
            .where('user.isPro = :userIsPro', { isPro })
            .orderBy('recipes.createdAt', 'DESC')
            .getManyAndCount();
    }

    async create({
        { ...createRecipesInput }, image_id, currentUser
    }) {
    try {
        const user = await this.userRepository.findOne(
            { user_id: currentUser.user_id },
        );
        const images = await getRepository(RecipesImage)
            .createQueryBuilder('recipesimage')
            .where('recipesimage.image_id = :recipesimageImageId', { id: image_id })
            .withDeleted()
            .getOne();

        const registRecipe = await this.recipesRepository.save({
            ...user,
            images,
            thumbNail: images[0],
            isPro: user.isPro,
            ...rest
        });

        for (let i = 0; i < images.length; i++) {
            if (i === 0) {
                await this.recipesImageRepository.save({
                    url: images[i],
                    recipes: registRecipe,
                });
            } else {
                await this.recipesImageRepository.save({
                    url: images[i],
                    recipes: registRecipe,
                });
            }
        }
        if (registRecipe.isPro === 'COMMON') {
            await this.recipesRepository.save({
                user,
                isPro: CLASS_TYPE.COMMON,
            })
            console.log('작성자: 일반인');
        } else if (registRecipe.isPro === 'PRO') {
            await this.recipesRepository.save({
                user,
                isPro: CLASS_TYPE.PRO,
            })
            console.log('작성자: 전문가');
        }
        return registRecipe;
    } catch (error) {
        console.log(error)
        if (error?.response?.data?.message || error?.response?.status) {
            console.log(error.response.data.message);
            console.log(error.response.status);
        } else {
            throw error;
        }
    }

}

    async update({ id, updateRecipesInput }) {
    const registedRecipe = await this.recipesRepository.findOne({
        where: { id }
    });

    const newRegistRecipe = {
        ...registedRecipe,
        ...updateRecipesInput,
    }
    return await this.recipesRepository.save(newRegistRecipe);
}

    async delete ({ id, currentUser }) {
    try {
        const result = await this.recipesRepository.softDelete({
            id,
            user: currentUser.user_id,
        });
        return result.affected ? true : false;
    } catch (error) {
        console.log(error)
        if (error?.response?.data?.message || error?.response?.status) {
            console.log(error.response.data.message);
            console.log(error.response.status);
        } else {
            throw error;
        }
    }
}
}