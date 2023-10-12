
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## 요구사항 분석

- ORM 사용하여 구현 : ORM인 `typeORM` 사용
- RDBMS 사용 (SQLite, PostgreSQL 등) : `mysql` 사용
- 코드 가독성을 위해 `prettier` 설정
- 필요한 테이블 ( `사용자`, `회사` ,`채용공고`, `지원내역(선택사항)`) : `user` `company` `recruitment` `recruitment_users_user(자동생성)` 테이블 생성
- Git commit 메시지 컨벤션 : [init] , [Feat], [Fix], [Docs] ,[Test] ,[Style] 사용
- Unit Test : recruitmentService, userService 테스트 코드 작성

## 개발 환경 
<li> Ubuntu , WebStrom </li>
<li> Nest.js , GraphQL, TypeORM , MySQL </li>



## 구현 과정

### 1. Entity Diagram

![스크린샷 2023-10-10 23-09-12](https://github.com/developersomin/wanted-pre-onboarding-backend/assets/127207131/1bb93313-1261-4ebc-8e1a-796b9c2400df)


`채용공고(recruitment)` 와 `사용자(user)` 다대다 관계 구현

`채용공고(recruitment)` 와 `회사(Company)` 다대일 관계 구현

### 2-1. 회사 등록

![2](https://github.com/developersomin/wanted-pre-onboarding-backend/assets/127207131/b9987829-afcd-4def-8cce-71f5696b17a9)


![3](https://github.com/developersomin/wanted-pre-onboarding-backend/assets/127207131/69db4364-5946-4a60-ba4a-5e0f44c74cc5)
채용 공고를 위해 회사 등록 ( mysql에서 직접 생성 )

### 2-2. 사용자 등록

![4](https://github.com/developersomin/wanted-pre-onboarding-backend/assets/127207131/7cc242f4-157a-4f3d-9a06-60918c52abf8)

![5](https://github.com/developersomin/wanted-pre-onboarding-backend/assets/127207131/1a4928ab-c0cd-4e63-9be3-ee2ac910fa75)


채용 공고 신청을 위해 사용자 등록 ( apply 값은 디폴트 값을 false 했기 때문에 0으로 출력)

### 3-1. 채용 공고 CRUD ( 등록 )
카카오 백엔드 공고 등록
```graphql
mutation{
  createRecruitment(createRecruitmentInput:{
    position: "백엔드"
    reward: 200000
    contents: "카카오에서 백엔드 주니어 개발자를 채용합니다."
    stack: "node.js"
    companyId: "9b54313e-6420-11ee-8bc1-e00af663ff07"
  }){
    id
    position
    reward
    contents
    stack
  }
}
```
```graphql
{
  "data": {
    "createRecruitment": {
      "id": "1ea1f0b6-f750-47cf-a216-7de277a248a3",
      "position": "백엔드",
      "reward": 200000,
      "contents": "카카오에서 백엔드 주니어 개발자를 채용합니다.",
      "stack": "node.js"
    }
}
```

카카오 프론트엔드 공고 등록
```graphql
mutation{
  createRecruitment(createRecruitmentInput:{
    position: "프론트"
    reward: 300000
    contents: "카카오에서 프론트 시니어 개발자를 채용합니다."
    stack: "react"
    companyId: "9b54313e-6420-11ee-8bc1-e00af663ff07"
  }){
    id
    position
    reward
    contents
    stack
  }
}
```

```graphql
{
  "data": {
    "createRecruitment": {
      "id": "d6aa457f-6747-4780-8f47-afc594a9bd4c",
      "position": "프론트",
      "reward": 300000,
      "contents": "카카오에서 프론트 시니어 개발자를 채용합니다.",
      "stack": "react"
    }
  }
}
```

### 3-2. 채용 공고 CRUD ( 수정 )

```graphql
mutation{
  updateRecruitment(
    recruitmentId: "1ea1f0b6-f750-47cf-a216-7de277a248a3",
    updateRecruitmentInput:{
      reward: 150000
    }){
    position
    reward
    contents
    stack
  }
}
```

```graphql
{
  "data": {
    "updateRecruitment": {
      "position": "백엔드",
      "reward": 150000,
      "contents": "카카오에서 백엔드 주니어 개발자를 채용합니다.",
      "stack": "node.js"
    }
  }
}
```

### 3-3. 채용 공고 CRUD ( 삭제 )

```graphql
mutation{
  deleteRecruitment(recruitmentId:"99ef3e7d-9c8a-43ea-9779-7024cca4f168")
}
```

```graphql
{
  "data": {
    "deleteRecruitment": true
  }
}
```

### 3-4. 채용 공고 CRUD ( 채용공고 모든 데이터 조회 )

```graphql
query{
  fetchRecruitments{
    id
    company{
      id
      country
      area
    }
    position
    reward
    stack
  }
}
```

```graphql
{
  "data": {
    "fetchRecruitments": [
      {
        "id": "1ea1f0b6-f750-47cf-a216-7de277a248a3",
        "company": {
          "id": "9b54313e-6420-11ee-8bc1-e00af663ff07",
          "country": "한국",
          "area": "판교"
        },
        "position": "백엔드",
        "reward": 150000,
        "stack": "node.js"
      },
      {
        "id": "d6aa457f-6747-4780-8f47-afc594a9bd4c",
        "company": {
          "id": "9b54313e-6420-11ee-8bc1-e00af663ff07",
          "country": "한국",
          "area": "판교"
        },
        "position": "프론트",
        "reward": 300000,
        "stack": "react"
      }
    ]
  }
}
```


### 4. 채용공고 검색 기능 구현 ( 선택사항 및 가산점 요소 )
```graphql
query{
  searchFindAll(search:"한국"){
   id
    company{
      id
      country
      area
    }
    position
    reward
    stack
  }
}
```

```graphql
{
  "data": {
    "searchFindAll": [
      {
        "id": "1ea1f0b6-f750-47cf-a216-7de277a248a3",
        "company": {
          "id": "9b54313e-6420-11ee-8bc1-e00af663ff07",
          "country": "한국",
          "area": "판교"
        },
        "position": "백엔드",
        "reward": 150000,
        "stack": "node.js"
      },
      {
        "id": "d6aa457f-6747-4780-8f47-afc594a9bd4c",
        "company": {
          "id": "9b54313e-6420-11ee-8bc1-e00af663ff07",
          "country": "한국",
          "area": "판교"
        },
        "position": "프론트",
        "reward": 300000,
        "stack": "react"
      }
    ]
  }
}
```

### 5. 채용 상세 페이지 
해당 회사가 올린 다른 채용공고 추가적으로 포함 (선택사항 및 가산점요소)
```graphql
query{
  detailFetchRecruitment(recruitmentId:"1ea1f0b6-f750-47cf-a216-7de277a248a3"){
    id
    company{
      id
      country
      area
    }
    position
    reward
    stack
    contents
    companyRecruitmentId
  }
}
```
```graphql
{
  "data": {
    "detailFetchRecruitment": {
      "id": "1ea1f0b6-f750-47cf-a216-7de277a248a3",
      "company": {
        "id": "9b54313e-6420-11ee-8bc1-e00af663ff07",
        "country": "한국",
        "area": "판교"
      },
      "position": "백엔드",
      "reward": 150000,
      "stack": "node.js",
      "contents": "카카오에서 백엔드 주니어 개발자를 채용합니다.",
      "companyRecruitmentId": [
        "1ea1f0b6-f750-47cf-a216-7de277a248a3",
        "d6aa457f-6747-4780-8f47-afc594a9bd4c"
      ]
    }
  }
}
```
### 6.사용자 채용공고 지원( 선택사항 및 가산점 요소 )
```graphql
mutation{
    applyRecruitment(recruitmentId:"8a5116e8-cd12-41b3-89ce-9bcf80408326",
        userId:"83476cf2-6685-11ee-8bc1-e00af663ff07"){
        id
        stack
        contents
        users{
            id
            name
        }
    }
}
```
```graphql
{
  "data": {
    "applyRecruitment": {
      "id": "8a5116e8-cd12-41b3-89ce-9bcf80408326",
      "stack": "node.js",
      "contents": "카카오에서 백엔드 시니어 개발자를 채용합니다.",
      "users": [
        {
          "id": "83476cf2-6685-11ee-8bc1-e00af663ff07",
          "name": "강동원"
        }
      ]
    }
  }
}
```
![스크린샷 2023-10-10 23-19-04](https://github.com/developersomin/wanted-pre-onboarding-backend/assets/127207131/a62b75bb-f345-4e5a-9caa-b0311bb65595)

recruitment_users_user 라는 테이블에 채용공고의 id와 사용자의 id가 잘 들어 간것을 확인 할 수 있다.



요구사항으로 사용자는 채용공고 지원을 한번만 수행할 수 있다고 한다. 보통 사용자는 여러 채용공고에 지원 할 수 있어 다대다 관계로 설정하였고 기회는 한번뿐으므로 apply 컬럼을 만들어 지원현황을 표현했다. 디폴트 값으로 false를 설정하여 지원하면 true로 바뀌도록 구현하였다.

![스크린샷 2023-10-10 23-16-36](https://github.com/developersomin/wanted-pre-onboarding-backend/assets/127207131/761943ab-a4d3-4944-bf85-aa3bb86afb57)

강동원 apply가 true로 바뀐 것을 볼 수 있다. 여기서 신청한 사용자가 다른 공고를 한번 더 신청 하면 실패하는 것을 볼 수 있다.

```graphql
{
  "errors": [
    {
      "message": "지원하신 내역이 있습니다. 사용자는 1회만 지원 가능합니다.",
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "path": [
        "applyRecruitment"
      ],
      "extensions": {
        "code": "INTERNAL_SERVER_ERROR",
        "stacktrace": [
          "UnprocessableEntityException: 지원하신 내역이 있습니다. 사용자는 1회만 지원 가능합니다.",
          "    at UserService.checkApply (/home/somin/WebstormProjects/wanted-pre-onboarding-backend/backend/src/apis/user/user.service.ts:19:13)",
          "    at RecruitmentService.applyRecruitment (/home/somin/WebstormProjects/wanted-pre-onboarding-backend/backend/src/apis/recruitment/recruitment.service.ts:113:28)",
          "    at processTicksAndRejections (node:internal/process/task_queues:95:5)",
          "    at target (/home/somin/WebstormProjects/wanted-pre-onboarding-backend/backend/node_modules/@nestjs/core/helpers/external-context-creator.js:74:28)",
          "    at Object.applyRecruitment (/home/somin/WebstormProjects/wanted-pre-onboarding-backend/backend/node_modules/@nestjs/core/helpers/external-proxy.js:9:24)"
        ],
        "status": 422,
        "originalError": {
          "message": "지원하신 내역이 있습니다. 사용자는 1회만 지원 가능합니다.",
          "error": "Unprocessable Entity",
          "statusCode": 422
        }
      }
    }
  ],
  "data": null
}
```

### Installation

```
$ yarn install
```

### Running the app

```
$ yarn start:dev
```

### Test
```
$ yarn test
```
