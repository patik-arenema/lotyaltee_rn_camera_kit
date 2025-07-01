import XLSX from 'xlsx';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { Buffer } from 'buffer';

// Ensure global Buffer is available
if (typeof global.Buffer === 'undefined') {
    global.Buffer = Buffer;
}

export const exportToExcel = async (data: any[], title: string) => {
    try {
        if (!data || data.length === 0) {
            console.warn('No data to export');
            return;
        }

        const rawHeaders = Object.keys(data[0]);
        const transformedHeaders = rawHeaders.map(key =>
            key.replace(/_/g, ' ').toUpperCase()
        );

        // Prepare worksheet data with title, empty row, headers, and rows
        const wsData = [
            [title], // Title row
            [], // Empty row
            transformedHeaders,
            ...data.map(row => rawHeaders.map(key => row[key])),
        ];

        const ws = XLSX.utils.aoa_to_sheet(wsData);

        // Style the title cell (A1)
        const titleCell = ws['A1'];
        if (titleCell) {
            titleCell.s = {
                font: {
                    bold: true,
                    sz: 14,
                },
                alignment: {
                    horizontal: 'center',
                    vertical: 'center',
                },
            };
        }

        // Merge the title row across all columns
        ws['!merges'] = [{
            s: { r: 0, c: 0 },
            e: { r: 0, c: rawHeaders.length - 1 },
        }];

        // Bold styling for the column headers (row index 2)
        transformedHeaders.forEach((_, index) => {
            const cellRef = XLSX.utils.encode_cell({ r: 2, c: index });
            if (ws[cellRef]) {
                ws[cellRef].s = {
                    font: {
                        bold: true,
                    },
                };
            }
        });

        // Set column widths
        ws['!cols'] = Array(rawHeaders.length).fill({ wch: 40 });

        // Create workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Report');

        const wbout = XLSX.write(wb, {
            type: 'binary',
            bookType: 'xlsx',
            cellStyles: true,
        });

        const buffer = Buffer.from(wbout, 'binary');

        // Safe filename using title
        const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const fileName = `${safeTitle}_${Date.now()}.xlsx`;
        const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

        // Save to file system
        await RNFS.writeFile(filePath, buffer.toString('base64'), 'base64');

        // Share the file
        await Share.open({
            url: `file://${filePath}`,
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            filename: fileName.replace('.xlsx', ''),
            showAppsToView: true,
            failOnCancel: false,
        });
    } catch (error) {
        console.error('Error exporting Excel file:', error);
    }
};
