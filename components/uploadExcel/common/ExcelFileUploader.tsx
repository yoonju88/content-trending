import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface ExcelFileUploaderProps {
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ExcelFileUploader = ({ onFileChange }: ExcelFileUploaderProps) => {
    return (
        <div>
            <Input
                type="file"
                id="excelFile"
                accept=".xlsx, .xls"
                onChange={onFileChange}
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
    );
}; 