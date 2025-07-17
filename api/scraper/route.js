import cheerio from 'cheerio';
import fetch from 'node-fetch';

export async function GET() {
    const url = 'https://himalayareload.otoreport.com/harga.js.php?id=b61804374cb7e3d207028ac05b492f82265047801111a2c0bc3bb288a7a843341b24cdc21347fbc9ba602392b435df468647-6';
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    const rows = $('table.tabel tr').toArray();
    const result = [];

    rows.forEach(row => {
        const cols = $(row).find('td');
        if (cols.length >= 4) {
            result.push({
                kode: $(cols[0]).text().trim(),
                keterangan: $(cols[1]).text().trim(),
                harga: $(cols[2]).text().trim(),
                status: $(cols[3]).text().trim(),
            });
        }
    });

    return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
