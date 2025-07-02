// public/script.js
document.addEventListener('DOMContentLoaded', () => {
    const newsUrlInput = document.getElementById('newsUrl');
    const summaryWordCountInput = document.getElementById('summaryWordCount'); // Yeni input
    const summarizeButton = document.getElementById('summarizeButton');
    const summaryList = document.getElementById('summaryList');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const errorMessage = document.getElementById('errorMessage');
    const errorDetails = document.getElementById('errorDetails');

    // Kaydedilmiş özetleri yükle
    async function loadSummaries() {
        try {
            const response = await fetch('/api/summaries');
            const summaries = await response.json();

            summaryList.innerHTML = ''; // Mevcut listeyi temizle
            if (summaries.length === 0) {
                summaryList.innerHTML = '<li class="list-group-item text-center text-muted">Henüz özetlenmiş bir haber yok.</li>';
                return;
            }

            // En son eklenen özet en üstte olacak şekilde sırala
            summaries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            summaries.forEach(summary => {
                const listItem = document.createElement('li');
                listItem.className = 'list-group-item';
                listItem.innerHTML = `
                    <h6>${summary.title}</h6>
                    <p>${summary.summary}</p>
                    <small><a href="${summary.url}" target="_blank" class="text-decoration-none">${summary.url}</a></small>
                    <br>
                    <small class="text-muted">${new Date(summary.timestamp).toLocaleString()}</small>
                    ${summary.targetWordCount ? `<br><small class="text-info">Hedef Kelime Sayısı: ${summary.targetWordCount}</small>` : ''}
                `;
                summaryList.appendChild(listItem);
            });
        } catch (error) {
            console.error('Özetler yüklenirken hata oluştu:', error);
            showError('Özetler yüklenirken bir sorun oluştu.');
        }
    }

    // Hata mesajını göster
    function showError(message) {
        errorDetails.textContent = message;
        errorMessage.classList.remove('d-none');
    }

    // Hata mesajını gizle
    function hideError() {
        errorMessage.classList.add('d-none');
        errorDetails.textContent = '';
    }

    // Özetle butonuna tıklama olayı
    summarizeButton.addEventListener('click', async () => {
        const url = newsUrlInput.value.trim();
        const summaryWordCount = summaryWordCountInput.value; // Kelime sayısını al
        hideError(); // Yeni işlem başlamadan önce hatayı gizle

        if (!url) {
            showError('Lütfen özetlemek istediğiniz haberin URL\'sini girin.');
            return;
        }

        loadingSpinner.classList.remove('d-none'); // Yükleniyor spinner'ını göster
        summarizeButton.disabled = true; // Butonu devre dışı bırak

        try {
            const response = await fetch('/api/summarize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url, summaryWordCount }), // Kelime sayısını da gönder
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || 'Bilinmeyen bir hata oluştu.');
            }

            const result = await response.json();
            console.log('Özet başarıyla oluşturuldu:', result);
            newsUrlInput.value = ''; // Input'u temizle
            // summaryWordCountInput.value = '100'; // Kelime sayısını varsayılana sıfırla (isteğe bağlı)
            await loadSummaries(); // Listeyi güncelle
        } catch (error) {
            console.error('Özetleme sırasında hata:', error);
            showError(`Özetleme başarısız: ${error.message}`);
        } finally {
            loadingSpinner.classList.add('d-none'); // Yükleniyor spinner'ını gizle
            summarizeButton.disabled = false; // Butonu tekrar etkinleştir
        }
    });

    // Sayfa yüklendiğinde özetleri yükle
    loadSummaries();
});
