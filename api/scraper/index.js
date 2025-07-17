import requests
from bs4 import BeautifulSoup
import json
import os


def load_old_data():
    if os.path.exists('../frontend/public/hasil.json'):
        with open('../frontend/public/hasil.json', 'r') as f:
            return json.load(f)
    return {}


def save_new_data(data):
    with open('../frontend/public/hasil.json', 'w') as f:
        json.dump(data, f, indent=2)


def to_dict(data):
    return {item["kode"]: item for group in data.values() for item in group}


url = 'https://himalayareload.otoreport.com/harga.js.php?id=b61804374cb7e3d207028ac05b492f82265047801111a2c0bc3bb288a7a843341b24cdc21347fbc9ba602392b435df468647-6'
res = requests.get(url)
soup = BeautifulSoup(res.content, 'html.parser')

rows = soup.select('table.tabel tr')

grouped_data = {}
current_group = 'Lainnya'

for row in rows:
    # Cek apakah baris ini judul produk (colspan 6)
    header = row.find('td', {'colspan': '6'})
    if header:
        current_group = header.text.strip()
        grouped_data[current_group] = []
        continue

    cols = row.find_all('td')
    if len(cols) >= 4:
        kode = cols[0].text.strip()
        keterangan = cols[1].text.strip()
        harga_text = cols[2].text.strip().replace('.', '').replace(',', '.')
        try:
            harga = float(harga_text)
        except ValueError:
            harga = 0
        status = cols[3].text.strip()

        grouped_data.setdefault(current_group, []).append({
            "kode": kode,
            "keterangan": keterangan,
            "harga": harga,
            "status": status
        })

# Cek perubahan harga per kode
old_data_dict = to_dict(load_old_data())

for group in grouped_data:
    for item in grouped_data[group]:
        kode = item['kode']
        old = old_data_dict.get(kode)
        if old:
            harga_lama = old['harga']
            harga_baru = item['harga']
            if harga_baru > harga_lama:
                item['perubahan'] = 'Naik 🔺'
            elif harga_baru < harga_lama:
                item['perubahan'] = 'Turun 🔻'
            else:
                item['perubahan'] = 'Tetap 〰️'
        else:
            item['perubahan'] = 'Baru 🆕'

save_new_data(grouped_data)

print('✅ Scraping selesai. Data sudah dikelompokkan di frontend/public/hasil.json')
