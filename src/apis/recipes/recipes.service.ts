import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FileUpload } from "graphql-upload";
import { Brackets, getConnection, getRepository, Repository } from "typeorm";
import { User } from "../user/entities/user.entity";
import { Recipes } from "./entities/recipes.entity";
import { getToday } from 'src/commons/libraries/utils'
import { Storage } from '@google-cloud/storage'
import { v4 as uuidv4 } from 'uuid'
import { RecipesImage } from "../recipesImage/entities/recipesImage.entity";
import { RecipesIngredients } from "../recipesIngrediants/entities/recipesIngrediants.entity";
import { RecipeScrap } from "../recipeScrap/entities/recipeScrap.entity";
import { RecipesTag } from "../recipesTag/entities/recipesTag.entity";
import { title } from "process";


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
        return await getConnection()
            .createQueryBuilder()
            .select('recipes')
            .from(Recipes, 'recipes')
            .leftJoinAndSelect('recipes.user', 'user')
            .leftJoinAndSelect('recipes.recipesImages', 'image')
            .leftJoinAndSelect('recipes.ingredients', 'ingredients')
            .leftJoinAndSelect('recipes.recipesTags', 'recipesTags')
            .orderBy('recipes.createdAt', 'DESC')
            .getMany()
    }

    async fetchRecipe({ id }) {
        return await getConnection()
            .createQueryBuilder()
            .select('recipes')
            .from(Recipes, 'recipes')
            .leftJoinAndSelect('recipes.user', 'user')
            .leftJoinAndSelect('recipes.recipesImages', 'image')
            .leftJoinAndSelect('recipes.ingredients', 'ingredients')
            .leftJoinAndSelect('recipes.recipesTags', 'recipesTags')
            .where({ id })
            .getOne()
    }

    async fetchRecipeTypes({ types }) {
        return await getConnection()
            .createQueryBuilder()
            .select('recipes')
            .from(Recipes, 'recipes')
            .leftJoinAndSelect('recipes.user', 'user')
            .leftJoinAndSelect('recipes.recipesImages', 'image')
            .leftJoinAndSelect('recipes.ingredients', 'ingredients')
            .leftJoinAndSelect('recipes.recipesTags', 'recipesTags')
            .where({ types })
            .orderBy('recipes.createdAt', 'DESC')
            .getMany()
    }

    async fetchMyRecipe({ user_id }) {
        return await getRepository(Recipes)
            .createQueryBuilder('recipes')
            .leftJoinAndSelect('recipes.user', 'user')
            .leftJoinAndSelect('recipes.recipesImages', 'image')
            .leftJoinAndSelect('recipes.ingredients', 'ingredients')
            .leftJoinAndSelect('recipes.recipesTags', 'recipesTags')
            .where('user.user_id = userUserId', { user_id })
            .orderBy('recipes.createdAt', 'DESC')
            .getMany();
    }

    async fetchRecipeIsPro({ isPro }) {
        return await getRepository(Recipes)
            .createQueryBuilder('recipes')
            .leftJoinAndSelect('recipes.user', 'user')
            .leftJoinAndSelect('recipes.recipesImages', 'image')
            .leftJoinAndSelect('recipes.ingredients', 'ingredients')
            .leftJoinAndSelect('recipes.recipesTags', 'recipesTags')
            .where('user.isPro = userIsPro', { isPro })
            .orderBy('recipes.createdAt', 'DESC')
            .getManyAndCount();
    }

    // async fetchScrappedRecipes() {
    //     return await getRepository(Recipes)
    //         .createQueryBuilder('recipes')
    //         .leftJoinAndSelect('recipes.user', 'user')
    //         .leftJoinAndSelect('recipes.recipesImages', 'image')
    //         .leftJoinAndSelect('recipes.ingredients', 'ingredients')
    //         .leftJoinAndSelect('recipes.recipesTags', 'recipesTags')
    //         .where({scrapCount})
    //         .orderBy('recipes.scrapCount', 'DESC')
    //         .getManyAndCount();
    // }

    async create({ createRecipesInput }, currentUser) {
        try {
            const { url, description, ingredients, recipesTags, ...recipes } =
                createRecipesInput;

            const searchUser = await this.userRepository.findOne(
                currentUser,
                { where: { user_id: currentUser.user_id } }
            );

            const impTags1 = [];
            if (ingredients.length) {
                for (let i = 0; i < ingredients.length; i++) {
                    const ingredientTags = ingredients[i].replace('#', '');
                    const prevTags1 = await this.recipesIngredientsRepository.findOne(
                        { name: ingredientTags },
                    );

                    if (prevTags1) {
                        impTags1.push(prevTags1);
                    } else {
                        const newTags1 = await this.recipesIngredientsRepository.save({ name: ingredientTags });
                        impTags1.push(newTags1);
                    }
                }
            }

            const impTags2 = [];
            if (recipesTags.length) {
                for (let i = 0; i < recipesTags.length; i++) {
                    const recipeTags = recipesTags[i].replace('#', '');
                    const prevTags2 = await this.recipesTagRepository.findOne(
                        { name: recipeTags },
                    );

                    if (prevTags2) {
                        impTags2.push(prevTags2);
                    } else {
                        const newTags2 = await this.recipesTagRepository.save({ name: recipeTags })
                        impTags2.push(newTags2);
                    }
                }
            }

            const registRecipe = await this.recipesRepository.save({
                ...recipes,
                user: searchUser,
                ingredients: impTags1,
                recipesTags: impTags2,

            });
            console.log(registRecipe)

            for (let i = 0; i < url.length; i++) {
                await this.recipesImageRepository.save({
                    url: url[i],
                    description: description[i],
                    recipes: registRecipe
                });
            }
            return await registRecipe;

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

    async search({ input, page }) {
        const results = getRepository(Recipes)
        .createQueryBuilder('recipes')
        .leftJoinAndSelect('recipes.ingredients', 'ingredients')
        .leftJoinAndSelect('recipes.recipesTags', 'tags')

        if(input === null || input === ""){
            throw new BadRequestException("검색어를 입력해주세요.")
        }

        if(input){
            results.where(
                new Brackets( (qb) => {
                    qb.where('recipes.title LIKE :title', { title: `%${input}%` })
                    .orWhere('ingredients.name LIKE :name', { name: `%${input}%` } )
                    .orWhere('tags.name LIKE :name', { name: `%${input}%`})
                })
            )
        }

        
        if(page){
            const result = await results.orderBy('recipes.createdAt', 'DESC')
            .getMany()
        return result
        } else {
            const result = await results.orderBy('recipes.createdAt', 'DESC')
            .getMany()
            return result
        }
    }
}