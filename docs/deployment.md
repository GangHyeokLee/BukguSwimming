# 개발·운영 실행 및 보안 점검

기준일: 2026-10-26 (한국 시간). 관련 작업: [Issue #2](https://github.com/GangHyeokLee/BukguSwimming/issues/2).
실제 운영 배포, 커밋, 푸시, Issue 종료는 수행하지 않았다.

## 현재 검증 상태

**운영 준비 완료 상태가 아니다.** 원본 도장 이미지 복원, lint 오류 정리, Docker 실행 검증, 실제 Flask 연동 및 핵심 화면 회귀 테스트가 남아 있다.

| 검사 | 결과 |
| --- | --- |
| 변경 전 Git 상태 | `master`, 작업 트리 깨끗함 |
| Node 실행 | 공식 Windows x64 배포 파일의 SHA-256 확인 후 `v24.22.1` 실행 |
| 변경 전/후 `npm ci` | 모두 성공. 최종 설치 442개 패키지 |
| 변경 전 `npm run lint` | 성공 |
| 변경 후 `npm run lint` | 실패: 기존 화면 코드에서 새 lint 설정이 12개 오류 보고 |
| 변경 전/후 `npm run build` | 모두 실패: `src/assets/도장.png` 누락 |
| 변경 전 `npm audit --omit=dev` | 취약한 패키지 11개: critical 1, high 7, moderate 3 |
| 변경 후 `npm audit --omit=dev` | 성공, 알려진 취약점 0개 |
| 변경 후 전체 `npm audit` | 실패, 개발 도구의 moderate 3개. high/critical 0개 |
| 개발 서버 `/login` | 로컬 HTTP 200 |
| v1/v2 rewrite | 로컬 모의 API로 중첩 경로, 쿼리, POST JSON, Authorization, Cookie 전달 확인 |
| Next 설정 | standalone 및 v1/v2 목적지, 백엔드 주소 누락·잘못된 주소 거부 확인 |
| Docker 이미지 빌드·컨테이너·이미지 내 Node/UID | 미검증: Docker CLI/Engine 사용 불가. WSL 열거도 접근 거부 |
| standalone 프로덕션 HTTP 실행 | 미검증: 실제 앱 빌드가 도장 파일 누락으로 완료되지 않음 |
| 실제 Flask 로그인·심판 기록·집계·상장 출력 | 미검증: 실제 백엔드/테스트 계정/도장 파일 미제공 |
| GitHub Actions | 파일만 수정. 원격 워크플로는 실행하지 않음 |

로컬에는 Node/npm이 PATH에 없어 `.local-tools/`에 임시 도구와 검사 로그를 두었다. 시스템 설치는 하지 않았다.
기본 샌드박스에서는 최초 설치가 네트워크/오프라인 캐시 제약으로 실패했고, 마지막 오프라인 재설치도 자식 프로세스 제한(`spawn EPERM`)에 걸렸다. 설치 스크립트를 끄지 않고 허용된 실행 환경에서 검증했다.
로그와 도구는 Git 및 Docker 빌드 컨텍스트에서 제외한다.

### 기존 문제와 업데이트로 새로 드러난 진단

- **기존 빌드 차단:** 상장 코드가 `src/assets/도장.png`를 정적 import하지만 파일이 없고 `.gitignore`에서도 제외한다. 원본 파일을 해당 경로에 복원해야 한다. CI에서도 권한이 있는 원본을 빌드 전에 제공하거나, 저장소 포함 가능 여부를 결정해야 한다. 임의 도장 생성, 이미지 제거, 출력 기능 생략은 하지 않았다.
- **업데이트 후 새 lint 진단:** `eslint-config-next` 16.4.1과 React Hooks 플러그인에서 기존 `DirectorBoard.tsx` 5개, `DirectorContent.tsx` 6개, `FoulPanel.tsx` 1개 오류를 보고한다. effect 내 동기 setState 및 선언 전 함수 참조 관련이다. 변경 전 lint는 통과했으므로 기존 검사 실패라고 표현하면 안 된다. 앱 소스는 바꾸지 않았으며, 규칙 비활성화나 `continue-on-error`로 우회하지 않았다. 화면 동작을 검토하는 별도 수정이 필요하다.
- 빌드가 초기 모듈 해석에서 멈췄으므로 이후 TypeScript 검사와 prerender가 성공한다고 단정할 수 없다.

## Node 및 이미지 선정

`node:24.22.1-bookworm-slim`을 선택했다. Node 24.22.1은 2026-10-21 보안 릴리스로 DNS, TLS, Brotli 등의 수정이 포함된다.
Node 24는 2028-04-30까지 지원 예정이어서 2027년 중순 대회를 포함한다. Node 20은 지원이 종료됐고, Node 22는 2027-04-30 지원 종료 예정으로 대회 일정에 맞지 않는다. Node 26은 기준일에 아직 LTS가 아니므로 선택하지 않았다.

Alpine은 더 작지만 musl 기반이다. Debian slim은 glibc 기반으로 Next.js SWC와 sharp 등 네이티브 모듈 호환성을 우선하며, 전체 Debian 이미지보다 불필요한 도구가 적다. 이번 버전의 sharp도 0.35.5로 보안 패치됐다. Linux 이미지의 네이티브 모듈 실제 구동은 별도 확인이 필요하다.

이미지는 **정확한 Node 패치 + OS 계열**을 고정한다. `node:lts`처럼 메이저가 자동 전환되거나 `node:24`처럼 Node 패치가 조용히 바뀌는 선택을 피한다. 다만 같은 패치 태그의 OS 레이어는 재게시될 수 있으므로 digest 고정과 같은 완전한 불변성은 없다.

- 개발/검증 빌드는 `docker build --pull`로 해당 태그의 OS 수정 사항을 받는다.
- 보안 공지 후 Node 패치를 명시적으로 갱신하고 `.nvmrc`, `package.json`의 engines, Dockerfile, CI Node 버전 검사를 함께 수정한다. 고정했다고 향후 취약점이 자동 해결되지는 않는다.
- 실제 릴리스는 테스트한 최종 애플리케이션 이미지 digest, 사용한 베이스 digest, Git commit, 빌드 시 백엔드 주소, 감사 결과를 기록하고 그 이미지를 그대로 배포한다. 정확한 베이스 재현이 필요할 때는 검증한 `node:...@sha256:...`로 고정하고 보안 갱신 시 digest도 교체한다. 확인하지 못한 digest를 작성하지 않았다.
- OS 패키지 취약점은 `npm audit` 범위가 아니다. 실제 이미지에 대한 Docker Scout 또는 Trivy 등 별도 검사를 배포 전에 수행한다.

## 의존성 변경 범위

| 패키지 | 이전 lockfile | 변경 lockfile | 이유 |
| --- | --- | --- | --- |
| next / eslint-config-next | 16.2.6 | 16.4.1 | 공식 10월 보안 수정 및 Next 도구 정합성 |
| React / React DOM | 19.2.4 | 19.2.4 | 기존 React 19 유지. Next peer 범위 충족 |
| @types/node | 20.19.37 | 24.19.2 | 런타임과 타입의 메이저 정합성 |
| axios | 1.14.0 | 1.20.0 | 감사에서 보고된 SSRF·정보 노출·DoS 등 수정 |
| js-cookie | 3.0.5 | 3.0.8 | 알려진 취약점 수정 |
| postcss | 8.5.10 | 8.5.23 | source map 경로 처리 취약점 수정 |
| sharp | 0.34.5 | 0.35.5 | Next 업데이트에 따른 네이티브 이미지 처리 보안 수정 |

Next 16.4.1의 Node 요구 사항은 `>=20.9.0`, React peer는 `^19.0.0`을 포함한다. Node 24 및 기존 React 19와 선언상 호환된다. Next는 보안 수정이 제공되는 최소 16.4.1을 고정했으며 최신 16.4.x 전체를 자동 채택하지 않았다.

`postcss` override는 직접 devDependency를 참조하는 `$postcss`로 통일했다. npm으로 lockfile을 갱신했고 취약한 하위 의존성인 follow-redirects, form-data, nanoid, source-map-js, baseline-browser-mapping 및 개발 도구 하위 패키지를 선택 갱신했다. 그 과정에서 해당 부모 패키지의 호환 범위 내 보조 의존성도 갱신됐다. 전체 패키지 일괄 최신화나 `npm audit fix --force`는 사용하지 않았다.

`tailwindcss-animate`는 `tailwind.config.js`의 빌드 플러그인으로만 사용하므로 devDependencies로 이동했다. 생성된 CSS는 그대로 번들에 포함된다. 전체 감사도 별도로 수행했으며 Tailwind 계열 moderate 문제는 아래에 기록했다.

## 개발 실행

Node 24.22.1을 설치하거나 버전 관리자로 `.nvmrc` 버전을 선택한다.

```powershell
Copy-Item .env.example .env.local
# .env.local의 NEXT_PUBLIC_BACKEND_URL을 실제 Flask origin으로 수정
npm ci
npm run dev
```

접속 주소는 `http://localhost:5000`이다. 기존 `npm run dev` 명령과 5000 포트는 유지한다. 백엔드 origin은 `http://localhost:8000`처럼 경로·쿼리·자격 증명·마지막 슬래시 없이 지정한다. 기존 도메인의 allowedDevOrigins도 유지한다.

Docker 개발 환경이 필요한 경우 별도 Compose 없이 같은 Dockerfile의 target을 사용한다.

```powershell
docker build --pull --target development -t bukgu-swimming:dev .
docker run --rm --name bukgu-swimming-dev -p 127.0.0.1:5000:5000 --env-file .env.local --mount "type=bind,source=$PWD/src,target=/app/src,readonly" bukgu-swimming:dev
```

이 예시는 `src` 변경을 컨테이너에 반영한다. public/config/의존성을 바꾸면 이미지를 다시 빌드하거나 해당 경로를 따로 마운트한다. `.env.local`은 Docker 컨텍스트에서 제외되므로 명시적으로 전달한다. 파일 감지가 필요한 환경에서는 기존처럼 `-e WATCHPACK_POLLING=true`를 추가할 수 있으며, Turbopack의 호스트별 파일 감지는 실제 환경에서 확인한다.

컨테이너의 `localhost`는 컨테이너 자신이다. 호스트 Flask라면 Docker Desktop의 `host.docker.internal`, Linux라면 적절한 호스트 게이트웨이나 접근 가능한 주소를 사용한다. 같은 Docker 네트워크라면 `http://backend:8000` 같은 서비스 이름을 사용한다.

## 프로덕션 이미지와 환경 변수

도장 원본 복원과 lint 오류 해결 후 다음 명령을 검증 환경에서 수행한다. 아래 명령은 이번 작업에서 실행한 배포가 아니다.

```powershell
npm ci
npm run lint
npm audit --omit=dev

# 예시: Flask가 같은 Docker 네트워크에서 backend:8000으로 접근 가능한 경우
docker build --pull --build-arg NEXT_PUBLIC_BACKEND_URL=http://backend:8000 -t bukgu-swimming:release .
docker run --rm bukgu-swimming:release node --version
docker run --rm bukgu-swimming:release id
docker run --rm bukgu-swimming:release node -p "process.env.NODE_ENV"
docker run -d --name bukgu-swimming --network swimming -p 127.0.0.1:5000:5000 --cap-drop=ALL --security-opt=no-new-privileges --restart unless-stopped bukgu-swimming:release
docker logs bukgu-swimming
```

`swimming` 네트워크와 Flask 서비스는 별도로 준비해야 한다. 호스트 reverse proxy가 5000으로 연결하는 예시다. reverse proxy도 컨테이너라면 같은 네트워크에서 프론트 컨테이너의 5000으로 연결하도록 구성한다.

Docker 기본 최종 target은 `runner`다. `npm ci`로 전체 빌드 의존성을 설치하고 builder에서 `next build`를 수행한 뒤 `.next/standalone`, `.next/static`, `public`만 runner로 복사한다. 개발 의존성 전체와 원본 소스·환경 파일을 런타임으로 복사하지 않는다. 베이스에 포함된 Node/npm 도구는 남는다.

실행은 non-root `node` 계정, `NODE_ENV=production`, `PORT=5000`, `HOSTNAME=0.0.0.0`, `node server.js`다. 앱 파일은 root 소유로 읽기만 허용하고 `.next/cache`만 쓰기 가능하게 구성했다. 향후 ISR/재검증 등 파일 쓰기 기능을 추가하면 해당 경로 권한을 별도 확인한다. 개발 target은 명시적으로 선택해야 한다.

`NEXT_PUBLIC_BACKEND_URL`은 기존과 같이 **빌드 시점 설정**이다. `next.config.ts`의 rewrite 목적지는 빌드 결과에 기록되고, `src/api/v1/apiClients.ts` 및 레거시 API proxy의 직접 `process.env.NEXT_PUBLIC_BACKEND_URL` 참조도 Next가 빌드 중 치환한다. 중복 `next.config.env` 설정만 제거했다.

| 요청 주체 | 경로 |
| --- | --- |
| 브라우저 Axios | 같은 origin의 `/api/bukguswim/v1` 유지 |
| v1 rewrite | 빌드된 backend origin + `/api/v1/:path*` |
| v2 rewrite | 빌드된 backend origin + `/api/v2/:path*` |
| 서버 Axios | 빌드된 backend origin + `/api/v1` 유지 |

**`docker run -e NEXT_PUBLIC_BACKEND_URL=...`만 바꿔서는 연결 대상이 바뀌지 않는다.** 대상이 달라지면 해당 주소로 다시 빌드하고 컨테이너를 교체한다. origin은 빌드 중 실제 접속할 필요는 없지만 실행 컨테이너에서 해석되고 접근 가능해야 한다. 공개 변수이므로 비밀 값을 넣지 않는다.

이 방식은 기존 Axios/인증/페이지 코드를 유지하며 브라우저·서버·rewrite 목적지의 불일치를 피한다. 런타임 변경을 지원하려면 서버 전용 환경 변수, 동적 프록시, 클라이언트 구성 API 등을 함께 설계해야 하므로 현재의 단일 대회 배포에는 복잡도를 늘리지 않았다.

Docker 없이 standalone을 실행하려면 성공한 `npm run build` 이후 정적 파일도 복사해야 한다. 기존 `npm start` 스크립트는 남겨 두었지만 standalone 배포에는 생성된 서버를 사용한다.

```powershell
$env:NEXT_PUBLIC_BACKEND_URL = 'http://localhost:8000'
npm run build
Copy-Item public .next/standalone -Recurse -Force
New-Item -ItemType Directory -Force .next/standalone/.next | Out-Null
Copy-Item .next/static .next/standalone/.next -Recurse -Force
$env:NODE_ENV = 'production'
$env:PORT = '5000'
$env:HOSTNAME = '0.0.0.0'
node .next/standalone/server.js
```

## GitHub Actions 변경

기존 `sync.yml`에는 자동 `git push -f`, workflow 삭제 커밋, PAT 사용, SSH host key 검사 해제 및 원격 `git pull`이 있었다. 이를 PR/master push/수동 실행에서 설치·lint·운영 의존성 감사·빌드·Docker non-root/Node/프로덕션 HTTP 검사를 수행하는 CI로 교체했다.

토큰은 `contents: read`로 제한하고 checkout 자격 증명 저장을 끈다. 공식 checkout/setup-node의 v7 commit SHA를 고정했다. fork 코드에 privileged token을 주는 `pull_request_target`은 사용하지 않는다. 이미지 게시, 원격 동기화, 서버 배포는 없다. Node 보안 릴리스 변경 시 Docker 검사에 있는 기대 Node 버전도 갱신한다.

현재 lint와 도장 누락을 해결하기 전에는 CI가 실패하는 것이 예상된다. 로컬의 Docker 미검증 항목을 CI 파일 추가만으로 검증 완료 처리하지 않는다.

## 별도 보안 개선 및 대회 전 점검

전체 감사에 남은 3개 moderate는 `postcss-selector-parser`의 CPU 소모 문제와 이를 사용하는 `postcss-nested`, `tailwindcss`다. 현재 설치된 Tailwind 3의 허용 범위에서는 완전한 수정이 안 되며 npm은 Tailwind 4를 제안한다. 신뢰된 저장소 CSS만 빌드하고 외부 사용자 CSS를 빌드 입력으로 받지 않으며, 후속 Tailwind 업데이트/마이그레이션으로 해결한다. 개발 도구 분류로 옮긴 사실이 이 위험을 제거하는 것은 아니다.

기존 인증/업무 로직은 수정하지 않았다. 다음 사항은 별도 검토 대상이다.

- `src/api/v1/auth.ts`: localStorage 및 JavaScript 접근 가능 쿠키에 토큰 저장, `secure: false`, `saneSite` 오타(올바른 옵션은 `sameSite`). HTTPS 전환과 서버 발급 HttpOnly 쿠키 적용 여부는 Flask 계약과 함께 검토한다.
- `src/utils/parseJwt.ts`: 클라이언트 JWT 해석은 서버 권한 검증을 대신할 수 없다. 실제 권한 강제는 Flask에서 확인해야 한다.
- `src/pages/api/proxy/[...path].ts`: 요청 헤더 전체 전달, URL 쿼리 로깅, timeout 부재. Host/hop-by-hop 헤더 정리, 민감 로그 제거, 리다이렉트 및 응답 크기 정책을 후속 검토한다. 원격 공격 가능성을 이번 작업에서 실증한 것은 아니다.
- 개발 서버는 기존처럼 `0.0.0.0`에 바인딩한다. 외부 공개는 피하고 접근을 제한한다. Docker 운영 기본값을 고쳤더라도 운영 명령을 `npm run dev`로 덮어쓰지 않아야 한다.

대회 2~4주 전에는 다음 항목을 완료하고 근거를 Issue #2에 기록한다.

1. 배포 시점의 Node LTS/보안 패치, Next/React 공지, npm 전체·운영 감사와 최종 Linux 이미지/OS 취약점 재점검.
2. 도장 원본의 안전한 빌드 공급, lint 정리, TypeScript·prerender를 포함한 전체 빌드 성공, Docker 안의 Node/UID/NODE_ENV/5000 포트 및 static/image 캐시 검사.
3. 실제 Flask 테스트 환경에서 v1/v2, SSR 서버 Axios, POST·쿠키·토큰·오류 상태 전달, 로그인/권한/만료/로그아웃 검사.
4. 심판 기록 등록·중복 입력, 진행·집계 polling, 상장 데이터·도장·브라우저 인쇄/PDF, 대상 기기/프린터 회귀 테스트.
5. HTTPS reverse proxy, 인증서 만료, Host 고정, 요청 크기/속도/시간 제한, Flask·관리 화면 접근 통제, 개인정보 로그 및 보존 정책 확인.
6. 백업 복원, 동시 접속 부하, 메모리/CPU 제한, 컨테이너 재시작, 장애 복구 및 검증한 이미지 digest로 롤백 연습.
7. 대회 종료 후 최종 기록 백업과 보관 확인, 컨테이너 중지/재시작 정책 해제, 서버·방화벽·외부 접근·예약 작업 종료 확인. 데이터 볼륨을 일괄 삭제하지 않는다.

## 공식 참고 자료

- [Node 24.22.1 보안 릴리스](https://nodejs.org/en/blog/release/v24.22.1)
- [Node 2026년 10월 보안 공지](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases)
- [Node 지원 일정](https://github.com/nodejs/Release/blob/main/schedule.json)
- [공식 Node Docker 이미지 목록](https://github.com/docker-library/official-images/blob/master/library/node)
- [Next 2026년 10월 보안 업데이트](https://nextjs.org/blog/nextjs-security-update-october-14-2026)
- [Next 환경 변수](https://nextjs.org/docs/app/guides/environment-variables)
- [Next standalone output](https://nextjs.org/docs/app/api-reference/config/next-config-js/output)
- [Next self-hosting](https://nextjs.org/docs/app/guides/self-hosting)
- [Tailwind 하위 selector parser 공지](https://github.com/advisories/GHSA-rj75-hqrm-r3gf)
