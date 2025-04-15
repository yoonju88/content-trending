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
            번호: item['번호'] || '',
            주문시출고예정일: new Date(item['주문시 출고예정일']) || new Date(),
            주문번호: item['주문번호'] || '',
            주문일: new Date(item['주문일']) || new Date(),
            구매자: item['구매자'] || '',
            기타: item['기타'] || '',
            결제액: Number(item['결제액']) || 0,
            배송비: Number(item['배송비']) || 0,
            구매수: extractNumber(item['구매수(수량)'] || item['수량'] || item['구매수']),
            등록옵션명: item['등록 옵션명'] || '정보없음',
            수취인이름: item['수취인이름'] || '',
            구매자전화번호: item['구매자전화번호'] || "정보없음",
            우편번호: item['우편번호']?.toString() || '',
            수취인주소: item['수취인 주소'] || '',
            배송메세지: item['배송메세지'] || '',
            결제위치: item['결제위치'] || '',
            상태: item['상태'] ? item['상태'] : '대기중',
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