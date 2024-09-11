const fetch = require('node-fetch');

// Fungsi untuk mengirim pesan ke channel Discord
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  if (req.headers['content-type'] !== 'application/json') {
    return res.status(400).json({ success: false, message: 'Invalid Content-Type' });
  }

  const { token, channelId, message, delay } = req.body;

  if (!token || !channelId || !message || !delay) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const payload = {
    content: message
  };

  const headers = {
    Authorization: `Bearer ${token}`,  // Gunakan Bearer untuk token akun
    'Content-Type': 'application/json'
  };

  try {
    const response = await fetch(`https://discord.com/api/v9/channels/${channelId}/messages`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });

    const responseBody = await response.text(); // Mendapatkan body respon untuk debugging

    if (response.ok) {
      res.status(200).json({ success: true, message: 'Pesan berhasil dikirim!' });
    } else {
      res.status(response.status).json({ success: false, message: `Gagal mengirim pesan: ${response.status}`, details: responseBody });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};
