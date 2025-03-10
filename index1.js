const axios = require('axios');
const cheerio = require('cheerio');

// Konfigurasi Telegram
const BOT_TOKEN = '7714170388:AAGLtPHvCC-PZMEQdY90j9BzrHccouB-1CA';
const CHAT_ID = '1236786198';

// URL website yang akan di-scrape
const url = 'https://loyalty.aldmic.com/reward/14667';

// Fungsi untuk mengirim pesan ke Telegram
async function sendTelegramMessage(message) {
    try {
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        const response = await axios.post(url, {
            chat_id: CHAT_ID,
            text: message,
        });
        console.log('Pesan terkirim:', response.data);
    } catch (error) {
        console.error('Gagal mengirim pesan:', error.response ? error.response.data : error.message);
    }
}

// Fungsi untuk memeriksa restok reward
async function checkRestock() {
    try {
        // Lakukan HTTP GET request ke website
        const { data } = await axios.get(url, {
          headers: {
            'cookie': 'cross-site-cookie=name; cross-site-cookie=name; cf_clearance=1zNJc1Z_C9R5.KKqeOamM8KbrNnbbzcDteiCYY7Sqjk-1741615317-1.2.1.1-VmB_z_JGaAcrVWuRlYtnBOQP.btOBfTw8wCG_AaQQlQXw4xr7R4wdl4JkKLKtLNdnoi1XKVoZiZ.oEjpyXuCH85usVeU4rX97ZXYXXraJRW7Bfmy99GSO_AS3Pr1CKQylbI7RPmFOO7RZ6DjDCVaWwKM5L3lmtE57TYx5wQlJiZbjOg_.nKzx4Us.k7dd55M2QbnpJyrVc5CkKb0oE1mx4t0lVRJoZOC8L6F6gLuBhOCLqM_lvGvnNohNi6cSfi8R1Pg_tagMVAkpe5fjCGWAMmcIhGNjXqUzkjF2wJp5c7R1REac1Ee8grGD5kjHcEC5AsjaUdFqPev2te1JGxxX.Kh8LK5L9U1AYGMG0zeefwkvx_J1gMpZrzAr9lViKBOA5cNlDdqOzal9FgGhgy6jgYqU3n.il6iEdxsLOJQW88; _ga_Q0M8VSMG8Z=GS1.1.1741612670.10.1.1741615474.60.0.0; one-ux=eyJpdiI6IlwvNFZNVWZBWE1YNHlORUlnMWZEMFNnPT0iLCJ2YWx1ZSI6InU1ZTVhMEZZdGNpZlwvd1JxUFEzeFN3PT0iLCJtYWMiOiJmMGE1MWIzOGMyNWEwNWVmZGQwMjliYzQxZTljZmRhNmEwNmE1ODZlMjc5ZmJhZmIyNzhmMTZmYWRjOWJmYjY2In0%3D; source_site=eyJpdiI6IlJsQ2pVdUJQM0JcL2o2ME9VaW1INjF3PT0iLCJ2YWx1ZSI6IjJLd2QxTFVzMG9WTTBIQmliTDV0OWZnRWFQVEZnTVREalJiUHk3WE1aK009IiwibWFjIjoiNTBmMTU2MjFlYzhjZTBhZWRjMzQzNGEwOTdhMmU0ZjUxZTEyNjY4MzU5MmIyMWYyNTZmMzI1ZDE5ODk0YTZjMyJ9; _ga=GA1.1.2000599954.1738673941; _ga_2CQ38WYFTM=GS1.1.1741615475.21.1.1741615774.59.0.0; _ga_KT34JXK1TR=GS1.1.1741608277.14.1.1741615774.0.0.0; XSRF-TOKEN=eyJpdiI6ImdpUTcxc09EazRtUXZcL1NmSFZQSENRPT0iLCJ2YWx1ZSI6IkZGK2RNSkVmODZiaFc3U2x5K3VYS0xoM2Z2QzB1VWl2alljTVNmTGg1cTdsZE40T1d1VkpSRmxWNUV0aDdHMjgiLCJtYWMiOiIzOTQwZGM3YjJlMTM1N2I1Yzg0N2VkZTZjN2U4MzRlNDljMGVhYzBiYTM5YWJjZjJkYzI1ZDdjYmM5NGYzNzQ5In0%3D; aldmic_session=eyJpdiI6IkE1QzBqVVdUeCtBVFVIWUlwSXNKUVE9PSIsInZhbHVlIjoiSjV2NVBLTjJ1dnVZUjFlbHF1ekhkQUUyY2dSWGgyS0xlUXJNeHV1RzNFVlM1RzlGVkRUcmt5OEVxZXYrUmVqWCIsIm1hYyI6IjkyZjBmMjIzZmMwYTJhZmU2MDAzODIwMzg1YWNjZTJjZmM0OGU2OTE2MDVkOGRjY2IwMjA4NTU0ZTU4ZTA4MDMifQ%3D%3D'
          }
        });

        // Load HTML ke cheerio
        const $ = cheerio.load(data);

        // Contoh: Cari elemen yang mengandung informasi reward
        const rewardElement = $('#main > section > div > div.col-md-8 > div > div > button').text().trim(); // Sesuaikan selector dengan struktur HTML website
        console.log("Log Data Scrape: " + rewardElement);
        if (rewardElement.includes("Redeem Now")) {
            console.log('Reward tersedia!');
            // Kirim notifikasi ke Telegram
             await sendTelegramMessage('🚀 Reward tersedia kembali! Cek sekarang: https://loyalty.aldmic.com/reward');
        } else {
            console.log('Reward masih kosong.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Jalankan fungsi checkRestock setiap interval waktu tertentu
setInterval(checkRestock, 3600000); // Cek setiap 1 menit

// Jalankan sekali saat pertama kali dijalankan
checkRestock();