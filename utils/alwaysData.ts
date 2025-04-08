export type Status = '대기중' | '처리중' | '완료';

export interface Orders {
    주문아이디: string;
    상품아이디: string;
    합배송아이디: string;
    주문시점: Date;
    정산대상금액: number;
    수령인: string;
    수량: number;
    옵션: string;
    수령인연락처: string;
    우편번호: number;
    주소: string;
    공동현관비밀번호: string;
    수령방법: string;
    운송장번호: string;
    상태: Status;
    처리상태: string
}

export const tableHeaders = [
    '주문아이디',
    '상품아이디',
    '합배송아이디',
    '주문 시점',
    '정산대상금액(수수료제외)',
    '수령인',
    '수량',
    '옵션',
    '수령인 연락처',
    '우편번호',
    '주소',
    '공동현관 비밀번호',
    '수령 방법',
    '운송장번호',
    '상태',
    '처리 상태'
];