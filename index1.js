const axios = require('axios');
const cheerio = require('cheerio');

// Konfigurasi Telegram
const BOT_TOKEN = '7714170388:AAGLtPHvCC-PZMEQdY90j9BzrHccouB-1CA';
const CHAT_ID = '1236786198';

// Daftar URL produk yang akan di-scrape
const products = [
    {
        name: 'Grab Food Rp. 25,000 di Aplikasi Grab',
        url: 'https://loyalty.aldmic.com/reward/13689',
        selector: '#main > section > div > div.col-12.col-md-9 > div > div > div.row.mt-1.gy-3 > div:nth-child(8) > a > div.card-body.px-3.py-3 > button'
    },
     {
        name: 'Grab Food Rp. 10,000 di Aplikasi Grab',
        url: 'https://loyalty.aldmic.com/reward/16785',
        selector: '#main > section > div > div.col-12.col-md-9 > div > div > div.row.mt-1.gy-3 > div:nth-child(1) > a > div.card-body.px-3.py-3 > button'
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
                    'cookie': 'cross-site-cookie=name; cross-site-cookie=name; _ga_2CQ38WYFTM=GS1.1.1741668204.23.1.1741670063.60.0.0; one-ux=eyJpdiI6InVKRXlpZTdkNzF6RWdZVmtEYkhpU3c9PSIsInZhbHVlIjoiMzJaUHJcLzJVNk5Eajd2RGhkUXkyVVE9PSIsIm1hYyI6IjVhMTU5OGQwOGZmZmQ0ZTAzNWY4MzJkNzAyY2FjMzBjOWI2OWRlNzlhMmY2ZDFiMTZiNDc5ZmQ0NTlhOTc1NGEifQ%3D%3D; source_site=eyJpdiI6ImtHUjNRMjRNZlI2dFdtUDVzYWpQbUE9PSIsInZhbHVlIjoieGNIdFVzdWRRYmhRQXF1aWNzaTk0anUrMXJXSWRsV2xHaTI3YU1RUWJvUT0iLCJtYWMiOiI0ODNhNzY3MDlkYmJhYmFlZGU0MTAwNTVmMDA1NTYxZWVlNDYzZjM3ZjE3YzcwNTdhMzU3NTQ4NjcwZWRiZDkzIn0%3D; _ga=GA1.1.2128515234.1738673991; cf_clearance=BgWO0O23sdC.9rvUdbI7yaFKH2oqv7nAjpMixPo7heE-1741670080-1.2.1.1-XVOq83b62WyZMUDdGL0ldrtAMDCTBCl8Qu2w7KS3FqCoeh0FErRsWNe3CySFJMA_DEezvwyo64h.YnKdOGGvea.JEGL60ZUHuDrlAYoxOpFa3xYWV.c8CM9w3Gb81cnLhmj4TRn58dGov07J8glzrWE8eIipwYWPu8Gj29pe8vQS.6ZtnIdNrbcaxASlrIErlsrhq30L96YQOGamPlSIOt.OBDmTUqK6xzHFfTcW.rz2ZPh81QkptDxyTXM.9Ehy_UTT3YJONQSMoMJot7Hl3y_N_GuZdB0HkknB8P1s846WQnDDEx7Fio7his.1XDGdJeXOG1Ee5V6t7dIL8q77QIYu9mxCsHq.n1ePg48VZ9k; _ga_KT34JXK1TR=GS1.1.1741664874.16.1.1741670108.0.0.0; _ga_Q0M8VSMG8Z=GS1.1.1741668254.12.1.1741670108.16.0.0; XSRF-TOKEN=eyJpdiI6IjVqRnVEVFFkaytlN2R0OU56ZUtaV3c9PSIsInZhbHVlIjoidmZ6TjFNMHEzeWxaUFVyQ2hsY2JcL0VMUUdPRXllcUNTd1BMMVRTTlFNUmx5em1UaGNOTU1HbFBuTlNFUU5nOEIiLCJtYWMiOiJkZTAxYTc1ZGZmNDgxZTcwMGQwZmJhYzI2MzExNDI2MzFmNDAzYmFhNjNkMjk5OWE0NTdkMDJlMTYzODVmMDA4In0%3D; aldmic_session=eyJpdiI6Im03d01GNHhrVTVDY0RrVDdsdGhCTEE9PSIsInZhbHVlIjoiNHM5dEJvWkpJclhoZDlQSU9iWWY2V2Q5ZHdEQmlPdXl6UmR5cThsdDZvTThEWGdqK3NvNm54MVJQWVNVNXFCcyIsIm1hYyI6IjkzOThjYmMxYzc5ODNkOWY1N2QxYmMxODlkNzJkM2ZkMjYyNmZmOGU4OWFkY2I4NzU1N2I2YjZiZDI2NDgzN2YifQ%3D%3D'                
                }
            });

            // Load HTML ke cheerio
            const $ = cheerio.load(data);

            // Cari elemen yang mengandung informasi reward
            const rewardElement = $(product.selector).text().trim();
            console.log(`Voc Untuk ${product.name}: ${rewardElement}`);

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