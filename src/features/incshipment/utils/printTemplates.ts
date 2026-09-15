import { IncshipmentDetail } from '../types/incshipment.types';
import { generateCode128DataURI } from './code128';

const escXml = (s: string) => s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const generatePrintTemplate = (details: IncshipmentDetail[]) => {
    const pages = details.map((item, idx) => {
        const sn = item.sn || 'NO-SN';
        const code_product = item.code_product || '-';
        const nm_product = item.nm_product || '-';

        const largeURI = generateCode128DataURI(sn, { w: 0.759, h: 60, showText: false });
        const smallURI = generateCode128DataURI(sn, { w: 0.759, h: 35, showText: false });

        const emptyRows = [0, 1, 2, 3].map(() => `
                <tr>
                    <td colspan="3" style="height: 15px;">&nbsp;</td>
                </tr>`).join('');

        const smallRows = [0, 1, 2, 3].map(() => `
                <tr>
                    <td style="width: 75px; vertical-align: bottom; padding-bottom: 5px;">
                        <span style="font-size: 6pt;">${escXml(code_product)}</span>
                    </td>
                    <td style="text-align: left; padding-top: 10px;">
                        <img src="${smallURI}" style="display: block;" />
                        <div style="font-size: 8pt; width: 100%; margin-top: 2px; padding-left: 10px;">
                            ${escXml(sn)}
                        </div>
                    </td>
                    <td style="width: 20px;"></td>
                </tr>`).join('');

        const pageBreak = idx < details.length - 1 ? 'page-break-after: always;' : '';

        return `
        <div style="${pageBreak}">
            <table style="width: 100%; border: none;" cellpadding="0" cellspacing="0">
                <tr>
                    <td colspan="3">
                        <img src="" style="height: 70px; width: auto; display: block;" />
                    </td>
                </tr>
                <tr>
                    <td colspan="3" style="padding-top: 15px;">
                        <p style="font-size: 11pt; margin: 0; padding-right: 10px;">${escXml(nm_product)}</p>
                    </td>
                </tr>
                <tr>
                    <td colspan="3" style="padding-top: 15px;">
                        <p style="margin: 0;"><b style="font-size: 19pt;">${escXml(code_product)}</b></p>
                    </td>
                </tr>
                <tr>
                    <td colspan="3" style="padding-top: 10px; padding-left: 20px;">
                        <img src="${largeURI}" style="display: block;" />
                        <div style="font-size: 8.5pt; margin-top: 2px; text-align: center; width: 100%;">
                            ${escXml(sn)}
                        </div>
                    </td>
                </tr>
                ${emptyRows}
                ${smallRows}
            </table>
        </div>`;
    }).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <title>Barcode Format</title>
    <style>
        @page { margin: 15px; size: A4 portrait; }
        body { margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; -webkit-print-color-adjust: exact; }
        table { border-collapse: collapse; border-spacing: 0; width: 100%; }
        td { padding: 0; }
    </style>
</head>
<body>
${pages}
</body>
</html>`;
};
