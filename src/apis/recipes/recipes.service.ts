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
import { RecipeScrap } from "../recipeScrap/entities/recipeScrap.entity";
import { RecipesTag } from "../recipesTag/entities/recipesTag.entity";

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
        private readonly recipesIngredientsRepository: Repository<RecipesIngredients>,

        @InjectRepository(RecipeScrap)
        private readonly recipeScrapRepository: Repository<RecipeScrap>,

        @InjectRepository(RecipesTag)
        private readonly recipesTagRepository: Repository<RecipesTag>,
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

    async create({ createRecipesInput }, currentUser) {

        console.log("111111");
        console.log(createRecipesInput);
        console.log("플레이그라운드에서 입력된 값 확인")
        console.log(currentUser);

        try {
            const { url, description, ingredients, recipesTags, ...recipes } =
                createRecipesInput;
            console.log(ingredients);
            console.log(recipesTags);
            console.log(url);
            console.log(description);;

            const searchUser = await this.userRepository.findOne(
                currentUser,
                { where: { user_id: currentUser.user_id } }
            );
            console.log("222222");
            console.log(searchUser);
            console.log('회원 정보 확인');

            const impTags1 = [];
            for (let i = 0; i < ingredients.length; i++) {
                const ingredientTags = ingredients[i].replace('#', '');

                const prevTags1 = await this.recipesIngredientsRepository.findOne({
                    name: ingredientTags,
                });

                if (prevTags1) {
                    impTags1.push(prevTags1);

                } else {
                    const newTags1 = await this.recipesIngredientsRepository.save({ name: ingredientTags });
                    impTags1.push(newTags1);
                }
            }
            console.log("333333");
            console.log(impTags1);
            console.log("저장될 재료 태그 목록 확인");

            const impTags2 = [];
            for (let i = 0; i < recipesTags.length; i++) {
                const recipeTags = recipesTags[i].replace('#', '');
                const prevTags2 = await this.recipesTagRepository.findOne({
                    name: recipeTags,
                });

                if (prevTags2) {
                    impTags2.push(prevTags2);
                } else {
                    const newTags2 = await this.recipesTagRepository.save({ name: recipeTags })
                    impTags2.push(newTags2);
                }
            }
            console.log("444444");
            console.log(impTags2);
            console.log("저장될 레시피 태그 목록 확인");

            console.log("555555");
            console.log(ingredients);
            console.log("레시피 재료 DB로 전달될 값 확인");

            console.log("555555-1");
            console.log(recipesTags);
            console.log("레시피 태그 DB로 전달될 값 확인");

            console.log(recipes);

            // console.log(JSON.stringify(registRecipe.hits.hits, null, '  '))            

            await this.recipesRepository.save({
                ...recipes,

                url: url[0],
                user: searchUser,
                description: description[0],
                ingredients: ingredients[0],
                recipesTags: recipesTags[0],
            });
            console.log("666666");
            // console.log(registRecipe);
            console.log("레시피 DB로 전체 레시피 전달");

            for (let i = 0; i < url.length; i++) {
                await this.recipesImageRepository.save({
                    url: url[i],
                    description: description[i],
                    recipe: recipes.id
                });
            }
            console.log("777777");
            console.log(url);
            console.log("레시피 이미지 DB로 전달될 이미지 URL 확인");

            console.log("888888");
            console.log(description);
            console.log("레시피 이미지 DB로 전달될 설명 텍스트 확인");

            // if (registRecipe.isPro === 'COMMON') {
            //     await this.recipesRepository.save({
            //         user: user,
            //         isPro: user.isPro,
            //     })
            //     console.log('작성자: 일반인');
            // }
            // if (registRecipe.isPro === 'PRO') {
            //     await this.recipesRepository.save({
            //         user: user,
            //         isPro: user.isPro,
            //     })
            //     console.log('작성자: 전문가');
            // }
            return `DB 등록 완료: ${recipes.title[0]}`
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

    // async delete({ id, currentUser }) {
    //     try {
    //         const result = await this.recipesRepository.softDelete({
    //             id,
    //             user: currentUser.user_id,
    //         });
    //         return result.affected ? true : false;
    //     } catch (error) {
    //         console.log(error)
    //         if (error?.response?.data?.message || error?.response?.status) {
    //             console.log(error.response.data.message);
    //             console.log(error.response.status);
    //         } else {
    //             throw error;
    //         }
    //     }
    // }

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

    async deleteImage({ recipe_id }) {
        const images = await this.recipesImageRepository.find({ recipes: recipe_id })
        const imageURLs = await Promise.all(images.map(el => el.url))

        const storage = new Storage({
            keyFilename: process.env.STORAGE_KEY_FILENAME,
            projectId: process.env.STORAGE_PROJECT_ID,
        })

        for (let i = 0; i < imageURLs.length; i++) {
            const result = await storage
                .bucket(process.env.STORAGE_BUCKET)
                .file(imageURLs[i])
                .delete()
            return result;
        };

        const { url, ...user } = recipe_id
        const deleteUrl = { ...user, url: null }
        await this.recipesRepository.save(deleteUrl)

        return recipe_id ? true : false
    }
}