# 🥗 채식한상
> ***"나에게 맞는 채식 레시피로 맛있는 건강 밥상"***<br>   
채식에 관심이 싶지만 어디서부터 시작해야 할지 모르겠는 사람, 장기화된 코로나로 배달 음식을 질리도록 먹은 사람, 안 좋은 음식 습관으로 건강을 잃은 사람, 환경을 위해 색다른 방법을 연구하는 사람 등 다양한 이유로 채식을 시작하는 사람들을 위한 채식주의 레시피와 요리를 소개하고 전달하는 구독 서비스입니다. <br>   
채식한상은 6가지의 채식주의자 유형으로 세분화된 카테고리를 운영하고 다양한 전문가와 일반인이 직접 작성한 채식 레시피를 모아서 보여줍니다.
또한 친환경 농가에서 재배한 신선한 채소를 채식한상 만의 특별한 레시피와 함께 보내주는 구독 서비스를 제공합니다. <br>   
나를 위해서, 그리고 지구를 위해서 지금 바로 채식한상을 시작하세요!

![title](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/eaa7e500-24db-4068-87a0-272a6fa420e5/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220610%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220610T043211Z&X-Amz-Expires=86400&X-Amz-Signature=0f2507f8128105a1c7c998d3b099b42865e91c1b9097583c6fba9344f02bb0af&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22&x-id=GetObject)   

<br>

# 🛠 배포 주소
> 채식한상 [https://vegantable.shop](https://vegantable.shop)   

<br>

# 🛠 기술 스택
`JavaScript`, `TypeScript`, `Node.js`,`Nest.js`, `Express`, `Axios`, `MySQL`, `Redis`, `TypeORM`, `GraphQL`, `Docker`, `Git`, `Github`, `GCP` 

<br>

# 🛠 ERD & Data Schema
![title](https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F2f7ecef5-eb63-4201-91bf-8c046de7ae40%2FUntitled.png?table=block&id=f56f8ea1-c11b-42f5-8f1b-7499f67268d3&spaceId=9c9b02bc-6cb6-4924-bf38-dad25e0fe77b&width=2000&userId=3179b1f9-9ce5-48b3-bc94-f198bb86779c&cache=v2)   
![title](https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F997af402-2417-4151-bec9-cda59fa655cc%2FUntitled.png?table=block&id=c8a9f928-e6d2-4dff-a486-95816b65c05e&spaceId=9c9b02bc-6cb6-4924-bf38-dad25e0fe77b&width=2000&userId=3179b1f9-9ce5-48b3-bc94-f198bb86779c&cache=v2)   

<br>



# 🛠 파이프라인
![title](https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F21d50924-8de2-40d6-8872-e76c1b7af037%2FUntitled.png?table=block&id=ffbdad91-4c69-4094-a3b0-f46283aff87b&spaceId=9c9b02bc-6cb6-4924-bf38-dad25e0fe77b&width=2000&userId=3179b1f9-9ce5-48b3-bc94-f198bb86779c&cache=v2)   

<br>

# 🛠 API
![title](https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F7c9b3ac4-d1c9-4fc4-9c69-142178418a60%2FUntitled.png?table=block&id=63ef3d91-6e91-418d-8aa7-584025826743&spaceId=9c9b02bc-6cb6-4924-bf38-dad25e0fe77b&width=2000&userId=3179b1f9-9ce5-48b3-bc94-f198bb86779c&cache=v2)   

<br>

# 🛠 폴더 구조
```
📦VeganTable-server
 ┣ 📂src
 ┃ ┣ 📂apis
 ┃ ┃ ┣ 📂Transactions
 ┃ ┃ ┃ ┣ 📂entities
 ┃ ┃ ┃ ┃ ┗ 📜paymentTransaction.entity.ts
 ┃ ┃ ┃ ┣ 📜paymentTransaction.module.ts
 ┃ ┃ ┃ ┣ 📜paymentTransaction.resolver.ts
 ┃ ┃ ┃ ┗ 📜paymentTransaction.service.ts
 ┃ ┃ ┣ 📂auth
 ┃ ┃ ┃ ┣ 📜auth.controller.ts
 ┃ ┃ ┃ ┣ 📜auth.module.ts
 ┃ ┃ ┃ ┣ 📜auth.resolver.ts
 ┃ ┃ ┃ ┗ 📜auth.service.ts
 ┃ ┃ ┣ 📂iamport
 ┃ ┃ ┃ ┗ 📜iamport.service.ts
 ┃ ┃ ┣ 📂recipeScrap
 ┃ ┃ ┃ ┣ 📂entities
 ┃ ┃ ┃ ┃ ┗ 📜recipeScrap.entity.ts
 ┃ ┃ ┃ ┣ 📜recipeScrap.module.ts
 ┃ ┃ ┃ ┣ 📜recipeScrap.resolver.ts
 ┃ ┃ ┃ ┗ 📜recipeScrap.service.ts
 ┃ ┃ ┣ 📂recipes
 ┃ ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┃ ┣ 📜createRecipes.input.ts
 ┃ ┃ ┃ ┃ ┗ 📜updateRecipes.input.ts
 ┃ ┃ ┃ ┣ 📂entities
 ┃ ┃ ┃ ┃ ┗ 📜recipes.entity.ts
 ┃ ┃ ┃ ┣ 📜recipes.module.ts
 ┃ ┃ ┃ ┣ 📜recipes.resolver.ts
 ┃ ┃ ┃ ┗ 📜recipes.service.ts
 ┃ ┃ ┣ 📂recipesImage
 ┃ ┃ ┃ ┗ 📂entities
 ┃ ┃ ┃ ┃ ┗ 📜recipesImage.entity.ts
 ┃ ┃ ┣ 📂recipesIngrediants
 ┃ ┃ ┃ ┗ 📂entities
 ┃ ┃ ┃ ┃ ┗ 📜recipesIngrediants.entity.ts
 ┃ ┃ ┣ 📂recipesTag
 ┃ ┃ ┃ ┗ 📂entities
 ┃ ┃ ┃ ┃ ┗ 📜recipesTag.entity.ts
 ┃ ┃ ┣ 📂recipiesReply
 ┃ ┃ ┃ ┣ 📂entities
 ┃ ┃ ┃ ┃ ┗ 📜recipes.reply.entity.ts
 ┃ ┃ ┃ ┣ 📜recipesReply.module.ts
 ┃ ┃ ┃ ┣ 📜recipesReply.resolver.ts
 ┃ ┃ ┃ ┗ 📜recipesReply.service.ts
 ┃ ┃ ┗ 📂user
 ┃ ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┃ ┣ 📜createUser.input.ts
 ┃ ┃ ┃ ┃ ┗ 📜updateUser.input.ts
 ┃ ┃ ┃ ┣ 📂entities
 ┃ ┃ ┃ ┃ ┗ 📜user.entity.ts
 ┃ ┃ ┃ ┣ 📜user.module.ts
 ┃ ┃ ┃ ┣ 📜user.resolver.ts
 ┃ ┃ ┃ ┗ 📜user.service.ts
 ┃ ┣ 📂commons
 ┃ ┃ ┣ 📂auth
 ┃ ┃ ┃ ┣ 📜gql-auth.guard.ts
 ┃ ┃ ┃ ┣ 📜gql-user.param.ts
 ┃ ┃ ┃ ┣ 📜jwt-access.strategy.ts
 ┃ ┃ ┃ ┣ 📜jwt-refresh.strategy.ts
 ┃ ┃ ┃ ┣ 📜jwt-social-google.strategy.ts
 ┃ ┃ ┃ ┣ 📜jwt-social-kakao.strategy.ts
 ┃ ┃ ┃ ┗ 📜jwt-social-naver.strategy.ts
 ┃ ┃ ┣ 📂filter
 ┃ ┃ ┃ ┗ 📜http-exception.filter.ts
 ┃ ┃ ┣ 📂graphql
 ┃ ┃ ┃ ┗ 📜schema.gql
 ┃ ┃ ┗ 📂libraries
 ┃ ┃ ┃ ┗ 📜utils.ts
 ┃ ┣ 📜.DS_Store
 ┃ ┣ 📜app.module.ts
 ┃ ┗ 📜main.ts
 ┣ 📂test
 ┃ ┣ 📜app.e2e-spec.ts
 ┃ ┗ 📜jest-e2e.json
 ┣ 📜.DS_Store
 ┣ 📜.dockerignore
 ┣ 📜.env
 ┣ 📜.env.dev
 ┣ 📜.eslintrc.js
 ┣ 📜.gitignore
 ┣ 📜.prettierrc
 ┣ 📜Dockerfile
 ┣ 📜README.md
 ┣ 📜docker-compose.dev.yaml
 ┣ 📜docker-compose.yaml
 ┣ 📜gcp-vegan-project.json
 ┣ 📜nest-cli.json
 ┣ 📜package-lock.json
 ┣ 📜package.json
 ┣ 📜tsconfig.build.json
 ┣ 📜tsconfig.json
 ┗ 📜yarn.lock
```
<br>


# 🛠 .env 설정
```env
VEGAN_STORAGE_BUCKET
STORAGE_KEY_FILENAME
STORAGE_PROJECT_ID

OAUTH_GOOGLE_ID
OAUTH_GOOGLE_SECRET
OAUTH_GOOGLE_CALLBACK

OAUTH_NAVER_ID
OAUTH_NAVER_SECRET
OAUTH_NAVER_CALLBACK

OAUTH_KAKAO_ID
OAUTH_KAKAO_SECRET
OAUTH_KAKAO_CALLBACK

ACCESS_TOKEN
REFRESH_TOKEN

IAMPORT_API_KEY
IAMPORT_SECRET

SMS_APP_KEY
SMS_X_SECRET_KEY
SMS_SENDER
```
<br>

# 🛠 프로젝트 설치 방법 & 실행 방법
```
git clone https://github.com/code-bootcamp/f6b2-team2-server

yarn install
```
<br>

# 💻 BackEnd 팀원 역할
## 김다혜
📧 kimdre88@gmail.com<br>
📝 https://velog.io/@hedakim<br>
🐱 https://github.com/dahekim <br>
* 회원가입 API, 로그인 API, 소셜 로그인 API, 게시물 스크랩 API, 게시물 댓글 API, 이미지 업로드 API, 게시물 검색 API 생성 및 유지 보수
* 결제 API, 게시물 CRUD API 유지보수
* 백엔드 서버 배포 및 DevOps 업무
* API Docs 작성
* ReadMe 작성
* Git 관리
* 노션 제작 및 관리
* 기타 공유 문서 작업 및 관리

## 최병집
📧 lovotika@gmail.com <br>
📝 https://iamdevray.notion.site/41b0959691654514b260e069d523a9d9<br>
🐱 https://github.com/iamdevray<br>
* 결제 API, 게시물 CRUD API 생성 및 유지보수
* ERD, Data Schema, Pipeline 작업
* 트랜잭션 관리
* Git 관리
* 기타 공유 문서 작업 및 관리
