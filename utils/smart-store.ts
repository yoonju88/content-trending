import { Status } from "./status";

export interface SmartOrders {
    발송기한: Date;
    상품주문번호: string;
    주문번호: string;
    결제일: Date;
    정산예정금액: number;
    구매자명: string;
    수취인명: string;
    수량: number;
    옵션정보: string;
    구매자연락처: string;
    수취인연락처1: string;
    우편번호: string;
    통합배송지: string;
    배송메세지: string;
    매출연동수수료유입경로: string;
    상태: Status;
    처리상태: string;

}

export const SmartTableHeaders = [
    '발송기한',
    '상품주문번호',
    '주문번호',
    '결제일',
    '정산예정금액',
    '구매자명',
    '수취인명',
    '수량',
    '옵션정보',
    '구매자연락처',
    '수취인연락처1',
    '우편번호',
    '통합배송지',
    '배송메세지',
    '매출연동수수료유입경로',
    '상태',
    '처리 상태'
];