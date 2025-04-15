import React from 'react'
import { NaverOrders } from '@/utils/naver';
import { Status } from '@/utils/status';
import { TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { StatusSelector } from "./common/StatusSelector";

type CoupangTableProps = {
    ordersData: NaverOrders[];
    duplicatedAddresses: Set<string>;
    updateOrderStatus: (orderId: string, newStatus: Status) => void;
};

export default function CoupangTable({ ordersData, duplicatedAddresses, updateOrderStatus }: CoupangTableProps) {
    return (
        <TableBody>
            {ordersData.map((order: NaverOrders, index: number) => {
                const isDuplicatedAddress = duplicatedAddresses.has(order.배송지.trim());
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
                        <TableCell>{order.상품주문번호}</TableCell>
                        <TableCell>{formatDate(order.결제일)}</TableCell>
                        <TableCell>{formatDate(order.배송완료일)}</TableCell>
                        <TableCell>{formattedPrice(order.최종상품별총주문금액)}  ₩</TableCell>
                        <TableCell>{order.배송비합계}</TableCell>
                        <TableCell>{order.구매자명}</TableCell>
                        <TableCell>{order.수량}</TableCell>
                        <TableCell>{order.옵션정보}</TableCell>
                        <TableCell>{order.수취인명}</TableCell>
                        <TableCell>{order.구매자연락처}</TableCell>
                        <TableCell>{order.수취인연락처1}</TableCell>
                        <TableCell>{order.우편번호}</TableCell>
                        <TableCell>{isDuplicatedAddress ? (
                            <span className="text-red-500 font-extrabold">
                                {order.배송지}
                            </span>
                        ) : (
                            <>{order.배송지}</>
                        )}
                        </TableCell>
                        <TableCell>{order.상태}</TableCell>
                        <TableCell className='flex gap-2'>
                            <StatusSelector
                                value={order.상태}
                                onValueChange={(value: Status) =>
                                    updateOrderStatus(order.상품주문번호, value)
                                }
                            />
                        </TableCell>
                    </TableRow>
                )
            })}
        </TableBody>
    )
}
