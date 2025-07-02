// SummaryCreator.js
import fetch from 'node-fetch';
import { OpenAI } from 'openai';
import fs from 'fs/promises'; // Dosya işlemleri için fs modülünü ekledik
import path from 'path'; // Yol işlemleri için path modülünü ekledik

export class SummaryCreator {
  constructor(apiKey) {
    this.openai = new OpenAI({ apiKey });
    this.summariesFilePath = path.resolve(process.cwd(), 'summaries.json'); // summaries.json dosyasının yolu
  }

  async fetchHTML(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.text();
  }

  extractMainText(html) {
    return html
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 5000); // GPT token limiti
  }

  countWords(text) {
    return text.split(/\s+/).filter(Boolean).length;
  }

  // summarizeWithTitle fonksiyonunu güncelledik: targetSummaryWordCount parametresi eklendi
  async summarizeWithTitle(text, targetSummaryWordCount) {
    // Prompt'u güncelledik: Özetin istenen kelime sayısını belirtiyoruz
    const prompt = `
Aşağıdaki haber metni yaklaşık ${this.countWords(text)} kelimeden oluşuyor. Bu metni dikkatlice incele ve bana şu formatta JSON olarak yanıt ver:

{
  "title": "Metne uygun başlık",
  "summary": "Metnin anlamını bozmadan, yaklaşık ${targetSummaryWordCount} kelime uzunluğunda kısa ve öz bir özet"
}

İçerik:
${text}
    `.trim();

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o', // GPT-4o modelini kullanıyoruz
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
    });

    const content = completion.choices[0].message.content;

    try {
      const jsonStart = content.indexOf('{');
      const jsonEnd = content.lastIndexOf('}') + 1;
      const jsonText = content.slice(jsonStart, jsonEnd);
      return JSON.parse(jsonText);
    } catch (err) {
      throw new Error('GPT yanıtı düzgün JSON değil: ' + content);
    }
  }

  // Yeni eklenen kısım: Özetleri dosyaya kaydetme
  async saveSummary(summaryData) {
    let summaries = [];
    try {
      const data = await fs.readFile(this.summariesFilePath, 'utf8');
      summaries = JSON.parse(data);
    } catch (error) {
      // Dosya yoksa veya boşsa, yeni bir diziyle başla
      if (error.code === 'ENOENT' || error instanceof SyntaxError) {
        summaries = [];
      } else {
        throw error;
      }
    }
    summaries.push({ ...summaryData, timestamp: new Date().toISOString() }); // Zaman damgası ekledik
    await fs.writeFile(this.summariesFilePath, JSON.stringify(summaries, null, 2));
  }

  // Yeni eklenen kısım: Özetleri dosyadan okuma
  async getSummaries() {
    try {
      const data = await fs.readFile(this.summariesFilePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT' || error instanceof SyntaxError) {
        return []; // Dosya yoksa veya boşsa boş bir dizi döndür
      }
      throw error;
    }
  }

  // createSummary fonksiyonunu güncelledik: targetSummaryWordCount parametresi eklendi
  async createSummary(newsUrl, targetSummaryWordCount = 100) { // Varsayılan 100 kelime
    try {
      const html = await this.fetchHTML(newsUrl);
      const mainText = this.extractMainText(html);
      // summarizeWithTitle fonksiyonuna targetSummaryWordCount'ı iletiyoruz
      const result = await this.summarizeWithTitle(mainText, targetSummaryWordCount);
      await this.saveSummary({ url: newsUrl, title: result.title, summary: result.summary, targetWordCount: targetSummaryWordCount }); // Özet ve URL'yi kaydet
      return result;
    } catch (error) {
      console.error('Özet çıkarılırken hata oluştu:', error);
      throw error;
    }
  }
}
