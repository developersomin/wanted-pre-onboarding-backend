
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## 요구사항 분석

<<<<<<< HEAD
- ORM 사용하여 구현 : ORM인 `typeORM` 사용
- RDBMS 사용 (SQLite, PostgreSQL 등) : `mysql` 사용
- 코드 가독성을 위해 `prettier` 설정
- 필요한 테이블 ( `사용자`, `회사` ,`채용공고`, `지원내역(선택사항)`) : `User` `Company` `Recruitment` `UserRecruitment` 테이블 생성
- Git commit 메시지 컨벤션 : [Feat], [Fix], [Docs] ,[Test] 사용
- Unit Test : recruitment, user, UserRecruitment 테스트 코드 작성

## 구현 과정

### 1. Entity Diagram

![image](file:///home/somin/%EC%82%AC%EC%A7%84/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202023-10-09%2017-56-03.png
)

`채용공고(recruitment)` 와 `사용자(user)` 다대다 관계를 일대다 다대일 로 구현

`채용공고(recruitment)` 와 `회사(Company)` 다대일 관계 구현

### 2-1. 회사 등록

![image](file:///home/somin/%EC%82%AC%EC%A7%84/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202023-10-09%2018-16-22.png
)

![image](file:///home/somin/%EC%82%AC%EC%A7%84/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202023-10-09%2018-16-54.png
)
채용 공고를 위해 회사 등록 ( mysql에서 직접 생성 )

### 2-2. 사용자 등록

![image](file:///home/somin/%EC%82%AC%EC%A7%84/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202023-10-09%2018-23-49.png
)

![image](file:///home/somin/%EC%82%AC%EC%A7%84/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202023-10-09%2018-24-02.png
)

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
  apply(userId:"83d33c1d-6685-11ee-8bc1-e00af663ff07", recruitmentId:"1ea1f0b6-f750-47cf-a216-7de277a248a3"){
    id
    user{
      id
    }
    recruitment{
      id
    }
  }
}
```
```graphql
{
  "data": {
    "apply": {
      "id": "2fec0574-b93b-4610-819d-90f70f5f4971",
      "user": {
        "id": "83d33c1d-6685-11ee-8bc1-e00af663ff07"
      },
      "recruitment": {
        "id": "1ea1f0b6-f750-47cf-a216-7de277a248a3"
      }
    }
  }
}
```
![image](file:///home/somin/%EC%82%AC%EC%A7%84/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202023-10-09%2019-12-53.png
)

안소민 apply가 true로 바뀐 것을 볼 수 있다. 여기서 신청한 사용자가 다른 공고를 한번 더 신청 하면 실패하는 것을 볼 수 있다.
```graphql
mutation{
  apply(userId:"83d33c1d-6685-11ee-8bc1-e00af663ff07", recruitmentId:"d6aa457f-6747-4780-8f47-afc594a9bd4c"){
    id
    user{
      id
    }
    recruitment{
      id
    }
  }
}
```
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
        "apply"
      ],
      "extensions": {
        "code": "INTERNAL_SERVER_ERROR",
        "stacktrace": [
          "UnprocessableEntityException: 지원하신 내역이 있습니다. 사용자는 1회만 지원 가능합니다.",
          "    at UserService.checkApply (/home/somin/WebstormProjects/wanted-pre-onboarding-backend/backend/src/apis/user/user.service.ts:18:13)",
          "    at UserRecruitmentService.apply (/home/somin/WebstormProjects/wanted-pre-onboarding-backend/backend/src/apis/userRecruitment/user-recruitment.service.ts:24:26)",
          "    at processTicksAndRejections (node:internal/process/task_queues:95:5)",
          "    at target (/home/somin/WebstormProjects/wanted-pre-onboarding-backend/backend/node_modules/@nestjs/core/helpers/external-context-creator.js:74:28)",
          "    at Object.apply (/home/somin/WebstormProjects/wanted-pre-onboarding-backend/backend/node_modules/@nestjs/core/helpers/external-proxy.js:9:24)"
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

