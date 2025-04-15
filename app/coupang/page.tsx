'use client'
import ExcelUpload from '@/components/uploadExcel/common/ExcelUpload'
import { CoupangOrders, CoupangTableHeaders } from '@/utils/coupang';
import { Status } from '@/utils/status';

export type CoupangExcelOrder = {
    번호?: string;
    '주문시 출고예정일'?: string | Date;
    주문번호?: string;
    주문일?: string | Date;
    구매자?: string;
    기타?: string;
    결제액?: string | number;
    배송비?: string | number;
    '구매수(수량)'?: string | number;
    수량?: string | number;
    구매수?: string | number;
    등록옵션명?: string;
    수취인이름?: string;
    구매자전화번호?: string;
    우편번호?: string | number;
    '수취인 주소'?: string;
    배송메세지?: string;
    결제위치?: string;
    상태?: string;
};

const parseCoupangExcel = (data: CoupangExcelOrder[]): CoupangOrders[] => {
    return data.map((item: CoupangExcelOrder): CoupangOrders => {
        //구매수 출력하기 위한 코드 
        const extractNumber = (value: string | number | undefined): number => {
            if (!value) return 0;
            const str = value.toString().trim();
            const match = str.match(/\d+/); // 첫 숫자만 추출
            return match ? Number(match[0]) : 0;
        };
        return {
            번호: item['번호'] || '',
            주문시출고예정일: new Date(item['주문시 출고예정일'] ?? new Date()),
            주문번호: item['주문번호'] || '',
            주문일: new Date(item['주문일'] ?? new Date()),
            구매자: item['구매자'] || '',
            기타: item['기타'] || '',
            결제액: Number(item['결제액']) || 0,
            배송비: Number(item['배송비']) || 0,
            구매수: extractNumber(item['구매수(수량)'] || item['수량'] || item['구매수']),
            등록옵션명: item['등록옵션명'] || '정보없음',
            수취인이름: item['수취인이름'] || '',
            구매자전화번호: item['구매자전화번호'] || "정보없음",
            우편번호: item['우편번호']?.toString() || '',
            수취인주소: item['수취인 주소'] || '',
            배송메세지: item['배송메세지'] || '',
            결제위치: item['결제위치'] || '',
            상태: (item['상태'] as Status) || '대기중',
            처리상태: '대기중'
        }
    })
}

export default function page() {
    const orders: CoupangOrders[] = [
        {
            번호: '001',
            주문시출고예정일: new Date('2025-04-20'),
            주문번호: 'ORD12345',
            주문일: new Date('2025-04-10'),
            구매자: '김철수',
            기타: '특별 요청 없음',
            결제액: 10000,
            배송비: 2500,
            구매수: 3,
            등록옵션명: '블루, M',
            수취인이름: '홍길동',
            구매자전화번호: '010-1234-5678',
            우편번호: '12345', // 문자열로 할당
            수취인주소: '서울특별시 강남구 테헤란로 123',
            배송메세지: '배송 시 연락 주세요',
            결제위치: '온라인',
            상태: '대기중',
            처리상태: '대기중'
        },
    ];

    return (
        <div className="container flex flex-col gap-16">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl text-foreground font-bold tracking-wide hover:text-primary transition-all duration-500">쿠팡 주문서 관리 </h1>
            </div>
            <ExcelUpload
                processExcelData={parseCoupangExcel}
                orders={orders}
                tableHeaders={CoupangTableHeaders}
            />
        </div>
    )
}
