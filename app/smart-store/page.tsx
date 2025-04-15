'use client'
import React, { useState } from 'react'
import ExcelUploadByPassword from '@/components/uploadExcel/common/ExcelUploadByPassword'
import { SmartOrders, SmartTableHeaders } from '@/utils/smart-store';

type SmartExcelOrders = {
    발송기한?: string | Date;
    상품주문번호?: string;
    주문번호?: string;
    결제일?: string | Date;
    정산예정금액?: string | number;
    구매자명?: string;
    수취인명?: string;
    수량?: string | number;
    옵션정보?: string;
    구매자연락처?: string;
    수취인연락처1?: string;
    우편번호?: string | number;
    통합배송지?: string;
    배송메세지?: string;
    매출연동수수료유입경로?: string;
    상태?: string;
};


const parseSmartExcel = (data: SmartExcelOrders[]): SmartOrders[] => {
    return data.map((item: any) => {
        //구매수 출력하기 위한 코드 
        const extractNumber = (value: any): number => {
            if (!value) return 0;
            const str = value.toString().trim();
            const match = str.match(/\d+/); // 첫 숫자만 추출
            return match ? Number(match[0]) : 0;
        };
        // 엑셀 날짜 포맷을 처리
        const excelDateToJSDate = (excelDate: number) => {
            const epoch = new Date(1900, 0, 1);
            epoch.setDate(epoch.getDate() + excelDate - 2);
            return epoch;
        };
        return {
            발송기한: item['발송기한'] ? excelDateToJSDate(item['발송기한']) : new Date(),
            상품주문번호: item['상품주문번호'] || '',
            주문번호: item['주문번호'] || '',
            결제일: item['결제일'] ? excelDateToJSDate(item['결제일']) : new Date(),
            정산예정금액: Number(item['정산예정금액']) || 0,
            구매자명: item['구매자명'] || '',
            수취인명: item['수취인명'] || '',
            수량: extractNumber(item['수량']),
            옵션정보: item['옵션정보'] ? item['옵션정보'].split(':')[1]?.trim() || '' : '',
            구매자연락처: item['구매자연락처'] || '',
            수취인연락처1: item['수취인연락처1'] || "정보없음",
            우편번호: item['우편번호']?.toString() || '',
            통합배송지: item['통합배송지'] || '',
            배송메세지: item['배송메세지'] || '',
            매출연동수수료유입경로: item['매출연동수수료 유입경로'] || '',
            상태: item['상태'] ? item['상태'] : '대기중',
            처리상태: '대기중'
        }
    })
}

export default function page() {
    const orders: SmartOrders[] = [
        {
            발송기한: new Date(),
            상품주문번호: 'P12345',
            주문번호: 'O98765',
            결제일: new Date(),
            정산예정금액: 50000,
            구매자명: '홍길동',
            수취인명: '김철수',
            수량: 2,
            옵션정보: '옵션1',
            구매자연락처: '010-1234-5678',
            수취인연락처1: '010-9876-5432',
            우편번호: '12345',
            통합배송지: '서울특별시 강남구',
            배송메세지: '빠른 배송 부탁드립니다.',
            매출연동수수료유입경로: '네이버',
            상태: '대기중',
            처리상태: '대기중',
        },
    ]

    return (
        <div className="container flex flex-col gap-16">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl text-foreground font-bold tracking-wide hover:text-primary transition-all duration-500">스마트 스토어 주문서 관리 </h1>
            </div>
            <ExcelUploadByPassword
                processExcelData={parseSmartExcel}
                orders={orders}
                tableHeaders={SmartTableHeaders}
            />
        </div>
    )
}