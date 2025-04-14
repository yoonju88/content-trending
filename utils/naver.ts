import { Status } from "./status";

export interface Orders {
    상품주문번호: string;
    결제일: Date;
    배송완료일: Date;
    최종상품별총주문금액: number;
    배송비합계: number;
    구매자명: string;
    수량: string;
    옵션정보: string;
    수취인명: string;
    구매자연락처: string;
    수취인연락처1: string;
    우편번호: string;
    배송지: string;
    상태: Status;
    처리상태: string;

}

export const tableHeaders = [
    '상품주문번호',
    '결제일',
    '배송완료일',
    '최종상품별주문금액',
    '배송비합계',
    '구매자명',
    '수량',
    '옵션정보',
    '수취인명',
    '구매자연락처',
    '수취인연락처1',
    '우편번호',
    '배송지',
    '상태',
    '처리'
];