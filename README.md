# 우리 아들 특별한 이은수

은수의 그림, 캐릭터, 동영상과 가족 추억을 모으는 성장 아카이브입니다. 데이터베이스 없이 파일만 바꾸면 내용을 추가할 수 있습니다.

## 1. 프로그램 설치와 실행

1. [Node.js 공식 사이트](https://nodejs.org/ko)에서 **LTS 버전**을 설치합니다.
2. 이 폴더 빈 곳에서 마우스 오른쪽 버튼을 누르고 **터미널에서 열기**를 선택합니다.
3. `npm install`을 입력하고 Enter를 누릅니다. 처음 한 번만 하면 됩니다.
4. `npm run dev`를 입력합니다.
5. 화면에 표시된 주소(보통 `http://localhost:3000`)를 Ctrl 키를 누른 채 클릭합니다.
6. 종료할 때는 터미널에서 `Ctrl + C`를 누릅니다.

## 2. 그림 추가

1. 그림 사진을 `public/images/drawings` 폴더에 넣습니다. 예: `my-robot.jpg`
2. `data/drawings.ts`를 메모장이나 VS Code로 엽니다.
3. 기존 항목 하나를 복사해 쉼표 뒤에 붙이고 내용을 바꿉니다.

```ts
{ id: 7, title: "새 그림 제목", date: "2026.08.20", description: "그림 설명", category: "상상", quote: "은수의 한마디", image: "/images/drawings/my-robot.jpg" },
```

`id`는 겹치지 않는 새 번호를 사용합니다. 카테고리는 `캐릭터`, `동물`, `가족`, `상상`, `학교`, `기타` 중 하나입니다.

## 3. 사진과 추억 추가

1. 사진을 `public/images/memories`에 넣습니다.
2. `data/memories.ts`에서 기존 항목을 복사한 뒤 제목, 날짜, 설명, 이미지 경로를 바꿉니다.
3. 대표 사진은 `public/images/eunsu`에 넣고 `components/EunsuArchive.tsx`에서 `hero-placeholder.svg`를 새 파일명으로 바꿉니다.

## 4. 캐릭터 추가

합법적으로 사용할 수 있는 이미지를 `public/images/characters`에 넣고 `data/characters.ts`의 기존 항목을 복사해 수정합니다. 인터넷의 캐릭터 이미지는 저작권이 있을 수 있으니 허락 없이 사용하지 마세요.

## 5. 동영상 추가

### YouTube

`data/videos.ts`에 항목을 추가하고 YouTube 주소의 영상 ID를 `youtubeId`에 적습니다. `youtube.com/watch?v=ABC123`이라면 ID는 `ABC123`입니다.

### 직접 찍은 MP4

1. 파일을 `public/videos`에 넣습니다.
2. 동영상 항목에서 `youtubeId`를 지우고 `videoUrl: "/videos/파일명.mp4"`를 적습니다.
3. 썸네일은 `public/images/videos`에 넣고 `thumbnail` 경로를 바꿉니다.

## 6. 글 수정 위치

- 은수 소개: `data/profile.ts`
- 그림: `data/drawings.ts`
- 캐릭터: `data/characters.ts`
- 동영상: `data/videos.ts`
- 추억: `data/memories.ts`
- 메인 문구와 오늘의 은수: `components/EunsuArchive.tsx`

저장하면 실행 중인 화면에 자동 반영됩니다. 글 양옆의 큰따옴표와 줄 끝의 쉼표는 지우지 않는 것이 안전합니다.

## 7. 인터넷에 공개하기 (Vercel)

1. GitHub에 무료 계정을 만들고 이 프로젝트를 새 저장소에 올립니다.
2. [Vercel](https://vercel.com)에 GitHub 계정으로 로그인합니다.
3. **Add New → Project**를 누릅니다.
4. 올린 저장소 옆의 **Import**를 누릅니다.
5. 설정을 바꾸지 말고 **Deploy**를 누릅니다.

가족 사진이 든 사이트를 공개하면 누구나 볼 수 있습니다. 공개 범위를 먼저 가족과 상의하세요. 비밀번호 보호 기능은 나중에 Supabase 같은 로그인 서비스를 연결해 추가할 수 있습니다.

## 개인정보와 사진 주의사항

- 집 주소, 학교 이름, 전화번호, 실시간 위치를 올리지 마세요.
- 휴대폰 사진에는 촬영 위치(EXIF GPS)가 들어 있을 수 있습니다. 올리기 전에 사진 앱에서 위치 정보를 제거하세요.
- 얼굴이 나온 다른 아이의 사진은 보호자 동의를 받은 뒤 사용하세요.
- 공개 전에 모든 샘플 내용과 YouTube 주소를 실제 사용할 내용으로 확인하세요.

## 프로젝트 구조

```text
app/                 사이트 시작 파일과 전체 스타일
components/          화면과 검색·공유·상세 보기 기능
data/                부모가 수정하는 콘텐츠 파일
public/images/       사진과 그림
public/videos/       직접 올리는 MP4
README.md            이 사용 설명서
```

## 오류 확인

수정 후 `npm run lint`, 그 다음 `npm run build`를 실행하면 오류와 배포 가능 여부를 확인할 수 있습니다.
