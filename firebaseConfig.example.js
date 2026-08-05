/*
 * Firebase 연동 설정 템플릿
 * ─────────────────────────────────────────────────────────
 * 1) 이 파일을 복사해서 같은 폴더에 "firebaseConfig.js" 라는 이름으로 저장하세요.
 *    (firebaseConfig.js 는 .gitignore에 등록되어 있어 저장소에 올라가지 않습니다)
 * 2) Firebase 콘솔(https://console.firebase.google.com) → 프로젝트 설정 → 일반 탭
 *    → "내 앱" 섹션의 웹 앱(</> 아이콘)에서 아래 값들을 그대로 복사해 붙여넣으세요.
 * 3) Firestore Database를 아직 만들지 않았다면, 콘솔의 "Firestore Database" 메뉴에서
 *    데이터베이스를 생성하세요 (프로덕션 모드 또는 테스트 모드 아무거나 선택 후,
 *    아래 보안 규칙 예시로 규칙을 교체하는 것을 권장합니다).
 * 4) index.html을 브라우저로 열면 자동으로 이 설정을 읽어 Firebase에 연결합니다.
 *    이 파일이 없거나 값이 비어있으면 자동으로 localStorage 전용 모드로 동작합니다.
 * ─────────────────────────────────────────────────────────
 * 참고: Firebase 웹 apiKey는 서버 비밀키가 아니라 "이 요청이 어느 프로젝트로
 * 가는지"를 나타내는 공개 식별자입니다 (Firebase 공식 안내). 실제 접근 제어는
 * Firestore 보안 규칙(아래 예시)이 담당하므로, 이 파일이 저장소에 실수로 올라가도
 * 즉시 큰 보안 사고로 이어지진 않습니다 — 다만 프로젝트 구분을 위해 커밋하지 않는
 * 것을 권장 관례로 유지합니다.
 * ─────────────────────────────────────────────────────────
 * Firestore 보안 규칙 예시 (콘솔 → Firestore Database → 규칙 탭에 붙여넣기):
 *
 *   rules_version = '2';
 *   service cloud.firestore {
 *     match /databases/{database}/documents {
 *       match /{collection}/{doc} {
 *         allow read, write: if true; // 로그인 없이 팀 내부에서만 URL을 공유하는 구조
 *       }
 *     }
 *   }
 *
 * 위 규칙은 "로그인 없이 URL만 알면 누구나 읽고 쓸 수 있음"을 의미합니다.
 * 사내 PC 몇 대끼리만 공유하는 용도로는 충분하지만, 외부에 노출되지 않도록
 * 이 프로젝트를 공개 저장소에 올리지 않는 것을 권장합니다.
 */
window.FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
