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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select'
import { cityNames } from '@/utils/cityName'


const ExcelUpload = () => {
    const [orders, setOrders] = useState<Orders[]>([]);
    const [dashboardData, setDashboardData] = useState(InitialDashboardItems);
    const [duplicatedAddresses, setDuplicatedAddresses] = useState<Set<string>>(new Set());

    // Handle file upload and parse Excel data
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;

        if (file) {
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: "array" });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(firstSheet);
                processExcelData(jsonData);
                console.log("data", data)
                console.log("jsonData", jsonData)
            }
            reader.readAsArrayBuffer(file);
        }
    }
    // 도시명 추출 함수
    const extractCityName = (address: string): string | undefined => {
        for (let city of cityNames) {
            if (address.includes(city)) {
                return city;
            }
        }
        return undefined;
    };
    // 주소를 정리하는 함수
    const normalizeAddress = (address: string): string => {
        return address.trim().replace(/\s+/g, ' ');
    };
    // Transform data to match Orders type
    const processExcelData = (data: any[]) => {
        const transformedData: Orders[] = data.map((item: any) => ({
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
        }));

        // 주소 정규화 및 카운트
        const addressMap = new Map<string, number>();
        transformedData.forEach((order) => {
            const address = order.주소.trim();
            addressMap.set(address, (addressMap.get(address) || 0) + 1);
        });

        // 중복 주소 추적
        const duplicatedAddresses = new Set<string>();
        addressMap.forEach((count, address) => {
            if (count > 1) {
                duplicatedAddresses.add(address);
            }
        });

        setDuplicatedAddresses(duplicatedAddresses);
        setOrders(transformedData);
        updateDashboard(transformedData);
    }
    // Update dashboard data
    const updateDashboard = (data: Orders[]) => {
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
    const updateOrderStatus = (
        orderNumber: string,
        newStatus: Status
    ) => {
        const updatedOrders = orders.map((order) =>
            order.주문아이디 === orderNumber
                ? { ...order, 상태: newStatus }
                : order
        );
        setOrders(updatedOrders);
        updateDashboard(updatedOrders);
    };

    // Select/deselect all orders
    const toggleSelectAll = () => {
        const checkboxes = document.querySelectorAll<HTMLInputElement>(".order-checkbox");
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
        }).catch(err => {
            console.error('복사 실패:', err);
            alert('복사에 실패했습니다.');
        });
    };

    // Copy all orders to clipboard
    const copyAllOrders = () => {
        const rows = document.querySelectorAll<HTMLTableRowElement>("#orderTableBody tr");
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
        }).catch(err => {
            console.error('복사 실패:', err);
            alert('복사에 실패했습니다.');
        })
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
                                <TableHead
                                    key={index}
                                    className="text-center"
                                >
                                    {item}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => {
                            const isDuplicatedAddress = duplicatedAddresses.has(order.주소.trim());
                            const price = order.정산대상금액;
                            const formattedPrice = price.toLocaleString('ko-KR');

                            return (
                                <TableRow
                                    key={order.주문아이디}
                                    className="text-center"
                                >
                                    <TableCell>
                                        <Input
                                            type="checkbox"
                                            className="order-checkbox"
                                        />
                                    </TableCell>
                                    <TableCell>{order.주문아이디}</TableCell>
                                    <TableCell>{order.상품아이디}</TableCell>
                                    <TableCell>{order.합배송아이디}</TableCell>
                                    <TableCell>{order.주문시점.toLocaleDateString()}</TableCell>
                                    <TableCell>{formattedPrice} ₩</TableCell>
                                    <TableCell>{order.수령인}</TableCell>
                                    <TableCell>{order.수량}</TableCell>
                                    <TableCell>{order.옵션}</TableCell>
                                    <TableCell>{order.수령인연락처}</TableCell>
                                    <TableCell>{order.우편번호}</TableCell>
                                    <TableCell>
                                        {isDuplicatedAddress ? (
                                            <span className="text-red-500 font-extrabold">{order.주소}</span>
                                        ) : (
                                            <>{order.주소}</>
                                        )}
                                    </TableCell>
                                    <TableCell>{order.공동현관비밀번호}</TableCell>
                                    <TableCell>{order.수령방법}</TableCell>
                                    <TableCell>{order.운송장번호}</TableCell>
                                    <TableCell>{order.상태}</TableCell>
                                    <TableCell className='flex gap-2'>
                                        <Select onValueChange={(value: Status) => updateOrderStatus(order.주문아이디, value)}>
                                            <SelectTrigger className="w-[100px]">
                                                <SelectValue placeholder={order.처리상태} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="대기중">대기중</SelectItem>
                                                <SelectItem value="처리중">처리중</SelectItem>
                                                <SelectItem value="완료">완료</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </section>
        </div>
    );
}

export default ExcelUpload;