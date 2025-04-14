import React from 'react'
import { Orders } from '@/utils/alwaysData';
import { Status } from '@/utils/status';
import { TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { StatusSelector } from "./common/StatusSelector";

type AlwaysTableProps = {
    ordersData: Orders[];
    duplicatedAddresses: Set<string>;
    updateOrderStatus: (orderId: string, newStatus: Status) => void;
};

export default function AlwaysTable({ ordersData, duplicatedAddresses, updateOrderStatus }: AlwaysTableProps) {
    return (
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
                            <StatusSelector
                                value={order.상태}
                                onValueChange={(value: Status) => updateOrderStatus(order.주문아이디, value)}
                            />
                        </TableCell>
                    </TableRow>
                )
            })}
        </TableBody>
    )
}
