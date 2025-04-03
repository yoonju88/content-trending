import { Firestore, getFirestore } from "firebase-admin/firestore";
import { getApps, ServiceAccount } from "firebase-admin/app"
import admin from 'firebase-admin'
import { Auth, getAuth } from "firebase-admin/auth";

const serviceAccount = {
    "type": "service_account",
    "project_id": "trending-search-4fd23",
    "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
    "private_key": process.env.FIREBASES_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "client_id": process.env.FIREBASE_CLIENT_ID,
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40trending-search-4fd23.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com",
}


let firestore: Firestore
//getApps()를 호출하여 이미 초기화된 Firebase 앱들의 리스트를 가져옵니다.
let auth: Auth;
const currentApps = getApps();

if (!currentApps.length) {
    const app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as ServiceAccount),
    });
    firestore = getFirestore(app);
    auth = getAuth(app);
} else {
    const app = currentApps[0];
    firestore = getFirestore(app);
    auth = getAuth(app);
}
//설정된 firestore 객체를 모듈로 내보냄으로써 다른 파일에서 Firestore 데이터베이스를 사용할 수 있도록 합니다.
export { firestore, auth }

//Firestore에서 문서 개수를 조회하여 총 페이지 수를 계산하는 함수
//Firebase Firestore에서 데이터를 조회하는 작업을 수행하기 때문에, 클라이언트가 직접 Firestore에 접근하는 것을 방지하고 보안을 강화하기 위해 서버에서 실행
export const getTotalPages = async (firestoreQuery: FirebaseFirestore.Query<
    FirebaseFirestore.DocumentData,
    FirebaseFirestore.DocumentData
>, pageSize: number) => {
    const queryCount = firestoreQuery.count() // 총 문서 수를 세는 쿼리 생성
    const countSnapshot = await queryCount.get() // Firestore에서 실행하여 결과 가져오기
    const countData = countSnapshot.data() //결과 데이터 추출 
    const total = countData.count; //총 문서 개수 가져오기
    const totalPages = Math.ceil(total / pageSize) //총 페이지 수 계산
    return totalPages;
}