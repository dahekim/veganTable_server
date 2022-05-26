import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FileUpload } from "graphql-upload";
import { Connection, getRepository, Repository } from "typeorm";
import { User } from "../user/entities/user.entity";
import { CATEGORY_TYPES, Recipes } from "./entities/recipes.entity";
import { getToday } from 'src/commons/libraries/utils'
import { Storage } from '@google-cloud/storage'
import { v4 as uuidv4 } from 'uuid'
import { CreateRecipesInput } from "./dto/createRecipes.input";

interface IFile{
    files:FileUpload[]
}

@Injectable()
export class RecipesService {
    constructor(
        @InjectRepository(Recipes)
        private readonly recipesRepository: Repository<Recipes>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        // private readonly createRecipesInput: CreateRecipesInput,
        private readonly connection: Connection
    ) {}

    async fetchRecipesAll() {
        return await getRepository(Recipes)
            .createQueryBuilder('recipes')
            .leftJoinAndSelect('recipes.user', 'user')
            .orderBy('recipes.createdAt', 'DESC')
            .getMany();
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

    async fetchRecipesTitlewithUserid({ user_id }) {
        return await getRepository(Recipes)
            .createQueryBuilder('recipes')
            .select('recipes.title', 'title')
            .leftJoinAndSelect('recipes.user', 'user')
            .where('user.user_id = :userUserId', { user_id })
            .orderBy
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



    async create({ createRecipesInput }) {
        const result = await this.recipesRepository.save({
            ...createRecipesInput,
        });
        return result;
    }

    async update({ id, updateRecipesInput }) {
        const recipes = await this.recipesRepository.findOne({
            where: { id, }
        });

        const newRecipes = {
            ...recipes,
            ...updateRecipesInput,
        }
        return await this.recipesRepository.save(newRecipes);
    }

    async delete({ id }) {
        const result = await this.recipesRepository.softDelete({ id, });
        return result.affected ? true : false;
    }

    async uploadImages( {files}: IFile ){
        const bucket = process.env.VEGAN_STORAGE_BUCKET
        const storage = new Storage({
            keyFilename: process.env.STORAGE_KEY_FILENAME,
            projectId: process.env.STORAGE_PROJECT_ID,
        }).bucket(bucket)

        const waitedFiles = await Promise.all(files)
        const results = await Promise.all(waitedFiles.map( file => {
            return new Promise( (resolve, reject) => {
                const fileName = `recipes/${getToday()}/${uuidv4()}/${file.filename}`
                file
                .createReadStream()
                .pipe(storage.file(fileName).createWriteStream())
                .on( "finish" , () => resolve (`${bucket}/${fileName}`) )
                .on( "error" , (error) => reject("🔔"+error) )
                })
            })
        )
        return results
    }

    async deleteImage({recipe_id}){
        const recipeId = await this.recipesRepository.findOne({ id: recipe_id })

        const prevImage = recipeId.recipesPic.split(`${process.env.VEGAN_STORAGE_BUCKET}/`)
        const prevImageName = prevImage[prevImage.length - 1]

        const storage = new Storage({
            keyFilename: process.env.STORAGE_KEY_FILENAME,
            projectId: process.env.STORAGE_PROJECT_ID,
        })

        const result = await storage
        .bucket(process.env.STORAGE_BUCKET)
        .file(prevImageName)
        .delete()

        const { recipesPic, ...user } = recipeId
        const deleteUrl = { ...user, recipesPic: null }
        await this.recipesRepository.save(deleteUrl)

        return result ? true : false
    }
}