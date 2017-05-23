# TEAM :: CafeIn4
# MachumCafe_Server

| HTTP Method | URL Path                          | 역할                    | 진행 여부     | 비고       |
|:-----------:|:---------------------------------:|:----------------------:|:-----------:|:---------:|        
|    GET      |api/v1/admin/cafe                  |카페 목록 크롤링 DB저장      |     O       |서울,경기 완료|
|    POST     |api/v1/admin/suggestion/uploads    |새로운 카페 제보(이미지업로드) |     O       |           |
|    POST     |api/v1/admin/suggestion/newcafe    |새로운 카페 제보            |     O       |           |
|    POST     |api/v1/cafe                        |현위치 반경 1km 내 카페 목록  |     O      |            |
|    GET      |api/v1/cafe/id                     |특정카페 불러오기            |     O      |            |
|    POST     |api/v1/user/register               |회원가입                   |     O      |            |
|    POST     |api/v1/user/login                  |로그인                    |     O       |            |
|    GET      |api/v1/user/logout                 |로그아웃                   |     O       |            |
|    GET      |api/v1/user/id/bookmark            |즐겨찾기 목록 가져오기        |     O       |            |
|    PUT      |api/v1/user/id/bookmark            |즐겨찾기 수정(삭제&추가)      |     O       |            |
