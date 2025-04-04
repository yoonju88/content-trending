'use client'

import React, { useState } from 'react';
import * as XLSX from 'xlsx'; // Excel 처리 라이브러리 : npm install xlsx
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { InitialDashboardItems } from '@/utils/dash-board';
import { Orders, tableHeaders, Status } from '@/utils/alwaysData';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from './ui/table';


const ExcelUpload = () => {
    const [orders, setOrders] = useState<Orders[]>([]);
    const [dashboardData, setDashboardData] = useState(InitialDashboardItems);
    // Handle file upload and parse Excel data
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            const reader = new FileReader();

            reader.onload = (e: ProgressEvent<FileReader>) => {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: "array" });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(firstSheet);

                // Transform data to match Orders type
                const transformedData: Orders[] = jsonData.map((item: any) => {

                    const 주문시점 = item.주문시점;
                    let orderDate = new Date(주문시점);

                    if (isNaN(orderDate.getTime())) {
                        if (typeof 주문시점 === 'string' && 주문시점.includes(' ')) {
                            // '2025-04-03 20:41' 형태에서 공백을 'T'로 바꿔서 ISO 형식으로 변환
                            orderDate = new Date(주문시점.replace(' ', 'T'));
                        } else {
                            // 날짜가 유효하지 않다면, 기본 날짜를 설정하거나 에러 메시지를 처리할 수 있음
                            orderDate = new Date();  // 예: 현재 날짜로 설정
                        }
                    }

                    // 수령인연락처 처리 (핸드폰 번호의 형식을 일관되게 맞추기)
                    let formattedPhone = item.수령인연락처;
                    if (formattedPhone && typeof formattedPhone === 'string') {
                        formattedPhone = formattedPhone.replace(/[^0-9]/g, '');  // 숫자만 남기고 나머지 제거
                        if (formattedPhone.length === 10) {
                            formattedPhone = formattedPhone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
                        } else if (formattedPhone.length === 11) {
                            formattedPhone = formattedPhone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
                        }
                    }

                    return {
                        주문아이디: item.주문아이디 || '',
                        상품아이디: item.상품아이디 || '',
                        합배송아이디: item.합배송아이디 || '',
                        주문시점: orderDate,
                        정산대상금: Number(item.정산대상금) || 0,
                        수령인: item.수령인 || '',
                        수량: Number(item.수량) || 0,
                        옵션: item.옵션 || '',
                        수령인연락처: formattedPhone || "정보없음",
                        우편번호: Number(item.우편번호) || 0,
                        주소: item.주소 || '',
                        공동현관비밀번호: item.공동현관비밀번호 || '',
                        수령방법: item.수령방법 || '',
                        운송장번호: item.운송장번호 || '',
                        상태: (item.상태 as Status) || '대기중'
                    }
                });


                setOrders(transformedData);
                processExcelData(transformedData);
            };

            reader.readAsArrayBuffer(file);
        }
    };

    // Process Excel data and update dashboard
    const processExcelData = (data: Orders[]) => {
        const totalOrders = data.length;
        const pendingOrders = data.filter((order) => order.상태 === "대기중").length;
        const processingOrders = data.filter((order) => order.상태 === "처리중").length;
        const completedOrders = data.filter((order) => order.상태 === "완료").length;

        setDashboardData([
            { label: "총 주문수", value: totalOrders, id: "totalOrders" },
            { label: "대기중", value: pendingOrders, id: "pendingOrders" },
            { label: "처리중", value: processingOrders, id: "processingOrders" },
            { label: "완료", value: completedOrders, id: "completedOrders" },
        ]);
    };
    // Update order status
    const updateOrderStatus = (orderNumber: string, newStatus: Status) => {
        const updatedOrders = orders.map((order) =>
            order.주문아이디 === orderNumber
                ? { ...order, 상태: newStatus }
                : order
        );
        setOrders(updatedOrders);
        processExcelData(updatedOrders);
    };

    // Select/deselect all orders
    const toggleSelectAll = () => {
        const checkboxes = document.querySelectorAll<HTMLInputElement>(
            ".order-checkbox"
        );
        const selectAll = document.getElementById("selectAll") as HTMLInputElement;
        checkboxes.forEach((checkbox) => {
            checkbox.checked = selectAll.checked;
        });
    };

    // Copy selected orders to clipboard
    const copySelectedOrders = () => {
        const selectedRows = Array.from(
            document.querySelectorAll<HTMLInputElement>(".order-checkbox:checked")
        ).map((checkbox) => checkbox.closest("tr"));

        if (selectedRows.length === 0) {
            alert("복사할 주문을 선택해주세요.");
            return;
        }

        const text = selectedRows
            .map((row) => {
                const cells = Array.from(row?.cells || []);
                return cells
                    .slice(1, 14) // Grab relevant columns
                    .map((cell) => cell.textContent)
                    .join("\t");
            })
            .join("\n");

        navigator.clipboard.writeText(text).then(() => {
            alert("선택한 주문이 클립보드에 복사되었습니다.");
        });
    };

    // Copy all orders to clipboard
    const copyAllOrders = () => {
        const rows = document.querySelectorAll<HTMLTableRowElement>(
            "#orderTableBody tr"
        );
        const text = Array.from(rows)
            .map((row) => {
                const cells = Array.from(row.cells);
                return cells
                    .slice(1, 14) // Grab relevant columns
                    .map((cell) => cell.textContent)
                    .join("\t");
            })
            .join("\n");

        navigator.clipboard.writeText(text).then(() => {
            alert("전체 주문이 클립보드에 복사되었습니다.");
        });
    }

    return (
        <div className="flex flex-col space-y-10">
            <div>
                <Input
                    type="file"
                    id="excelFile"
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                    className="hidden"
                />
                <Button
                    variant="default"
                    size="lg"
                    className="text-base"
                    onClick={() => document.getElementById('excelFile')?.click()}
                >
                    엑셀 파일 불러오기
                </Button>
            </div>
            <section>
                <Card className=" group w-full p-10 hover:shadow-muted-foreground hover:shadow-md transition-all duration-500">
                    <CardHeader>
                        <CardTitle className="text-3xl group-hover:text-primary">Dash Board</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-4 space-x-12 text-center">
                        {dashboardData.map((item) => {
                            return (
                                <Card
                                    key={item.id}
                                    className='border-none bg-muted-foreground/10 hover:shadow-muted-foreground hover:shadow-md transition-all duration-500'
                                >
                                    <CardHeader>
                                        <CardTitle className="text-2xl">{item.label}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <span className="text-xl">{item.value}</span>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </CardContent>
                </Card>
            </section>
            <section>
                <div className="flex space-x-5">
                    <Button
                        onClick={copySelectedOrders}
                        variant="default"
                        size="lg"
                        type="submit"
                    >
                        선택한 주문 복사
                    </Button>
                    <Button
                        onClick={copyAllOrders}
                        variant="default"
                        size="lg"
                        type="submit"
                    >
                        전체 주문 복사
                    </Button>
                </div>
                <Table className="mt-10">
                    <TableCaption>
                        <span className="text-xl font-title">Always orders data</span>
                    </TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                <Input
                                    type="checkbox"
                                    id="selectAll"
                                    onChange={toggleSelectAll}
                                />
                            </TableHead>
                            {tableHeaders.map((item, index) => (
                                <TableHead key={index}>
                                    {item}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => {

                            return (
                                <TableRow key={order.주문아이디}>
                                    <TableCell>
                                        <Input type="checkbox" />
                                    </TableCell>
                                    <TableCell>{order.주문아이디}</TableCell>
                                    <TableCell>{order.상품아이디}</TableCell>
                                    <TableCell>{order.합배송아이디}</TableCell>
                                    <TableCell>{order.주문시점.toLocaleDateString()}</TableCell>
                                    <TableCell>₩{order.정산대상금}</TableCell>
                                    <TableCell>{order.수령인}</TableCell>
                                    <TableCell>{order.수량}</TableCell>
                                    <TableCell>{order.옵션}</TableCell>
                                    <TableCell>{order.수령인연락처}</TableCell>
                                    <TableCell>{order.우편번호}</TableCell>
                                    <TableCell>{order.주소}</TableCell>
                                    <TableCell>{order.공동현관비밀번호}</TableCell>
                                    <TableCell>{order.수령방법}</TableCell>
                                    <TableCell>{order.운송장번호}</TableCell>
                                    <TableCell>{order.상태}</TableCell>
                                </TableRow>
                            )
                        })
                        }
                    </TableBody>
                </Table>
            </section>
        </div>
    );
};

export default ExcelUpload;