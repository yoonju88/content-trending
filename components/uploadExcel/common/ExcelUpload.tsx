'use client'
import React, { useState } from 'react';
import * as XLSX from 'xlsx'; // Excel 처리 라이브러리 : npm install xlsx
import { InitialDashboardItems } from '@/utils/dash-board';
import { Status } from '@/utils/status';
import Dashboard from './Dashboard';
import { Table } from '../../ui/table';
import { ExcelFileUploader } from './ExcelFileUploader';
import { OrderActions } from './OrderActions';
import TableHeads from './TableHeads'
import { usePathname } from 'next/navigation';
import AlwaysTable from '../AlwaysTable';
import CoupangTable from '../CoupangTable';
import NaverTable from '../NaverTable';
import SmartStoreTable from '../SmartStoreTable';

type ExcelUploadProps<T> = {
    processExcelData: (data: any[]) => T[]
    orders: T[];
    tableHeaders: string[];
}
type Path = '/always' | '/coupang' | '/naver' | '/smart-store';

const pathToComponent: Record<Path, React.ComponentType<any>> = {
    '/always': AlwaysTable,
    '/coupang': CoupangTable,
    '/naver': NaverTable,
    '/smart-store': SmartStoreTable,
};

const ExcelUpload = <T extends {}>({ processExcelData, orders, tableHeaders }: ExcelUploadProps<T>) => {
    const rawPath = usePathname()
    const path = rawPath as Path;
    const SelectedTBody = pathToComponent[path] || null;

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
                    const address = ((order as any).주소 || (order as any).수취인주소 || '').trim();
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
        const updatedOrders = ordersData.map((order: any) => {
            const isMatched =
                order.주문번호 === orderNumber || order.주문아이디 === orderNumber;
            return isMatched ? { ...order, 상태: newStatus } : order;
        });

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

    const checkIfPasswordProtected = async (file: File) => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('file', file);
            formData.append('password', ''); // 빈 비밀번호로 시도

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!data.success) {
                if (data.message.includes('비밀번호')) {
                    setShowPasswordForm(true);
                    return;
                }
                throw new Error(data.message);
            }

            // 이메일 검증
            const userEmail = session?.user?.email;
            if (!userEmail || !config.adminEmails.includes(userEmail)) {
                throw new Error('관리자만 파일을 업로드할 수 있습니다.');
            }

            setOrdersData(data.data);
        } catch (error) {
            console.error('파일 처리 오류:', error);
            alert(error instanceof Error ? error.message : '파일 처리 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col space-y-14">
            <ExcelFileUploader onFileChange={handleFileChange} />
            <Dashboard data={dashboardData} />
            <section>
                <OrderActions
                    onCopySelected={copySelectedOrders}
                    onCopyAll={copyAllOrders}
                />
                <Table className="mt-10">
                    <TableHeads
                        tableHeaders={tableHeaders}
                        onChange={toggleSelectAll}
                    />
                    {SelectedTBody && (
                        <SelectedTBody
                            ordersData={ordersData}
                            duplicatedAddresses={duplicatedAddresses}
                            updateOrderStatus={updateOrderStatus}
                        />
                    )}
                </Table>
            </section>
        </div>
    );
}

export default ExcelUpload;