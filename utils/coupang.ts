import { Status } from "./status";

export interface Orders {
    번호: string;
    주문시출고예정일: Date;
    주문번호: string;
    주문일: Date;
    구매자: string;
    기타: string;
    결제액: number;
    배송비: string;
    구매수: string;
    등록옵션명: number;
    수취인이름: string;
    전화번호: string;
    우편번호: string;
    주소: string;
    배송메세지: Status;
    결제위치: string;
    상태: Status;
    처리상태: string;

}

export const tableHeaders = [
    '번호',
    '주문시 출고 예정일',
    '주문번호',
    '주문일',
    '구매자',
    '기타',
    '결제액',
    '배송비',
    '구매 수량',
    '등록 옵션명',
    '수취인 이름',
    '구매자 전화번호',
    '우편번호',
    '수취인 주소',
    '배송 메세지',
    '결제 위치',
    '상태',
    '처리'
];

