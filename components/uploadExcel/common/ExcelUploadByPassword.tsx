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
import NaverTable from '../NaverTable';
import SmartStoreTable from '../SmartStoreTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type ExcelUploadProps<T> = {
    processExcelData: (data: any[]) => T[]
    orders: T[];
    tableHeaders: string[];
}
type Path = '/naver' | '/smart-store';

const pathToComponent: Record<Path, React.ComponentType<any>> = {
    '/naver': NaverTable,
    '/smart-store': SmartStoreTable,
};

const ExcelUploadByPassword = <T extends {}>({ processExcelData, orders, tableHeaders }: ExcelUploadProps<T>) => {
    const rawPath = usePathname()
    const path = rawPath as Path;
    const SelectedTBody = pathToComponent[path] || null;

    const [loading, setLoading] = useState(false);
    const [ordersData, setOrdersData] = useState<T[]>([]);
    const [dashboardData, setDashboardData] = useState(InitialDashboardItems);
    const [duplicatedAddresses, setDuplicatedAddresses] = useState<Set<string>>(new Set());
    const [isPasswordProtected, setIsPasswordProtected] = useState(false);
    const [password, setPassword] = useState('');
    const [file, setFile] = useState<File | null>(null);

    // Handle file upload and parse Excel data
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoading(true);
        const selectedFile = e.target.files ? e.target.files[0] : null;

        if (!selectedFile) {
            setLoading(false);
            return;
        }
        const fileExtension = selectedFile.name.split('.').pop();
        if (!['xlsx', 'xls'].includes(fileExtension || '')) {
            alert('엑셀 파일만 업로드 가능합니다.');
            setLoading(false);
            return;
        }
        setFile(selectedFile);
        checkIfPasswordProtected(selectedFile);
        setLoading(false);
    }
    // Function to check if the file is password protected
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

            const result = await response.json();
            console.log('📥 서버 응답 (비밀번호 확인):', result);

            if (
                result.message.includes('비밀번호') ||
                result.message.includes('암호화') ||
                result.message.includes('password')
            ) {
                // 🔐 암호화된 파일임 → 비밀번호 입력 받기
                setIsPasswordProtected(true);
            } else {
                // ❌ 암호화 안 된 파일 → 이 컴포넌트에서는 사용 안 함
                alert('암호화된 엑셀 파일만 업로드 가능합니다.');
            }
        } catch (error) {
            console.error('❌ 암호화 확인 실패:', error);
            alert('파일을 확인할 수 없습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleDuplicatedAddresses = (orders: T[]) => {
        const addressMap = new Map<string, number>();
        orders.forEach((order) => {
            const address = ((order as any).주소 || (order as any).수취인주소 || (order as any).통합배송지 || '').trim();
            addressMap.set(address, (addressMap.get(address) || 0) + 1);
        });
        const duplicated = new Set<string>();
        addressMap.forEach((count, address) => {
            if (count > 1) duplicated.add(address);
        });
        setDuplicatedAddresses(duplicated);
    };
    // Function to handle file processing with password
    const processFileWithPassword = async (file: File, password: string) => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('file', file);
            formData.append('password', password);

            console.log('📤 파일 업로드 시도 (비밀번호 입력):', {
                fileName: file.name,
                fileSize: file.size,
                hasPassword: true
            });

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            console.log('📥 서버 응답 (비밀번호 입력):', result);

            if (!result.success) {
                alert(result.message);
                return;
            }

            const transformed: T[] = processExcelData(result.data);
            setOrdersData(transformed);
            updateDashboard(transformed);
            setIsPasswordProtected(false);

            // Handle duplicated addresses
            const addressMap = new Map<string, number>();
            transformed.forEach((order) => {
                const address = ((order as any).주소 || (order as any).수취인주소 || (order as any).통합배송지 || '').trim();
                addressMap.set(address, (addressMap.get(address) || 0) + 1);
            });

            const duplicatedAddresses = new Set<string>();
            addressMap.forEach((count, address) => {
                if (count > 1) duplicatedAddresses.add(address);
            });
            setDuplicatedAddresses(duplicatedAddresses);
        } catch (error) {
            console.error('❌ 파일 처리 실패:', error);
            alert('파일을 처리할 수 없습니다.');
        } finally {
            setLoading(false);
        }
    };

    // Function to handle file upload with password
    const handlePasswordUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (file && password) {
            await processFileWithPassword(file, password);
        } else {
            alert('비밀번호를 입력해주세요.');
        }
    };
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
                order.상품주문번호 === orderNumber;
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

    return (
        <div className="flex flex-col space-y-14">
            {isPasswordProtected ? (
                <form onSubmit={handlePasswordUpload}>
                    <Input
                        type="password"
                        placeholder="엑셀 파일 비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-4"
                        autoComplete="new-password"
                    />
                    <Button type="submit" className="mt-2">
                        {loading ? "로딩 중..." : "비밀번호 입력"}
                    </Button>
                </form>
            ) : (
                <ExcelFileUploader onFileChange={handleFileChange} />
            )}
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

export default ExcelUploadByPassword;