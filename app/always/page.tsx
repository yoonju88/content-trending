'use client'
import ExcelUpload from '@/components/uploadExcel/common/ExcelUpload'
import { Orders, tableHeaders } from '@/utils/alwaysData';
import { Status } from '@/utils/status';

type alwaysExcelOrder = {
    주문아이디?: string;
    상품아이디?: string;
    합배송아이디?: string;
    '주문 시점'?: string | Date;
    '정산대상금액(수수료 제외)'?: string | number;
    수령인?: string;
    수량?: string | number;
    옵션?: string;
    '수령인 연락처'?: string;
    우편번호?: string | number;
    주소?: string;
    '공동현관 비밀번호'?: string;
    '수령 방법'?: string;
    운송장번호?: string;
    상태?: string;
    처리상태: string;
};

const parseAlwaysExcel = (data: alwaysExcelOrder[]): Orders[] => {
    return data.map((item: alwaysExcelOrder): Orders => ({
        주문아이디: item['주문아이디'] || '',
        상품아이디: item['상품아이디'] || '',
        합배송아이디: item['합배송아이디'] || '',
        주문시점: new Date(item['주문 시점'] ?? new Date()),
        정산대상금액: Number(item['정산대상금액(수수료 제외)']) || 0,
        수령인: item['수령인'] || '',
        수량: Number(item['수량']) || 0,
        옵션: item['옵션'] ? item['옵션'].split(':')[1]?.trim() || '' : '',
        수령인연락처: item['수령인 연락처'] || "정보없음",
        우편번호: item['우편번호']?.toString() || '',
        주소: item['주소'] || '',
        공동현관비밀번호: item['공동현관 비밀번호'] || '',
        수령방법: item['수령 방법'] || '',
        운송장번호: item['운송장번호'] || '',
        상태: (item['상태'] as Status) || '대기중',
        처리상태: '대기중'
    }))
}


export default function page() {
    const orders: Orders[] = [
        {
            주문아이디: 'A123',
            상품아이디: 'P001',
            합배송아이디: 'G001',
            주문시점: new Date(),
            정산대상금액: 12000,
            수령인: '홍길동',
            수량: 2,
            옵션: '블루',
            수령인연락처: '010-0000-0000',
            우편번호: '12345',
            주소: '서울시 어딘가',
            공동현관비밀번호: '1234',
            수령방법: '문앞',
            운송장번호: 'TRACK123',
            상태: '대기중',
            처리상태: '대기중'
        },
    ];
    return (
        <div className="container flex flex-col gap-16 mt-14 px-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl sm:text-4xl text-foreground font-bold tracking-wide hover:text-primary transition-all duration-500">올웨이즈 주문서 관리 </h1>
            </div>
            <ExcelUpload
                processExcelData={parseAlwaysExcel}
                orders={orders}
                tableHeaders={tableHeaders}
            />
        </div>
    )
}
