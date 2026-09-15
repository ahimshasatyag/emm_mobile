/**
 * Code128 SVG Barcode Generator — ported directly from TCPDF tcpdf_barcodes_1d.php
 *
 * Exact same character pattern table and encoding logic as the PHP version.
 * Produces inline SVG strings that render without any external library or internet.
 *
 * Usage:
 *   generateCode128SVG("40.401.01710.27.04696", { w: 1.5, h: 60 })
 *   → returns a full <svg>...</svg> string
 */

// ─── Exact TCPDF pattern table (chr[], lines 959-1066 of tcpdf_barcodes_1d.php) ──────
// Index = symbol value (0-106 data + 107 STOP + 108 END)
const CHR: string[] = [
  '212222', /* 00 */
  '222122', /* 01 */
  '222221', /* 02 */
  '121223', /* 03 */
  '121322', /* 04 */
  '131222', /* 05 */
  '122213', /* 06 */
  '122312', /* 07 */
  '132212', /* 08 */
  '221213', /* 09 */
  '221312', /* 10 */
  '231212', /* 11 */
  '112232', /* 12 */
  '122132', /* 13 */
  '122231', /* 14 */
  '113222', /* 15 */
  '123122', /* 16 */
  '123221', /* 17 */
  '223211', /* 18 */
  '221132', /* 19 */
  '221231', /* 20 */
  '213212', /* 21 */
  '223112', /* 22 */
  '312131', /* 23 */
  '311222', /* 24 */
  '321122', /* 25 */
  '321221', /* 26 */
  '312212', /* 27 */
  '322112', /* 28 */
  '322211', /* 29 */
  '212123', /* 30 */
  '212321', /* 31 */
  '232121', /* 32 */
  '111323', /* 33 */
  '131123', /* 34 */
  '131321', /* 35 */
  '112313', /* 36 */
  '132113', /* 37 */
  '132311', /* 38 */
  '211313', /* 39 */
  '231113', /* 40 */
  '231311', /* 41 */
  '112133', /* 42 */
  '112331', /* 43 */
  '132131', /* 44 */
  '113123', /* 45 */
  '113321', /* 46 */
  '133121', /* 47 */
  '313121', /* 48 */
  '211331', /* 49 */
  '231131', /* 50 */
  '213113', /* 51 */
  '213311', /* 52 */
  '213131', /* 53 */
  '311123', /* 54 */
  '311321', /* 55 */
  '331121', /* 56 */
  '312113', /* 57 */
  '312311', /* 58 */
  '332111', /* 59 */
  '314111', /* 60 */
  '221411', /* 61 */
  '431111', /* 62 */
  '111224', /* 63 */
  '111422', /* 64 */
  '121124', /* 65 */
  '121421', /* 66 */
  '141122', /* 67 */
  '141221', /* 68 */
  '112214', /* 69 */
  '112412', /* 70 */
  '122114', /* 71 */
  '122411', /* 72 */
  '142112', /* 73 */
  '142211', /* 74 */
  '241211', /* 75 */
  '221114', /* 76 */
  '413111', /* 77 */
  '241112', /* 78 */
  '134111', /* 79 */
  '111242', /* 80 */
  '121142', /* 81 */
  '121241', /* 82 */
  '114212', /* 83 */
  '124112', /* 84 */
  '124211', /* 85 */
  '411212', /* 86 */
  '421112', /* 87 */
  '421211', /* 88 */
  '212141', /* 89 */
  '214121', /* 90 */
  '412121', /* 91 */
  '111143', /* 92 */
  '111341', /* 93 */
  '131141', /* 94 */
  '114113', /* 95 */
  '114311', /* 96 */
  '411113', /* 97 */
  '411311', /* 98 */
  '113141', /* 99 */
  '114131', /* 100 */
  '311141', /* 101 */
  '411131', /* 102 */
  '211412', /* 103 START A */
  '211214', /* 104 START B */
  '211232', /* 105 START C */
  '233111', /* 106 STOP */
  '200000', /* 107 END (terminating bar) */
];

/** Code 128 B character set: ASCII 32-127 in order (matches $keys_b in PHP) */
const KEYS_B = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\x7f';

export interface Code128Options {
  /** Minimum bar width in pixels (matches $w in PHP getBarcodeHTML) */
  w?: number;
  /** Total barcode height in pixels (matches $h in PHP getBarcodeHTML) */
  h?: number;
  /** Bar color */
  color?: string;
  /** Show human-readable text below bars */
  showText?: boolean;
  /** Font size for text below barcode */
  fontSize?: number;
}

/**
 * Encode text as Code 128 B symbol values.
 * Ported from barcode_c128($code, 'B') in TCPDF.
 */
function encodeCode128B(text: string): number[] | null {
  const codeData: number[] = [];
  for (let i = 0; i < text.length; i++) {
    const charId = text.charCodeAt(i);
    if (charId < 32 || charId > 127) {
      // unsupported character
      return null;
    }
    const pos = KEYS_B.indexOf(text[i]);
    if (pos === -1) return null;
    codeData.push(pos);
  }
  return codeData;
}

/**
 * Generate an inline SVG string for a Code 128 B barcode.
 * Matches exactly what TCPDF produces with getBarcodeHTML($w, $h).
 *
 * @param text   The string to encode (same as $code in PHP)
 * @param opts   Width and height options (same as $w, $h in PHP)
 * @returns      Full <svg>...</svg> string, or empty string on error
 */
export function generateCode128SVG(text: string, opts: Code128Options = {}): string {
  const {
    w = 1.5,
    h = 60,
    color = 'black',
    showText = true,
    fontSize = 10,
  } = opts;

  if (!text) return '';

  // 1. Encode data symbols (Code B)
  const dataSymbols = encodeCode128B(text);
  if (!dataSymbols) return '';

  // 2. START B = 104
  const startId = 104;

  // 3. Checksum (same formula as TCPDF)
  //    check = (startId + Σ(value_i × (i+1))) mod 103
  let checksum = startId;
  for (let i = 0; i < dataSymbols.length; i++) {
    checksum += dataSymbols[i] * (i + 1);
  }
  checksum = checksum % 103;

  // 4. Build full symbol list: START + data + check + STOP + END
  const symbols: number[] = [startId, ...dataSymbols, checksum, 106, 107];

  // 5. Decode each symbol into bar/space array
  //    Pattern digits alternate: bar, space, bar, space, bar, space (+ extra for STOP/END)
  interface BarElement { t: boolean; w: number; }
  const bcode: BarElement[] = [];
  let maxw = 0;

  for (const sym of symbols) {
    const pattern = CHR[sym];
    if (!pattern) continue;
    for (let j = 0; j < pattern.length; j++) {
      const width = parseInt(pattern[j], 10);
      const isBar = (j % 2) === 0;
      bcode.push({ t: isBar, w: width });
      maxw += width;
    }
  }

  // 6. Render to SVG — identical logic to getBarcodeSVGcode() in TCPDF
  const totalW = maxw * w;
  const totalH = showText ? h + fontSize + 4 : h;

  let rects = '';
  let x = 0;
  for (const bar of bcode) {
    const bw = bar.w * w;
    if (bar.t) {
      rects += `<rect x="${x.toFixed(3)}" y="0" width="${bw.toFixed(3)}" height="${h}" fill="${color}"/>`;
    }
    x += bw;
  }

  const textEl = showText
    ? `<text x="${(totalW / 2).toFixed(1)}" y="${h + fontSize + 1}" text-anchor="middle" font-family="monospace" font-size="${fontSize}" fill="${color}">${text}</text>`
    : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalW.toFixed(1)}" height="${totalH}" viewBox="0 0 ${totalW.toFixed(1)} ${totalH}">${rects}${textEl}</svg>`;
}

/**
 * Convenience: returns a data-URI string (for use in <img src="...">)
 */
export function generateCode128DataURI(text: string, opts: Code128Options = {}): string {
  const svg = generateCode128SVG(text, opts);
  if (!svg) return '';
  const encoded = encodeURIComponent(svg);
  return `data:image/svg+xml,${encoded}`;
}
