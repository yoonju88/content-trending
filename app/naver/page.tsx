'use client'
import ExcelUpload from '@/components/uploadExcel/common/ExcelUploadByPassword'
import { NaverOrders, NaverTableHeaders } from '@/utils/naver';

type NaverExcelOrder = {
    상품주문번호?: string;
    결제일?: string | Date;
    배송완료일?: string | Date;
    최종상품별총주문금액?: string | number;
    배송비합계?: string | number;
    구매자명?: string;
    수량?: string | number;
    옵션정보?: string;
    수취인명?: string;
    구매자연락처?: string;
    수취인연락처1?: string;
    우편번호?: string | number;
    배송지?: string;
    상태?: string;
};

const parseNaverExcel = (data: NaverExcelOrder[]): NaverOrders[] => {
    return data.map((item: any) => {
        //구매수 출력하기 위한 코드 
        const extractNumber = (value: any): number => {
            if (!value) return 0;
            const str = value.toString().trim();
            const match = str.match(/\d+/); // 첫 숫자만 추출
            return match ? Number(match[0]) : 0;
        };
        return {
            상품주문번호: item['상품주문번호'] || '',
            결제일: new Date(item['결제일']) || new Date(),
            배송완료일: new Date(item['배송완료일']) || new Date(),
            최종상품별총주문금액: Number(item['최종상품별총주문금액']) || 0,
            배송비합계: Number(item['배송비합계']) || 0,
            구매자명: item['구매자명'] || '',
            수량: extractNumber(item['수량']),
            옵션정보: item['옵션정보'] || '정보없음',
            수취인명: item['수취인명'] || '',
            구매자연락처: item['구매자연락처'] || "정보없음",
            수취인연락처1: item['수취인연락처1'] || "정보없음",
            우편번호: item['우편번호']?.toString() || '',
            배송지: item['배송지'] || '',
            상태: item['상태'] || '대기중',
            처리상태: '대기중'
        }
    })
}

export default function page() {
    const orders: NaverOrders[] = [
        {
            상품주문번호: 'NAV001',
            결제일: new Date('2025-04-20'),
            배송완료일: new Date('2025-04-22'),
            최종상품별총주문금액: 15000,
            배송비합계: 2500,
            구매자명: '정지훈',
            수량: 2,
            옵션정보: '블랙, L',
            수취인명: '김태희',
            구매자연락처: '010-9876-5432',
            수취인연락처1: '010-1111-2222',
            우편번호: '12345',
            배송지: '서울특별시 강남구 논현동 123-45',
            상태: '대기중',
            처리상태: '대기중'
        },
    ]
    return (
        <div className="container flex flex-col gap-16">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl text-foreground font-bold tracking-wide hover:text-primary transition-all duration-500">쿠팡 주문서 관리 </h1>
            </div>
            <ExcelUpload
                processExcelData={parseNaverExcel}
                orders={orders}
                tableHeaders={NaverTableHeaders}
            />
        </div>
    )
}