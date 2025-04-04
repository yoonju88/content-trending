export interface DashboardItem {
    label: string;
    value: number;
    id: string;
}

export const InitialDashboardItems: DashboardItem[] = [
    { label: "총 주문수", value: 0, id: "totalOrders" },
    { label: "대기중", value: 0, id: "pendingOrders" },
    { label: "처리중", value: 0, id: "processingOrders" },
    { label: "완료", value: 0, id: "completedOrders" },
]





