import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Status } from '@/utils/status'

interface StatusSelectorProps {
    value: string;
    onValueChange: (value: Status) => void;
}

export const StatusSelector = ({ value, onValueChange }: StatusSelectorProps) => {
    return (
        <Select
            value={value}
            onValueChange={onValueChange}
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
    );
}; 