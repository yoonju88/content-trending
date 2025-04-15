'use client'
import React, { useState } from 'react'
import ExcelUpload from '@/components/uploadExcel/common/ExcelUploadByPassword'
import { NaverOrders, NaverTableHeaders } from '@/utils/naver';

const parseNaverExcel = (data: any[]): NaverOrders[] => {
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
    const [orders, setOrders] = useState<NaverOrders[]>([]);

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