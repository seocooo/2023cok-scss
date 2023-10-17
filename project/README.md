# NH콕뱅크 차세대 (2023~)

---

### setting

1. 관련자료 (파일서버)

   - https://nas.blueb.co.kr

2. 웹서버

   <!-- - 외부접속시: http://n-hub.septem-ai.com -->
   - 내부접속시: http://192.168.0.5:11423

   - 로그인 계정
     <!-- `blueb` // `blueb@@` -->


3. 형상관리(svn)

   <!-- - 외부접속시: http://n-hub.septem-ai.com/svn -->
   - 내부접속시: http://192.168.0.5:11423/svn

4. 디자인 공유 (피그마)
   - URL

#### etc.

    [작업자]
    디자인: 
    퍼블리셔: 
    기획: 

#### 폴더 구조
    `content` - svn을 통한 산출물 업로드
    `pub` - 실제 퍼블 작업 폴더 (해당 작업만)

```
Project
├─ content
│  ├─ *.html
│  ├─ css
│  │  └─ common.css
│  │  └─ pages.css
│  ├─ js
│  │  └─ comm.js
│  ├─ fonts
│  ├─ img
│  │  └─ ...
│  │  └─ ...
├─ pub
│  ├─ html
│  ├─ inc
│  ├─ js
│  │  └─ lib
│  ├─ scss
│  ├─ index.html
│  └─ pubList.html
└─ README.md
```

#### 브라우저 호환성

    AOS `5.0` 이상
    IOS `12.0` 이상
    [viewport] 
    최소사이즈 '320' 이상.

