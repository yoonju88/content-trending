'use client'
import React, { useState } from 'react';
import * as XLSX from 'xlsx'; // Excel 처리 라이브러리 : npm install xlsx
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { InitialDashboardItems } from '@/utils/dash-board';
import { Status } from '@/utils/status';
import Dashboard from './Dashboard';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select'

type ExcelUploadProps<T> = {
    processExcelData: (data: any[]) => T[]
    orders: T[];
    tableHeaders: string[];
}

const ExcelUpload = <T extends {}>({ processExcelData, orders, tableHeaders }: ExcelUploadProps<T>) => {
    const [loading, setLoading] = useState(false);
    const [ordersData, setOrdersData] = useState<T[]>([]);
    const [dashboardData, setDashboardData] = useState(InitialDashboardItems);
    const [duplicatedAddresses, setDuplicatedAddresses] = useState<Set<string>>(new Set());

    // Handle file upload and parse Excel data
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoading(true);
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            const fileExtension = file.name.split('.').pop();
            if (!['xlsx', 'xls'].includes(fileExtension || '')) {
                alert('엑셀 파일만 업로드 가능합니다.');
                return;
            }
        }

        if (file) {
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: "array" });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(firstSheet);
                const transformed: T[] = processExcelData(jsonData);
                setOrdersData(transformed);
                updateDashboard(transformed);
                // 중복 주소 처리
                const addressMap = new Map<string, number>();
                transformed.forEach((order) => {
                    const address = (order as any).주소.trim();
                    addressMap.set(address, (addressMap.get(address) || 0) + 1);
                });

                const duplicatedAddresses = new Set<string>();
                addressMap.forEach((count, address) => {
                    if (count > 1) duplicatedAddresses.add(address);
                });
                setDuplicatedAddresses(duplicatedAddresses);
                setLoading(false);
            }
            reader.readAsArrayBuffer(file);
        }
    }

    // Update dashboard data
    const updateDashboard = (data: T[]) => {
        const totalOrders = data.length;
        const pendingOrders = data.filter((order: any) => order.상태 === "대기중").length;
        const processingOrders = data.filter((order: any) => order.상태 === "처리중").length;
        const completedOrders = data.filter((order: any) => order.상태 === "완료").length;

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
        const updatedOrders = ordersData.map((order: any) =>
            order.주문아이디 === orderNumber
                ? { ...order, 상태: newStatus }
                : order
        );
        setOrdersData(updatedOrders);
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
        <div className="flex flex-col space-y-14">
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
            <Dashboard data={dashboardData} />
            <section>
                <div className="flex space-x-5">
                    <Button
                        onClick={copySelectedOrders}
                        variant="default"
                        size="lg"
                        type="button"
                    >
                        선택한 주문 복사
                    </Button>
                    <Button
                        onClick={copyAllOrders}
                        variant="default"
                        size="lg"
                        type="button"
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
                        {ordersData.map((order: any, index: number) => {
                            const isDuplicatedAddress = duplicatedAddresses.has(order.주소.trim());
                            const price = order.정산대상금액
                            const formattedPrice = price.toLocaleString('ko-KR');
                            const formatDate = (date: Date | string) =>
                                new Date(date).toLocaleDateString('ko-KR');
                            return (
                                <TableRow
                                    key={index}
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
                                    <TableCell>{formatDate(order.주문시점)}</TableCell>
                                    <TableCell>{formattedPrice}</TableCell>
                                    <TableCell>{order.수령인}</TableCell>
                                    <TableCell>{order.수량}</TableCell>
                                    <TableCell>{order.옵션}</TableCell>
                                    <TableCell>{order.수령인연락처}</TableCell>
                                    <TableCell>{order.우편번호}</TableCell>
                                    <TableCell>{isDuplicatedAddress ? (
                                        <span className="text-red-500 font-extrabold">
                                            {order.주소}
                                        </span>
                                    ) : (
                                        <>{order.주소}</>
                                    )}
                                    </TableCell>
                                    <TableCell>{order.공동현관비밀번호}</TableCell>
                                    <TableCell>{order.수령방법}</TableCell>
                                    <TableCell>{order.운송장번호}</TableCell>
                                    <TableCell>{order.상태}</TableCell>
                                    <TableCell className='flex gap-2'>
                                        <Select
                                            value={order.상태}
                                            onValueChange={(value: Status) => updateOrderStatus(order.주문아이디, value)}
                                        >
                                            <SelectTrigger className="w-[100px]">
                                                <SelectValue />
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