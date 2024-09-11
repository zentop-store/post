// Import fetch untuk post ke Discord API
const fetch = require('node-fetch');

// Fungsi utama untuk mengirim pesan ke Discord
const sendDiscordMessage = async (token, channelId, message) => {
  const payload = {
    content: message
  };

  const headers = {
    'Authorization': `Bot ${token}`, // Menggunakan token bot
    'Content-Type': 'application/json'
  };

  try {
    // Mengirimkan pesan ke channel Discord
    const response = await fetch(`https://discord.com/api/v9/channels/${channelId}/messages`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });

    if (response.status === 200) {
      console.log("Pesan terkirim:", message);
      return true;
    } else {
      console.error(`Gagal mengirim pesan, status code: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error("Error saat mengirim pesan:", error);
    return false;
  }
};

// Fungsi utama handler API di Vercel
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed' });
  }

  const { token, channelId, message, delay } = req.body;

  if (!token || !channelId || !message || !delay) {
    return res.status(400).json({ error: 'Data tidak lengkap. Pastikan token, channelId, message, dan delay diisi.' });
  }

  // Fungsi untuk mengirim pesan berulang kali dengan delay
  const sendMessages = async () => {
    while (true) {
      const success = await sendDiscordMessage(token, channelId, message);

      if (success) {
        console.log("Pesan berhasil dikirim");
      } else {
        console.log("Gagal mengirim pesan, mencoba lagi...");
      }

      // Menunggu sesuai delay sebelum mengirim pesan berikutnya
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  };

  // Mulai mengirim pesan berulang kali
  sendMessages();

  // Mengirim respons sukses ke client
  res.status(200).json({ message: 'Proses pengiriman pesan dimulai.' });
                                                          }
