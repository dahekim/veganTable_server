import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UpdateBannerImageInput {
    @Field(() => String, { defaultValue: true })
    url?: string;
}