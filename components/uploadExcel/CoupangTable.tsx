import React from 'react'
import { CoupangOrders } from '@/utils/coupang';
import { Status } from '@/utils/status';
import { TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { StatusSelector } from "./common/StatusSelector";

type CoupangTableProps = {
    ordersData: CoupangOrders[];
    duplicatedAddresses: Set<string>;
    updateOrderStatus: (orderId: string, newStatus: Status) => void;
};

export default function CoupangTable({ ordersData, duplicatedAddresses, updateOrderStatus }: CoupangTableProps) {
    return (
        <TableBody>
            {ordersData.map((order: any, index: number) => {
                const isDuplicatedAddress = duplicatedAddresses.has(order.수취인주소.trim());
                const formattedPrice = (num: number) =>
                    num.toLocaleString('ko-KR');
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
                        <TableCell>{order.번호}</TableCell>
                        <TableCell>{formatDate(order.주문시출고예정일)}</TableCell>
                        <TableCell>{order.주문번호}</TableCell>
                        <TableCell>{formatDate(order.주문일)}</TableCell>
                        <TableCell>{order.구매자}</TableCell>
                        <TableCell>{order.기타}</TableCell>
                        <TableCell>{formattedPrice(order.결제액)}  ₩</TableCell>
                        <TableCell>{formattedPrice(order.배송비)}  ₩</TableCell>
                        <TableCell>{order.구매수}</TableCell>
                        <TableCell>{order.등록옵션명}</TableCell>
                        <TableCell>{order.수취인이름}</TableCell>
                        <TableCell>{order.구매자전화번호}</TableCell>
                        <TableCell>{order.우편번호}</TableCell>
                        <TableCell>{isDuplicatedAddress ? (
                            <span className="text-red-500 font-extrabold">
                                {order.수취인주소}
                            </span>
                        ) : (
                            <>{order.수취인주소}</>
                        )}
                        </TableCell>
                        <TableCell>{order.배송메세지}</TableCell>
                        <TableCell>{order.결제위치}</TableCell>
                        <TableCell>{order.상태}</TableCell>
                        <TableCell className='flex gap-2'>
                            <StatusSelector
                                value={order.상태}
                                onValueChange={(value: Status) => updateOrderStatus(order.주문번호, value)}
                            />
                        </TableCell>
                    </TableRow>
                )
            })}
        </TableBody>
    )
}
