const axios = require('axios');
const cheerio = require('cheerio');

// Konfigurasi Telegram
const BOT_TOKEN = '7714170388:AAGLtPHvCC-PZMEQdY90j9BzrHccouB-1CA';
const CHAT_ID = '1236786198';

// Daftar URL produk yang akan di-scrape
const products = [
    {
        name: '1 Voucher Nominal Rp. 50,000 di Aplikasi Kopi Kenangan',
        url: 'https://loyalty.aldmic.com/reward/16046',
        selector: '#main > section > div > div.col-12.col-md-9 > div > div > div.row.mt-1.gy-3 > div:nth-child(1) > a > div.card-body.px-3.py-3 > button'
    },
     {
        name: 'Grab Gifts (Transport) Rp. 50,000 di Aplikasi Grab',
        url: 'https://loyalty.aldmic.com/reward/14667',
        selector: '#main > section > div > div.col-12.col-md-9 > div > div > div.row.mt-1.gy-3 > div:nth-child(4) > a > div.card-body.px-3.py-3 > button'
    },
    {
        name: 'JBL C150SI Black In-Ear Earphone cable with Mic',
        url: 'https://loyalty.aldmic.com/reward/14876',
        selector: '#main > section > div > div.col-12.col-md-9 > div > div > div.row.mt-1.gy-3 > div:nth-child(2) > a > div.card-body.px-3.py-3 > button'
    },
    // Tambahkan produk lain di sini
];

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
        for (const product of products) {
            // Lakukan HTTP GET request ke website
            const { data } = await axios.get(product.url, {
                headers: {
                    'cookie': 'cross-site-cookie=name; cross-site-cookie=name; _ga_Q0M8VSMG8Z=GS1.1.1741668254.12.1.1741668295.19.0.0; one-ux=eyJpdiI6Im9haU5OU2VobnpqWVJjUHErMk9reFE9PSIsInZhbHVlIjoiSVRhZWM0THNDXC9VXC9QUnV3cDRVTXhRPT0iLCJtYWMiOiJiNjY5NDc0YzRkZmZlNjA0ODM3ODYxNDEwZDJlNzUyMGFkMGVhY2Q5ZGEzOGY4MGEyMDE2Zjk2MjMyMDhjNWZhIn0%3D; source_site=eyJpdiI6InkzbVh6aGQ3TmRLam9uM0dPZkYzNFE9PSIsInZhbHVlIjoibmxuWHJxRTVLWXZ2T1luejRUemV0c1hiMzdRcmp6UTNXUVA5UzFSOVNIZz0iLCJtYWMiOiI5NWMwOTUzMzdmZWM3ZjQ1ZjFjYWRlMzU4N2RhNWUzOGVmMjYyMzRhOWQ1ZWMzMmY2NDk4NGU4NTdmMTBjM2E5In0%3D; _ga=GA1.1.2000599954.1738673941; cf_clearance=yQqoZWikGFDCGPVZszPNbl6uAWzUrYrJN6NqYWKQxww-1741668649-1.2.1.1-yVtflRqAQjZNIQCUoeVTTNHas5xIUxwofbfnPJhIe69E1PbHDwuB578tcSijmEzXUvbqXftv.ef54Q8FFYtxD5CADBTvAimFFgzNTlB27m79JdElZmijudoGo8ikSv9vMFtksKWqOp7h7OnBTc.uSvdDZrt2eqhB2um.RSNUowjCnDp4CyzPJQNyxGsYMczrkEH9GzCe3HdCLV0N80vav7CyOZQHb00niXCTNl0PaWXuMBDwCcLRSaygbxaQ0OFfZiiGxX6EUuyrniFYDaMTKD5Bu0mgu7L_PDZmFJozvffly0XILqG0APTuEnKsOzMgqwGSYWCGnzGo8uMXan0Nh2DdQFKiGi81Z31Jo..jwq0; _ga_KT34JXK1TR=GS1.1.1741664874.16.1.1741668998.0.0.0; _ga_2CQ38WYFTM=GS1.1.1741668204.23.1.1741668998.60.0.0; XSRF-TOKEN=eyJpdiI6IjlkSkc4czl2VnJlWkRHRnJNU1drZkE9PSIsInZhbHVlIjoiZXhCa3lGUTV2Unkzb2NCeG5QUm84czNTSFV1RFg1VUNFY3o5Rlp4YnVzM0M0aGoxczdDR0hcLzI1c0t5Wm5mcmYiLCJtYWMiOiJkMTFlOTg4MGNkYzI3NGE3MTEzMDg5YjY0ZjFiNmY3ZTVhZDhkOTlhZWJlMzViODIxZjJhYzMwMWNkODI4MGY0In0%3D; aldmic_session=eyJpdiI6IlZGS0tENU5ZVVFSSWJHeGhQQTZqZ1E9PSIsInZhbHVlIjoiZFZtaUdcL2pQR1d4WHZJUm16K0ZuZTUrbDZHSWswWDdUQWxWNHZKUlZtQVV4a2hENDFUMzF4cjA5a3JoNnpwdVAiLCJtYWMiOiI2NDFiNWQ2MDhmNTk0OGRiZmY4N2M3ODQwMmQyNTc5MWFlNzc0Nzc2YjFiMjE4Yjc5OTUzNDdjOTkzYjkzMGM0In0%3D'                
                }
            });

            // Load HTML ke cheerio
            const $ = cheerio.load(data);

            // Cari elemen yang mengandung informasi reward
            const rewardElement = $(product.selector).text().trim();
            console.log(`Log Data Scrape untuk ${product.name}: ${rewardElement}`);

            if (rewardElement.includes("Redeem Now")) {
                console.log(`${product.name} tersedia!`);
                // Kirim notifikasi ke Telegram
                await sendTelegramMessage(`🚀 ${product.name} tersedia kembali! Cek sekarang: ${product.url}`);
            } else {
                console.log(`${product.name} masih kosong.`);
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Jalankan fungsi checkRestock setiap interval waktu tertentu
setInterval(checkRestock, 60000); // Cek setiap 1 menit

// Jalankan sekali saat pertama kali dijalankan
checkRestock();