# BukguSwimming

Next.js 16, React 19, TypeScript 기반 수영대회 운영 프론트엔드다. Flask API는 별도 운영한다.

Node.js 24.22.1을 사용한다. 개발 서버는 기존과 같이 5000 포트로 실행한다.

```powershell
Copy-Item .env.example .env.local
# .env.local에 실제 Flask origin을 지정한다.
npm ci
npm run dev
```

`http://localhost:5000`에서 확인한다.

Docker 기본 이미지는 standalone 프로덕션 서버다. Docker 개발 서버는 `--target development`로 선택한다.
`NEXT_PUBLIC_BACKEND_URL`과 API rewrite는 빌드 시 고정되므로 백엔드 주소 변경 시 다시 빌드해야 한다.

개발/Docker/프로덕션 실행 명령, 환경 변수 규칙, 보안 변경 근거, 실제 검증 결과와 2027년 대회 준비 사항은 [배포 가이드](docs/deployment.md)를 참고한다.

현재 전체 빌드는 저장소에서 누락된 `src/assets/도장.png` 때문에 실패한다. 새 lint 설정의 기존 화면 코드 진단도 정리가 필요하다. 원본 자산 복원과 Docker·실제 Flask 회귀 검증을 완료하기 전에는 운영 준비 완료 상태가 아니다.
