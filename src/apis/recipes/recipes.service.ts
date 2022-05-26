import { IAMExceptionMessages } from "@google-cloud/storage/build/src/iam";
import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { getRepository, Repository } from "typeorm";
import { RecipesImage } from "../recipesImage/entities/recipesImage.entity";
import { CLASS_TYPE, User } from "../user/entities/user.entity";
import { CreateRecipesInput } from "./dto/createRecipes.input";
import { CATEGORY_TYPES, Recipes } from "./entities/recipes.entity";



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

    async create(createRecipesInput, image_urls, currentUser) {

        const { types, level, ...rest } = createRecipesInput;
        console.log("111111");
        console.log(createRecipesInput);
        try {
            const user = await this.userRepository.findOne(
                currentUser,
                { where: { user_id: currentUser.user_id } }
            );
            console.log(user);
            console.log("222222");
            console.log('유저 정보 확인');

            console.log("333333");
            console.log("레시피 등록 과정 시작");

            const registRecipe = await this.recipesRepository.save({
                ...rest,
                types,
                level,
                user: user,
                currentUser: user.isPro,
                urls: image_urls,
            });
            console.log("444444");
            console.log(registRecipe);

            console.log("레시피 등록 과정 확인");

            function jsonArray(image_urls: JSON[]) {
                let imageurls_string = "[";
                for (let i = 0; i < image_urls.length; i++) {
                    if (i < image_urls.length - 1) {
                        imageurls_string += ",";
                    }
                }
                imageurls_string += "]";
                this.recipesRepository.save({ image_urls: imageurls_string });

            }
            // for (let i = 0; i < image_urls.length; i++) {
            //     await this.recipesImageRepository.save({
            //         url: image_urls[i],
            //         recipes: registRecipe,
            //     });
            //     console.log("레시피 이미지 DB로 이미지 URL 전달 확인")
            //     if (registRecipe.isPro === 'COMMON') {
            //         await this.recipesRepository.save({
            //             user: user,
            //             isPro: user.isPro = CLASS_TYPE.COMMON,
            //         })
            //         console.log('작성자: 일반인');
            //     }
            //     if (registRecipe.isPro === 'PRO') {
            //         await this.recipesRepository.save({
            //             user: user,
            //             isPro: user.isPro = CLASS_TYPE.PRO,
            //         })
            //         console.log('작성자: 전문가');
            //     }
            // }
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

    async delete({ id, currentUser }) {
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

    // ) {
    //     const result = await this.recipesImageRepository.save({

    //     })
    //     try {
    //         const { image_id, images, ...rest } = createRecipesInput;
    //         const user = await this.userRepository.findOne(
    //             { user_id: currentUser.user_id },
    //         );
    //         const recipeImages = await getRepository(RecipesImage)
    //             .createQueryBuilder('recipesimage')
    //             .where('recipesimage.image_id = :recipesimageImageId', { id: image_id })
    //             .withDeleted()
    //             .getOne();

    //     const registRecipe = await this.recipesRepository.save({
    //         user: user,
    //         recipeImages: recipeImages,
    //         isPro: user.isPro,
    //         ...rest
    //     });

    //     for (let i = 0; i < images.length; i++) {
    //         await this.recipesImageRepository.save({
    //             url: images[i],
    //             recipes: registRecipe,
    //         });
    //     }
    //     if (registRecipe.isPro === 'COMMON') {
    //         await this.recipesRepository.save({
    //             user: user,
    //             isPro: CLASS_TYPE.COMMON,
    //         })
    //         console.log('작성자: 일반인');
    //     } else if (registRecipe.isPro === 'PRO') {
    //         await this.recipesRepository.save({
    //             user: user,
    //             isPro: CLASS_TYPE.PRO,
    //         })
    //         console.log('작성자: 전문가');
    //     }
    //     return registRecipe;
    // } catch (error) {
    //     console.log(error)
    //     if (error?.response?.data?.message || error?.response?.status) {
    //         console.log(error.response.data.message);
    //         console.log(error.response.status);
    //     } else {
    //         throw error;
    //     }
    // }