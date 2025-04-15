declare module 'xlsx-populate' {
    interface Workbook {
        sheet(index: number): Sheet;
    }

    interface Sheet {
        usedRange(): Range;
    }

    interface Range {
        value(): any[][];
    }

    const XlsxPopulate: {
        fromFileAsync(arg0: Buffer<ArrayBuffer>, arg1: { password: string; }): unknown;
        fromDataAsync(data: Buffer, options?: { password?: string }): Promise<Workbook>;
    };

    export default XlsxPopulate;
} 