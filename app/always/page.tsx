'use client'
import React, { useState } from 'react'
import ExcelUpload from '@/components/uploadExcel/ExcelUpload'
import { Orders, tableHeaders } from '@/utils/alwaysData';

const parseAlwaysExcel = (data: any[]): Orders[] => {
    return data.map((item: any) => ({
        주문아이디: item['주문아이디'] || '',
        상품아이디: item['상품아이디'] || '',
        합배송아이디: item['합배송아이디'] || '',
        주문시점: new Date(item['주문 시점']) || new Date(),
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
        상태: item['상태'] || '대기중',
        처리상태: '대기중'
    }))
}


export default function page() {
    const [orders, setOrders] = useState<Orders[]>([]);
    return (
        <div className="container flex flex-col gap-16">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl text-foreground font-bold tracking-wide hover:text-primary transition-all duration-500">올웨이즈 주문서 관리 </h1>
            </div>
            <ExcelUpload
                processExcelData={parseAlwaysExcel}
                orders={orders}
                tableHeaders={tableHeaders}
            />
        </div>
    )
}
