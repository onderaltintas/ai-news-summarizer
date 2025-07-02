// app.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { SummaryCreator } from './SummaryCreator.js';
import dotenv from 'dotenv'; // dotenv paketini import ettik

// .env dosyasındaki ortam değişkenlerini yükle
dotenv.config();

// ES Modülleri için __dirname tanımlaması
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// OpenAI API Anahtarınızı .env dosyasından alıyoruz
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// API anahtarının mevcut olup olmadığını kontrol et
if (!OPENAI_API_KEY) {
  console.error('Hata: OPENAI_API_KEY ortam değişkeni tanımlanmamış. Lütfen .env dosyanızı kontrol edin.');
  process.exit(1); // Uygulamayı sonlandır
}

const summaryCreator = new SummaryCreator(OPENAI_API_KEY);

// JSON body parser'ı etkinleştir
app.use(express.json());
// Statik dosyaları sunmak için 'public' klasörünü kullan
app.use(express.static(path.join(__dirname, 'public')));

// Ana sayfa yönlendirmesi
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Özet oluşturma endpoint'i
app.post('/api/summarize', async (req, res) => {
  const { url, summaryWordCount } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL gereklidir.' });
  }

  const parsedSummaryWordCount = parseInt(summaryWordCount, 10);
  const finalSummaryWordCount = isNaN(parsedSummaryWordCount) || parsedSummaryWordCount <= 0 ? 100 : parsedSummaryWordCount;

  try {
    const summary = await summaryCreator.createSummary(url, finalSummaryWordCount);
    res.json(summary);
  } catch (error) {
    console.error('Özetleme hatası:', error.message);
    res.status(500).json({ error: 'Özet oluşturulurken bir hata oluştu.', details: error.message });
  }
});

// Kaydedilmiş özetleri getirme endpoint'i
app.get('/api/summaries', async (req, res) => {
  try {
    const summaries = await summaryCreator.getSummaries();
    res.json(summaries);
  } catch (error) {
    console.error('Özetleri okuma hatası:', error.message);
    res.status(500).json({ error: 'Özetler okunurken bir hata oluştu.', details: error.message });
  }
});

// Sunucuyu başlat
app.listen(port, () => {
  console.log(`Sunucu http://localhost:${port} adresinde çalışıyor`);
});
