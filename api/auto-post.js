const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // Pastikan bahwa permintaan adalah POST dan memiliki tipe konten yang benar
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
  
  if (req.headers['content-type'] !== 'application/json') {
    return res.status(400).json({ success: false, message: 'Invalid Content-Type' });
  }

  // Mengambil data dari body permintaan
  const { token, channelId, message, delay } = req.body;

  // Validasi data yang diperlukan
  if (!token || !channelId || !message || !delay) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const payload = {
    content: message
  };

  const headers = {
    Authorization: `Bot ${token}`,
    'Content-Type': 'application/json'
  };

  try {
    // Mengirim pesan ke channel Discord
    const response = await fetch(`https://discord.com/api/v9/channels/${channelId}/messages`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });

    // Memeriksa jika pesan berhasil terkirim
    if (response.ok) {
      res.status(200).json({ success: true, message: 'Pesan berhasil dikirim!' });
    } else {
      res.status(response.status).json({ success: false, message: `Gagal mengirim pesan: ${response.status}` });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};
