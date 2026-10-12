// P06 edukasi: gerbang kontrol di backend. Tidak menerbitkan voucher nyata.
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: { 'content-type': 'application/json' }, body: JSON.stringify({ error: 'Gunakan POST' }) };
  let pesan = '';
  try { pesan = String(JSON.parse(event.body || '{}').message || '').slice(0, 1000); }
  catch { return { statusCode: 400, headers: { 'content-type': 'application/json' }, body: JSON.stringify({ error: 'JSON tidak valid' }) }; }
  const memintaHakKhusus = /abaikan|ignore|admin|diskon\s*90|voucher staf|aturan sebelumnya|kode staf|terbitkan voucher/i.test(pesan);
  // Gerbang backend memutus permintaan berhak khusus sebelum aksi voucher demo.
  const balasan = memintaHakKhusus
    ? 'Permintaan ditolak oleh kontrol keamanan. Chatbot tidak berwenang menerbitkan voucher khusus; hubungi petugas kantin.'
    : /menu|makan|minum|voucher/i.test(pesan)
      ? 'Menu hari ini: nasi goreng, mi ayam, dan teh. Voucher demo umum KANTIN10 hanya contoh dan tidak berlaku untuk transaksi nyata.'
      : 'Saya dapat membantu informasi menu kantin dan voucher umum demo.';
  return { statusCode: 200, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }, body: JSON.stringify({ mode: 'aman-demo', reply: balasan, actionAllowed: !memintaHakKhusus, realVoucherSystem: false }) };
};
