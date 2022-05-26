import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FileUpload } from "graphql-upload";
import { Connection, getRepository, Repository } from "typeorm";
import { User } from "../user/entities/user.entity";
import { Recipes } from "./entities/recipes.entity";
import { getToday } from 'src/commons/libraries/utils'
import { Storage } from '@google-cloud/storage'
import { v4 as uuidv4 } from 'uuid'

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

        private readonly connection: Connection
    ) { }

    async fetchRecipesAll() {
        return await getRepository(Recipes)
            .createQueryBuilder('recipes')
            .leftJoinAndSelect('recipes.user', 'user')
            .orderBy('recipes.createdAt', 'DESC')
            .getMany();
    }

    async fetchRecipesTitlewithUserid({ user_id }) {
        return await getRepository(Recipes)
            .createQueryBuilder('recipes')
            .select('recipes.title', 'title')
            .leftJoinAndSelect('recipes.user', 'user')
            .where('user.user_id = :userUserId', { user_id })
            .orderBy
    }

    async

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

    async uploadImage( {files }: IFile ){
        const bucket = process.env.VEGAN_STORAGE_BUCKET
        const storage = new Storage({
            keyFilename: process.env.STORAGE_KEY_FILENAME,
            projectId: process.env.STORAGE_PROJECT_ID,
        }).bucket(bucket)

        const waitedFiles = await Promise.all(files)

        const results = await Promise.all(waitedFiles.map( file => {
            new Promise( (resolve, reject) => {
                const fileName = `${getToday()}/${uuidv4()}/origin/${file.filename}`
                file.createReadStream()
                .pipe(storage.file(fileName).createWriteStream ())
                .on( "finish" , () => resolve (`${bucket}/${fileName}`) )
                .on( "error" , () =>reject() )
                })
            })
        )
        return results

    }

    // async deleteImage({user, recipe_id, image_id }){
    //     const bucket = process.env.VEGAN_STORAGE_BUCKET
    //     const storage = new Storage({
    //         keyFilename: process.env.STORAGE_KEY_FILENAME,
    //         projectId: process.env.STORAGE_PROJECT_ID,
    //     }).bucket(bucket)

    //     const prevImage = user.url.split(`${process.env.VEGAN_STORAGE_BUCKET}/`)
    //     const prevImageName = prevImage[prevImage.length - 1]

    //     const result = await storage.file(prevImageName).delete()

    //     const { profilePic, ...user } = user;
    //     const deleteUrl = { ...user, profilePic: null };
    //     await this.recipesRepository.save(deleteUrl);

    //     return result ? true : false
    
    // }
}