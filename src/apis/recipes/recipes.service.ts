import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FileUpload } from "graphql-upload";
import { getRepository, Repository } from "typeorm";
import { User } from "../user/entities/user.entity";
import { CATEGORY_TYPES, Recipes } from "./entities/recipes.entity";
import { getToday } from 'src/commons/libraries/utils'
import { Storage } from '@google-cloud/storage'
import { v4 as uuidv4 } from 'uuid'
import { RecipesImage } from "../recipesImage/entities/recipesImage.entity";
import { RecipesIngredients } from "../recipesIngrediants/entities/recipesIngrediants.entity";

interface IFile {
    files: FileUpload[]
}



@Injectable()
export class RecipesService {
    constructor(
        @InjectRepository(Recipes)
        private readonly recipesRepository: Repository<Recipes>,

        @InjectRepository(RecipesImage)
        private readonly recipesImageRepository: Repository<RecipesImage>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(RecipesIngredients)
        private readonly recipesIngredientsRepository: Repository<RecipesIngredients>

        // private readonly createRecipesInput: CreateRecipesInput,
    ) { }

    async fetchRecipesAll() {
        await this.recipesRepository.find();
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

    async create(createRecipesInput, recipesPic, ingredients, currentUser) {

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
                ingredients,
                user: user,
                isPro: user.isPro,
            });
            console.log("444444");
            console.log(registRecipe);

            for (let i = 0; i < recipesPic.length; i++) {
                await this.recipesImageRepository.save({
                    url: recipesPic[i],
                    recipes: registRecipe,
                });
                console.log("레시피 이미지 DB로 이미지 URL 전달");
                return recipesPic;
            }
            console.log(recipesPic);

            for (let i = 0; i < ingredients.length; i++) {
                await this.recipesIngredientsRepository.save({
                    name: ingredients[i],
                    recipes: registRecipe,
                });
                console.log("레시피 재료 DB로 재료 이름 전달");
                return ingredients;
            }
            console.log(ingredients);

            if (registRecipe.isPro === 'COMMON') {
                await this.recipesRepository.save({
                    user: user,
                    isPro: user.isPro,
                })
                console.log('작성자: 일반인');
            }
            if (registRecipe.isPro === 'PRO') {
                await this.recipesRepository.save({
                    user: user,
                    isPro: user.isPro,
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

    async uploadImages({ files }: IFile) {
        const bucket = process.env.VEGAN_STORAGE_BUCKET
        const storage = new Storage({
            keyFilename: process.env.STORAGE_KEY_FILENAME,
            projectId: process.env.STORAGE_PROJECT_ID,
        }).bucket(bucket)

        const waitedFiles = await Promise.all(files)
        const results = await Promise.all(waitedFiles.map(file => {
            return new Promise((resolve, reject) => {
                const fileName = `recipes/${getToday()}/${uuidv4()}/${file.filename}`
                file
                    .createReadStream()
                    .pipe(storage.file(fileName).createWriteStream())
                    .on("finish", () => resolve(`${bucket}/${fileName}`))
                    .on("error", (error) => reject("🔔" + error))
            })
        })
        )
        return results
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
}