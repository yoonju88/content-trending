import React from 'react'
import ExcelUpload from '@/components/excelUpload'

export default function page() {
    return (

        <div className="container flex flex-col gap-10">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl text-foreground font-bold tracking-wide">올웨이즈 주문서 관리 </h1>
            </div>
            <ExcelUpload />
        </div>
    )
}
