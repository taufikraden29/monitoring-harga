import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET() {
    const res = await fetch('https://himalayareload.otoreport.com/harga.js.php?id=b61804374cb7e3d207028ac05b492f82265047801111a2c0bc3bb288a7a843341b24cdc21347fbc9ba602392b435df468647-6');
    const html = await res.text();
    const $ = cheerio.load(html);

    const data = {};
    let currentGroup = 'Lainnya';

    $('table.tabel tr').each((i, el) => {
        const header = $(el).find('td[colspan="6"]');
        if (header.length) {
            currentGroup = header.text().trim();
            data[currentGroup] = [];
            return;
        }
        const cols = $(el).find('td');
        if (cols.length >= 4) {
            const kode = $(cols[0]).text().trim();
            const keterangan = $(cols[1]).text().trim();
            const harga = parseFloat($(cols[2]).text().replace('.', '').replace(',', '.')) || 0;
            const status = $(cols[3]).text().trim();
            data[currentGroup].push({
                kode,
                keterangan,
                harga,
                status,
                perubahan: 'Baru 🆕' // Untuk awal
            });
        }
    });

    return NextResponse.json(data);
}
