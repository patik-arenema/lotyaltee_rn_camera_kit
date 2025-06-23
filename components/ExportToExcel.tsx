import XLSX from 'xlsx';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { Buffer } from 'buffer';

if (typeof global.Buffer === 'undefined') {
    global.Buffer = Buffer;
}

export const exportToExcel = async (data: any[]) => {
    try {
        if (!data || data.length === 0) {
            console.warn('No data to export');
            return;
        }

        const rawHeaders = Object.keys(data[0]);
        const transformedHeaders = rawHeaders.map(key =>
            key.replace(/_/g, ' ').toUpperCase()
        );

        const wsData = [transformedHeaders, ...data.map(row => rawHeaders.map(key => row[key]))];
        const ws = XLSX.utils.aoa_to_sheet(wsData);

        transformedHeaders.forEach((_, index) => {
            const cellRef = XLSX.utils.encode_cell({ r: 0, c: index });
            if (!ws[cellRef]) return;
            ws[cellRef].s = {
                font: { bold: true },
            };
        });

        ws['!cols'] = Array(rawHeaders.length).fill({ wch: 40 });

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Report');

        const wbout = XLSX.write(wb, {
            type: 'binary',
            bookType: 'xlsx',
            cellStyles: true
        });

        const buffer = Buffer.from(wbout, 'binary');
        const filePath = `${RNFS.DocumentDirectoryPath}/report_${Date.now()}.xlsx`;

        await RNFS.writeFile(filePath, buffer.toString('base64'), 'base64');

        await Share.open({
            url: `file://${filePath}`,
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            showAppsToView: true,
            failOnCancel: false,
        });
    } catch (error) {
        console.error('Error exporting Excel file:', error);
    }
};
