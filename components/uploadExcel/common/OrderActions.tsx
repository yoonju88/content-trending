import { Button } from '@/components/ui/button'

interface OrderActionsProps {
    onCopySelected: () => void;
    onCopyAll: () => void;
}

export const OrderActions = ({ onCopySelected, onCopyAll }: OrderActionsProps) => {
    return (
        <div className="flex space-x-5">
            <Button
                onClick={onCopySelected}
                variant="default"
                size="lg"
                type="button"
            >
                선택한 주문 복사
            </Button>
            <Button
                onClick={onCopyAll}
                variant="default"
                size="lg"
                type="button"
            >
                전체 주문 복사
            </Button>
        </div>
    );
}; 