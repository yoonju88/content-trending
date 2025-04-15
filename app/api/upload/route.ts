import { NextResponse } from 'next/server';
import XlsxPopulate from 'xlsx-populate';
import fs from 'fs';
import path from 'path';

// POST 요청을 처리하는 함수
export async function POST(req: Request) {
    try {
        // 요청 본문에서 FormData를 가져옵니다
        const formData = await req.formData();
        // 파일과 비밀번호를 FormData에서 가져옵니다
        const file = formData.get('file') as File;
        const password = formData.get('password') as string;

        if (!file || !password) {
            return NextResponse.json(
                { success: false, message: '파일과 비밀번호를 모두 입력해주세요.' },
                { status: 400 }
            );
        }

        // uploads 디렉토리 생성
        const uploadsDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        // 파일 저장 경로 설정
        const filePath = path.join(uploadsDir, file.name);

        // 파일을 서버에 저장
        const arrayBuffer = await file.arrayBuffer();
        fs.writeFileSync(filePath, Buffer.from(arrayBuffer));
        // 파일 데이터를 Buffer로 변환
        const buffer = Buffer.from(arrayBuffer);

        try {
            // 비밀번호가 있는 엑셀 파일을 XlsxPopulate으로 읽기
            const workbook = await XlsxPopulate.fromDataAsync(buffer, { password });

            // 첫 번째 시트 읽기
            const sheet = workbook.sheet(0);
            const range = sheet.usedRange();

            if (!range) {
                return NextResponse.json(
                    { success: false, message: '시트에 데이터가 없습니다.' },
                    { status: 400 }
                );
            }

            const rows = range.value(); // 2차원 배열
            if (!Array.isArray(rows) || rows.length < 2) {
                return NextResponse.json(
                    { success: false, message: '유효한 데이터가 없습니다.' },
                    { status: 400 }
                );
            }
            rows.shift();
            const [rawHeaders, ...dataRows] = rows;
            // 헤더 정제
            const headers = rawHeaders.map((h) =>
                typeof h === 'string' ? h.trim() : (h?.toString()?.trim() || '')
            );

            // 데이터를 JSON 형식으로 변환
            const jsonData = dataRows.map((row: string[]) => {
                const obj: Record<string, string> = {};
                headers.forEach((header: string, index: number) => {
                    obj[header] = row[index];
                });
                return obj;
            });

            // 처리된 데이터를 클라이언트로 반환
            return NextResponse.json({
                success: true,
                message: '엑셀 파일 처리 성공',
                data: jsonData,
            });
        } catch (error) {
            console.error('엑셀 파일 읽기 오류:', error);
            return NextResponse.json(
                { success: false, message: '비밀번호가 틀렸습니다.' },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('엑셀 파일 처리 오류:', error);
        return NextResponse.json(
            { success: false, message: '엑셀 파일 처리 중 오류 발생' },
            { status: 500 }
        );
    }
}