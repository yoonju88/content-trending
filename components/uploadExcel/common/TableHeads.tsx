
// components/OrderTableHeader.tsx
import { TableHead, TableRow, TableHeader } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

interface OrderTableHeaderProps {
    tableHeaders: string[];
    onChange: () => void;
}

export default function TableHeads({ tableHeaders, onChange }: OrderTableHeaderProps) {
    return (
        <TableHeader>
            <TableRow>
                <TableHead>
                    <Input type="checkbox" id="selectAll" onChange={onChange} />
                </TableHead>
                {tableHeaders.map((item, index) => (
                    <TableHead key={index} className="text-center">
                        {item}
                    </TableHead>
                ))}
            </TableRow>
        </TableHeader>
    );
}
