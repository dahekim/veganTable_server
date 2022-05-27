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
        return await this.recipesRepository.find();
    }
    async fetchRecipeTypes({ types }) {
        await this.recipesRepository.find({
            where: { types }
        })
        types = types.toUpperCase();

        const { ...rest } = CATEGORY_TYPES
        if (types !== 'ALL') {
            let typesEnum: CATEGORY_TYPES;
            if (types === "VEGAN") typesEnum = CATEGORY_TYPES.VEGAN;
            else if (types === "LACTO") typesEnum = CATEGORY_TYPES.LACTO;
            else if (types === "OVO") typesEnum = CATEGORY_TYPES.OVO;
            else if (types === "LACTO-OVO") typesEnum = CATEGORY_TYPES.LACTO_OVO;
            else if (types === "PESCO") typesEnum = CATEGORY_TYPES.PESCO;
            else if (types === "POLLO") typesEnum = CATEGORY_TYPES.POLLO;
            else {
                throw new ConflictException('채식 타입을 정확히 선택해 주세요.');
            }
            const checkedTypes = await this.recipesRepository.save({
                types: typesEnum,
            })
            return checkedTypes;
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
        try {
            const { url, description, ingredients, recipesTags, ...recipes } =
                createRecipesInput;

            const searchUser = await this.userRepository.findOne(
                currentUser,
                { where: { user_id: currentUser.user_id } }
            );

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

            const registRecipe = await this.recipesRepository.save({
                ...recipes,

                url: url[0],
                user: searchUser,
                description: description[0],
                ingredients: ingredients[0],
                recipesTags: recipesTags[0],
            });

            for (let i = 0; i < url.length; i++) {
                await this.recipesImageRepository.save({
                    url: url[i],
                    description: description[i],
                    recipe: recipes.id
                });
            }

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