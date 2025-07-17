import { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/scraper')
      .then(res => res.json())
      .then(rawData => {
        // Kelompokkan berdasarkan Keterangan Produk
        const grouped = {};
        rawData.forEach(item => {
          const group = item.keterangan.split(' ')[0]; // Misal: "AXIS 10K" ambil "AXIS"
          if (!grouped[group]) {
            grouped[group] = [];
          }
          grouped[group].push({
            ...item,
            harga: parseFloat(item.harga.replace('.', '').replace(',', '.')) || 0,
            perubahan: item.perubahan || '',
          });
        });
        setData(grouped);
        setLoading(false);
      })
      .catch(() => {
        setData({});
        setLoading(false);
      });
  }, []);

  const getBadgeColor = (status) => {
    if (status?.includes('Naik')) return 'bg-red-100 text-red-700';
    if (status?.includes('Turun')) return 'bg-green-100 text-green-700';
    if (status?.includes('Baru')) return 'bg-blue-100 text-blue-700';
    return 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">📊 Monitoring Harga Axis (Group)</h1>

      <div className="space-y-8">
        {Object.entries(data).map(([group, items]) => (
          <div key={group} className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-bold mb-4 text-gray-700">{group}</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perubahan</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map((item) => (
                    <tr key={item.kode}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{item.kode}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{item.keterangan}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                        Rp {item.harga.toLocaleString('id-ID')}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{item.status}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getBadgeColor(item.perubahan)}`}>
                          {item.perubahan}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
