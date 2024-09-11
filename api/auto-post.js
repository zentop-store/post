const axios = require('axios');

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
    'Authorization': `Bot ${token}`,  // Gunakan 'Bot' untuk token bot
    'Content-Type': 'application/json'
  };

  try {
    const response = await axios.post(`https://discord.com/api/v9/channels/${channelId}/messages`, payload, { headers });

    res.status(200).json({ success: true, message: 'Pesan berhasil dikirim!' });
  } catch (error) {
    console.error('Error:', error.message);  // Menampilkan pesan kesalahan
    res.status(error.response ? error.response.status : 500).json({
      success: false,
      message: `Gagal mengirim pesan: ${error.response ? error.response.status : 'Internal Server Error'}`,
      details: error.response ? error.response.data : 'Tidak ada detail kesalahan'
    });
  }
};
