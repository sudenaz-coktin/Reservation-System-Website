// anasayfa.js

// Veri depolama nesnesi
const veriler = {
    masalar: [],
    urunler: [
        { id: 1, ad: "Pizza", fiyat: 120.00, kategori: "ana-yemek" },
        { id: 2, ad: "Hamburger", fiyat: 95.50, kategori: "ana-yemek" },
        { id: 3, ad: "Çay", fiyat: 15.00, kategori: "icecek" },
        { id: 4, ad: "Kahve", fiyat: 25.00, kategori: "icecek" },
        { id: 5, ad: "Çikolatalı Sufle", fiyat: 60.00, kategori: "tatli" },
        { id: 6, ad: "Akdeniz Salatası", fiyat: 75.00, kategori: "salata" },
    ],
    adisyonlar: {}
};

// Uygulama şifreleri
const appSifreleri = {
    personel: "1234",
    yonetici: "4321"
};

// Global değişkenler
let seciliMasaId = null;
let seciliKullaniciTipi = null;

/* ---------------- Giriş Ekranı ---------------- */

function sifreAlaniniGoster(tip) {
    seciliKullaniciTipi = tip;
    const passwordContainer = document.getElementById('password-container');
    const loginError = document.getElementById('login-error');
    passwordContainer.style.display = 'block';
    loginError.innerText = '';
    document.getElementById('password-input').focus();
}

function girisYap() {
    const passwordInput = document.getElementById('password-input').value;
    const loginError = document.getElementById('login-error');

    if (passwordInput === appSifreleri[seciliKullaniciTipi]) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
        bildirimGoster('Giriş başarılı!', 'success');

        if (seciliKullaniciTipi === 'personel') {
            document.getElementById('raporlar-tab').style.display = 'none';
            document.getElementById('ayarlar-tab').style.display = 'none';
        } else {
            document.getElementById('raporlar-tab').style.display = 'inline-block';
            document.getElementById('ayarlar-tab').style.display = 'inline-block';
        }
        
        sayfaBaslangici();
    } else {
        loginError.innerText = 'Hatalı şifre. Lütfen tekrar deneyin.';
    }
}

function cikisYap() {
    document.getElementById('main-content').style.display = 'none';
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('password-input').value = '';
    document.getElementById('password-container').style.display = 'none';
    document.getElementById('login-error').innerText = '';
    bildirimGoster('Güvenli çıkış yapıldı.', 'info');
}

function sayfaBaslangici() {
    showSection('masa-yonetimi');
        // Eğer masalar zaten eklenmişse tekrar ekleme
    if (veriler.masalar.length > 0) {
        return;
    }
    const baslangicMasaSayisi = 20;
    for (let i = 1; i <= baslangicMasaSayisi; i++) {
        masaEkle(`Masa ${i}`, 'bos');
    }
    guncelIstatistikleriGoster();
    guncelUrunListesiGoster();
}

document.addEventListener('DOMContentLoaded', () => {
    // Sayfa yüklendiğinde çalıştır
document.addEventListener("DOMContentLoaded", () => {
    const passwordInput = document.getElementById("password-input");

    passwordInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Form submit vb. engellemek için
            girisYap(); // Normal giriş fonksiyonu çağrılır
        }
    });
});

    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('main-content').style.display = 'none';
    
});
// Sayfa yüklendiğinde çalıştır
document.addEventListener("DOMContentLoaded", () => {
    const passwordInput = document.getElementById("password-input");

    passwordInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Form submit vb. engellemek için
            girisYap(); // Normal giriş fonksiyonu çağrılır
        }
    });
});


/* ---------------- Genel Sayfa Kontrolleri ---------------- */

function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
        section.classList.remove('active');
    });
    document.getElementById(sectionId).style.display = 'block';
    document.getElementById(sectionId).classList.add('active');

    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[onclick="showSection('${sectionId}')"]`).classList.add('active');

    if (sectionId === 'odeme-islem') {
        adisyonlariGoster();
    } else if (sectionId === 'raporlar') {
        raporGoster('gunluk');
    } else if (sectionId === 'urun-yonetimi') {
        guncelUrunListesiGoster();
    }
}

/* ---------------- Masa Yönetimi ---------------- */

function masaEkle(ad, durum) {
    const masaGrid = document.getElementById('masaGrid');
    const yeniMasa = { id: veriler.masalar.length + 1, ad: ad, durum: durum };
    veriler.masalar.push(yeniMasa);

    const masaCard = document.createElement('div');
    masaCard.className = `masa-card ${durum}`;
    masaCard.dataset.id = yeniMasa.id;
    masaCard.dataset.masaNo = yeniMasa.id;
    masaCard.innerHTML = `
        <span class="masa-number">${yeniMasa.ad.split(' ')[1]}</span>
        <span class="masa-durum durum-${durum}">${durum.charAt(0).toUpperCase() + durum.slice(1)}</span>
    `;
    masaCard.addEventListener('click', () => masaDetayModalAc(yeniMasa.id));
    masaGrid.appendChild(masaCard);

    guncelIstatistikleriGoster();
}

function masaDetayModalAc(masaId) {
    const masa = veriler.masalar.find(m => m.id === masaId);
    if (!masa) return;

    seciliMasaId = masaId;
    const modal = document.getElementById('masaDetayModal');
    const modalBaslik = document.getElementById('masaDetayBaslik');
    const modalBody = document.getElementById('masaDetayBody');

    modalBaslik.innerText = `${masa.ad} Yönetimi`;
    modalBody.innerHTML = '';

    if (masa.durum === 'bos') {
        modalBody.innerHTML = `
            
            <button class="btn btn-primary" onclick="siparisGir()">Sipariş Gir</button>
            <button class="btn btn-secondary" onclick="rezerveEt()">Rezerve Et</button>
        `;
    } else if (masa.durum === 'dolu') {
        modalBody.innerHTML = `
            
            <button class="btn btn-primary" onclick="siparisGir()">Siparişe Ekle</button>
            <button class="btn btn-success" onclick="modalKapat(); showSection('odeme-islem'); document.getElementById('odemeMasaSec').value=${masaId}; masaAdisyonGetir(${masaId});">Ödeme Al</button>
        `;
    } else if (masa.durum === 'rezerve') {
        modalBody.innerHTML = `
            <p>Bu masa rezerve edilmiş.</p>
            <button class="btn btn-primary" onclick="siparisGir()">Sipariş Gir</button>
            <button class="btn btn-warning" onclick="rezervasyonIptalEt()">Rezervasyonu İptal Et</button>
        `;
    }

    modal.style.display = 'block';
    document.getElementById('modalOverlay').style.display = 'block';
}

function rezervasyonIptalEt() {
    if (seciliMasaId) {
        masaDurumGuncelle(seciliMasaId, 'bos');
        modalKapat();
        bildirimGoster(`Masa ${seciliMasaId} rezervasyonu iptal edildi.`, 'success');
    }
}

function siparisGir() {
    if (seciliMasaId) {
        // Burada masa durumu değiştirmiyoruz!
        modalKapat();
        urunSecimModalAc();
    }
}


function masaDurumGuncelle(id, yeniDurum) {
    const masa = veriler.masalar.find(m => m.id === id);
    if (masa) {
        masa.durum = yeniDurum;
        const masaCard = document.querySelector(`.masa-card[data-id="${id}"]`);
        if (masaCard) {
            masaCard.className = `masa-card ${yeniDurum}`;
            const durumSpan = masaCard.querySelector('.masa-durum');
            durumSpan.className = `masa-durum durum-${yeniDurum}`;
            durumSpan.innerText = yeniDurum.charAt(0).toUpperCase() + yeniDurum.slice(1);
        }
    }
    guncelIstatistikleriGoster();
}

function rezerveEt() {
    if (seciliMasaId) {
        masaDurumGuncelle(seciliMasaId, 'rezerve');
        modalKapat();
        bildirimGoster(`Masa ${seciliMasaId} rezerve edildi.`, 'success');
    }
}

function guncelIstatistikleriGoster() {
    const bosMasaSayisi = veriler.masalar.filter(m => m.durum === 'bos').length;
    const doluMasaSayisi = veriler.masalar.filter(m => m.durum === 'dolu').length;
    const rezerveMasaSayisi = veriler.masalar.filter(m => m.durum === 'rezerve').length;

    document.getElementById('bosMasa').innerText = bosMasaSayisi;
    document.getElementById('doluMasa').innerText = doluMasaSayisi;
    document.getElementById('rezerveMasa').innerText = rezerveMasaSayisi;
}

/* ---------------- Masa Silme ---------------- */

function masaSilModalAc() {
    const modal = document.getElementById("masaSilModal");
    const select = document.getElementById("silinecekMasa");
    select.innerHTML = '<option value="">Masa seçiniz...</option>';

    veriler.masalar.forEach(masa => {
        const option = document.createElement("option");
        option.value = masa.id;
        option.textContent = masa.ad;
        select.appendChild(option);
    });

    modal.style.display = "block";
    document.getElementById("modalOverlay").style.display = "block";
}

function masaSilOnay() {
    const select = document.getElementById("silinecekMasa");
    const masaId = parseInt(select.value);

    if (!masaId) {
        bildirimGoster("Lütfen silinecek masayı seçin!", "warning");
        return;
    }

    const masaIndex = veriler.masalar.findIndex(masa => masa.id === masaId);
    if (masaIndex > -1) {
        const silinecekMasa = veriler.masalar[masaIndex];
        
        if (veriler.adisyonlar[masaId] && veriler.adisyonlar[masaId].length > 0) {
            bildirimGoster("Bu masada açık sipariş var! Önce ödeme alın.", "warning");
            return;
        }
        
        veriler.masalar.splice(masaIndex, 1);
        const masaCard = document.querySelector(`.masa-card[data-id="${masaId}"]`);
        if (masaCard) {
            masaCard.remove();
        }
        delete veriler.adisyonlar[masaId];
        bildirimGoster(`${silinecekMasa.ad} silindi.`, "success");
    }

    modalKapat();
    guncelIstatistikleriGoster();
}

/* ---------------- Ürün Yönetimi ---------------- */

// Ürün Yönetimi için Sayfalama ve Arama Değişkenleri
let mevcutSayfa = 1;
let sayfaBasinaUrun = 6;
let aramaTerimi = '';
let secilenKategori = 'hepsi';

// guncelUrunListesiGoster, kategoriFiltrele, urunAra, urunKaydet, urunDuzenle, urunSil vb. 
// buraya tam haliyle eklenecek (senin son versiyonun doğruydu, sadece tekrarları sildim)

/* ---------------- Ürün Yönetimi ---------------- */

/**
 * Kategori kodunu Türkçe ada çevirir
 */
function kategoriAdiGetir(kategoriKodu) {
    const kategoriler = {
        'ana-yemek': 'Ana Yemek',
        'icecek': 'İçecek',
        'tatli': 'Tatlı',
        'salata': 'Salata',
        'aperitif': 'Aperitif',
        'corbalar': 'Çorbalar'
    };
    return kategoriler[kategoriKodu] || kategoriKodu;
}

/**
 * Ürün listesini sayfalama + filtreleme + arama ile gösterir
 */
function guncelUrunListesiGoster(filtreKategori = 'hepsi', aramaMetni = '') {
    secilenKategori = filtreKategori;
    aramaTerimi = aramaMetni;
    
    const urunListesi = document.getElementById('urunListesi');
    let filtrelenmisUrunler = veriler.urunler;
    
    if (filtreKategori !== 'hepsi') {
        filtrelenmisUrunler = filtrelenmisUrunler.filter(u => u.kategori === filtreKategori);
    }
    if (aramaMetni.trim() !== '') {
        filtrelenmisUrunler = filtrelenmisUrunler.filter(u => 
            u.ad.toLowerCase().includes(aramaMetni.toLowerCase())
        );
    }
    
    const toplamUrun = filtrelenmisUrunler.length;
    const toplamSayfa = Math.ceil(toplamUrun / sayfaBasinaUrun);
    if (mevcutSayfa > toplamSayfa) {
        mevcutSayfa = Math.max(1, toplamSayfa);
    }
    
    const baslangicIndex = (mevcutSayfa - 1) * sayfaBasinaUrun;
    const bitisIndex = baslangicIndex + sayfaBasinaUrun;
    const sayfadakiUrunler = filtrelenmisUrunler.slice(baslangicIndex, bitisIndex);
    
    urunListesi.innerHTML = '';
    
    if (toplamUrun === 0) {
        urunListesi.innerHTML = `
            <div class="urun-bos-durum">
                <h3>Ürün Bulunamadı</h3>
                <p>${aramaMetni ? 'Arama kriterlerinize' : 'Bu kategoride'} uygun ürün bulunmamaktadır.</p>
                <button class="btn btn-primary" onclick="yeniUrunEkle()">+ Yeni Ürün Ekle</button>
            </div>
        `;
        return;
    }
    
    const grid = document.createElement('div');
    grid.className = 'urun-liste';
    
    sayfadakiUrunler.forEach(urun => {
        const urunKart = document.createElement('div');
        urunKart.className = 'urun-kart';
        urunKart.innerHTML = `
            <div class="urun-kart-header">
                <h3 class="urun-kart-baslik">${urun.ad}</h3>
                <span class="urun-kategori-badge">${kategoriAdiGetir(urun.kategori)}</span>
            </div>
            <div class="urun-kart-icerik">
                <div class="urun-bilgi-satir">
                    <span class="urun-bilgi-etiket">Fiyat:</span>
                    <span class="urun-bilgi-deger urun-fiyat">${urun.fiyat.toFixed(2)} ₺</span>
                </div>
                <div class="urun-bilgi-satir">
                    <span class="urun-bilgi-etiket">Kategori:</span>
                    <span class="urun-kategori">${kategoriAdiGetir(urun.kategori)}</span>
                </div>
                <div class="urun-bilgi-satir">
                    <span class="urun-bilgi-etiket">Durum:</span>
                    <span class="urun-stok">Stokta</span>
                </div>
            </div>
            <div class="urun-kart-footer">
                <button class="urun-aksiyon-btn urun-duzenle-btn" onclick="urunDuzenle(${urun.id})" title="Ürünü Düzenle">
                    ✏️ Düzenle
                </button>
                <button class="urun-aksiyon-btn urun-sil-btn" onclick="urunSil(${urun.id})" title="Ürünü Sil">
                    🗑️ Sil
                </button>
            </div>
        `;
        grid.appendChild(urunKart);
    });
    
    urunListesi.appendChild(grid);
    sayfalamaKontrolleriniGuncelle(toplamSayfa, toplamUrun);
}

/**
 * Sayfalama kontrolleri
 */
function sayfalamaKontrolleriniGuncelle(toplamSayfa, toplamUrun) {
    let sayfalamaContainer = document.getElementById('sayfalamaContainer');
    
    if (!sayfalamaContainer) {
        sayfalamaContainer = document.createElement('div');
        sayfalamaContainer.id = 'sayfalamaContainer';
        sayfalamaContainer.className = 'sayfalama-container';
        document.getElementById('urunListesi').parentNode.appendChild(sayfalamaContainer);
    }
    
    if (toplamSayfa <= 1) {
        sayfalamaContainer.style.display = 'none';
        return;
    }
    
    sayfalamaContainer.style.display = 'flex';
    
    const baslangicUrun = Math.min((mevcutSayfa - 1) * sayfaBasinaUrun + 1, toplamUrun);
    const bitisUrun = Math.min(mevcutSayfa * sayfaBasinaUrun, toplamUrun);
    
    sayfalamaContainer.innerHTML = `
        <div class="sayfa-bilgi">
            ${baslangicUrun}-${bitisUrun} / ${toplamUrun} ürün
        </div>
        <div class="sayfalama-butonlar">
            <button class="sayfa-btn" onclick="sayfaGit(1)" ${mevcutSayfa <= 1 ? 'disabled' : ''}>⏮️</button>
            <button class="sayfa-btn" onclick="sayfaGit(${mevcutSayfa - 1})" ${mevcutSayfa <= 1 ? 'disabled' : ''}>◀️</button>
            ${sayfaNumaralariniOlustur(mevcutSayfa, toplamSayfa)}
            <button class="sayfa-btn" onclick="sayfaGit(${mevcutSayfa + 1})" ${mevcutSayfa >= toplamSayfa ? 'disabled' : ''}>▶️</button>
            <button class="sayfa-btn" onclick="sayfaGit(${toplamSayfa})" ${mevcutSayfa >= toplamSayfa ? 'disabled' : ''}>⏭️</button>
        </div>
    `;
}

function sayfaNumaralariniOlustur(mevcutSayfa, toplamSayfa) {
    let sayfaNumaralari = '';
    const gosterilecekSayfa = 5;
    
    let baslangic = Math.max(1, mevcutSayfa - Math.floor(gosterilecekSayfa / 2));
    let bitis = Math.min(toplamSayfa, baslangic + gosterilecekSayfa - 1);
    
    if (bitis - baslangic < gosterilecekSayfa - 1) {
        baslangic = Math.max(1, bitis - gosterilecekSayfa + 1);
    }
    
    for (let i = baslangic; i <= bitis; i++) {
        const aktifClass = i === mevcutSayfa ? 'aktif' : '';
        sayfaNumaralari += `<button class="sayfa-btn ${aktifClass}" onclick="sayfaGit(${i})">${i}</button>`;
    }
    
    return sayfaNumaralari;
}

function sayfaGit(yeniSayfa) {
    mevcutSayfa = yeniSayfa;
    guncelUrunListesiGoster(secilenKategori, aramaTerimi);
}

function sayfaBasinaUrunDegistir(yeniSayi) {
    sayfaBasinaUrun = parseInt(yeniSayi);
    mevcutSayfa = 1;
    guncelUrunListesiGoster(secilenKategori, aramaTerimi);
}

function urunAra() {
    const aramaInput = document.getElementById('urunAramaInput');
    if (aramaInput) {
        mevcutSayfa = 1;
        guncelUrunListesiGoster(secilenKategori, aramaInput.value);
    }
}

function kategoriFiltrele(kategori) {
    mevcutSayfa = 1;
    document.querySelectorAll('.kategori-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.kategori-btn[onclick="kategoriFiltrele('${kategori}')"]`)?.classList.add('active');
    guncelUrunListesiGoster(kategori, aramaTerimi);
}

/**
 * Ürün ekleme/düzenleme
 */
function yeniUrunEkle() {
    document.getElementById('urunEkleModal').style.display = 'block';
    document.getElementById('modalOverlay').style.display = 'block';
    document.querySelector('#urunEkleModal .modal-header h2').textContent = 'Yeni Ürün Ekle';
    document.getElementById('urunEkleForm').reset();
    const form = document.getElementById('urunEkleForm');
    form.dataset.mode = 'add';
    delete form.dataset.urunId;
}

function urunKaydet(event) {
    event.preventDefault();
    const form = event.target;
    const urunAdi = document.getElementById('urunAdi').value.trim();
    const urunKategori = document.getElementById('urunKategori').value;
    const urunFiyat = parseFloat(document.getElementById('urunFiyat').value);
    
    if (!urunAdi || !urunFiyat || urunFiyat <= 0) {
        bildirimGoster('Lütfen tüm alanları doğru şekilde doldurun!', 'warning');
        return;
    }
    
    const mode = form.dataset.mode || 'add';
    if (mode === 'edit') {
        const urunId = parseInt(form.dataset.urunId);
        const urun = veriler.urunler.find(u => u.id === urunId);
        if (urun) {
            urun.ad = urunAdi;
            urun.kategori = urunKategori;
            urun.fiyat = urunFiyat;
            bildirimGoster('Ürün başarıyla güncellendi!', 'success');
        }
    } else {
        const yeniId = veriler.urunler.length > 0 ? Math.max(...veriler.urunler.map(u => u.id)) + 1 : 1;
        veriler.urunler.push({ id: yeniId, ad: urunAdi, fiyat: urunFiyat, kategori: urunKategori });
        bildirimGoster('Ürün başarıyla eklendi!', 'success');
    }
    
    modalKapat();
    guncelUrunListesiGoster(secilenKategori, aramaTerimi);
}

function urunDuzenle(urunId) {
    const urun = veriler.urunler.find(u => u.id === urunId);
    if (!urun) {
        bildirimGoster('Ürün bulunamadı!', 'error');
        return;
    }
    document.getElementById('urunEkleModal').style.display = 'block';
    document.getElementById('modalOverlay').style.display = 'block';
    document.querySelector('#urunEkleModal .modal-header h2').textContent = 'Ürün Düzenle';
    document.getElementById('urunAdi').value = urun.ad;
    document.getElementById('urunKategori').value = urun.kategori;
    document.getElementById('urunFiyat').value = urun.fiyat;
    const form = document.getElementById('urunEkleForm');
    form.dataset.mode = 'edit';
    form.dataset.urunId = urunId;
}

function urunSil(urunId) {
    const urun = veriler.urunler.find(u => u.id === urunId);
    if (!urun) {
        bildirimGoster('Ürün bulunamadı!', 'error');
        return;
    }
    if (confirm(`"${urun.ad}" isimli ürünü silmek istediğinizden emin misiniz?`)) {
        veriler.urunler = veriler.urunler.filter(u => u.id !== urunId);
        bildirimGoster('Ürün başarıyla silindi!', 'success');
        guncelUrunListesiGoster(secilenKategori, aramaTerimi);
    }
}

/**
 * Ürün yönetimi başlatma
 */
function urunYonetimiBaslat() {
    const urunYonetimiDiv = document.getElementById('urun-yonetimi');
    const kontrolContainer = document.createElement('div');
    kontrolContainer.innerHTML = `
        <div class="urun-arama-container">
            <input type="text" id="urunAramaInput" class="urun-arama-input" placeholder="Ürün ara..." oninput="urunAra()">
            <div class="sayfa-basina-container">
                <span class="sayfa-basina-etiket">Sayfa başına:</span>
                <select id="sayfaBasinaSelect" class="sayfa-basina-select" onchange="sayfaBasinaUrunDegistir(this.value)">
                    <option value="6">6 ürün</option>
                    <option value="9">9 ürün</option>
                    <option value="12">12 ürün</option>
                    <option value="18">18 ürün</option>
                </select>
            </div>
        </div>
    `;
    const menuKategoriler = document.getElementById('menuKategoriler');
    if (menuKategoriler) {
        menuKategoriler.parentNode.insertBefore(kontrolContainer, menuKategoriler.nextSibling);
    }
    guncelUrunListesiGoster();
}
/* ---------------- Ödeme İşlemleri ---------------- */

function adisyonlariGoster() {
    const odemeMasaSec = document.getElementById('odemeMasaSec');
    odemeMasaSec.innerHTML = '<option value="">Masa seçiniz...</option>';
    veriler.masalar.forEach(masa => {
        if (masa.durum === 'dolu') {
            const option = document.createElement('option');
            option.value = masa.id;
            option.innerText = masa.ad;
            odemeMasaSec.appendChild(option);
        }
    });
}

function masaAdisyonGetir(masaId) {
    const adisyonDetay = document.getElementById('odemeAdisyonDetay');
    const araToplamSpan = document.getElementById('araToplam');
    const toplamTutarSpan = document.getElementById('toplamTutar');

    if (!masaId) {
        adisyonDetay.innerHTML = '';
        araToplamSpan.innerText = '0.00 ₺';
        toplamTutarSpan.innerText = '0.00 ₺';
        return;
    }

    const adisyon = veriler.adisyonlar[masaId] || [];
    adisyonDetay.innerHTML = '';
    let araToplam = 0;

    if (adisyon.length === 0) {
        adisyonDetay.innerHTML = '<p>Bu masada açık sipariş bulunmamaktadır.</p>';
    } else {
        adisyon.forEach(item => {
            const urunToplam = item.fiyat * item.adet;
            araToplam += urunToplam;
            const itemDiv = document.createElement('div');
            itemDiv.className = 'adisyon-item';
            itemDiv.innerHTML = `<span>${item.ad} (x${item.adet})</span> <span>${urunToplam.toFixed(2)} ₺</span>`;
            adisyonDetay.appendChild(itemDiv);
        });
    }

    araToplamSpan.innerText = `${araToplam.toFixed(2)} ₺`;
    toplamTutarSpan.innerText = `${araToplam.toFixed(2)} ₺`; // indirim/bahşiş şimdilik yok
}

function odemeYontemiSec(yontem) {
    document.querySelectorAll('.odeme-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.odeme-btn.${yontem}`).classList.add('active');
}

function odemeAl() {
    const seciliMasaId = document.getElementById('odemeMasaSec').value;
    if (!seciliMasaId) {
        bildirimGoster("Lütfen bir masa seçiniz.", "warning");
        return;
    }

    const adisyon = veriler.adisyonlar[seciliMasaId];
    if (!adisyon || adisyon.length === 0) {
        bildirimGoster("Bu masada ödenecek bir hesap bulunmamaktadır.", "warning");
        return;
    }

    const toplamTutarText = document.getElementById('toplamTutar').innerText;
    const toplamTutar = parseFloat(toplamTutarText.replace('₺', '').trim());

    delete veriler.adisyonlar[seciliMasaId];
    masaDurumGuncelle(parseInt(seciliMasaId), 'bos');

    document.getElementById('odemeMasaSec').value = '';
    masaAdisyonGetir('');
    adisyonlariGoster();

    bildirimGoster(`Masa ${seciliMasaId} için ${toplamTutar.toFixed(2)} ₺ ödeme alındı!`, 'success');
    showSection('masa-yonetimi');
}

/* ---------------- Modal ve Bildirim Fonksiyonları ---------------- */

function modalKapat() {
    document.querySelectorAll('.modal').forEach(modal => modal.style.display = 'none');
    document.getElementById('modalOverlay').style.display = 'none';
}

function bildirimGoster(mesaj, tip) {
    const bildirim = document.getElementById('bildirim');
    bildirim.innerText = mesaj;
    bildirim.className = `bildirim ${tip} show`;
    setTimeout(() => {
        bildirim.classList.remove('show');
    }, 3000);
}
// Fiş yazdırma modalını aç
function fisYazdirModalAc() {
    const seciliMasaId = document.getElementById('odemeMasaSec').value;

    if (!seciliMasaId) {
        bildirimGoster("Lütfen bir masa seçiniz.", "warning");
        return;
    }

    const adisyon = veriler.adisyonlar[seciliMasaId];
    if (!adisyon || adisyon.length === 0) {
        bildirimGoster("Bu masada yazdırılacak fiş yok.", "warning");
        return;
    }

    // Modal başlık
    document.getElementById("fisModalBaslik").innerText = `Masa ${seciliMasaId} Fişi`;

    // Fiş içeriği
    let icerik = `<h3>Adisyon</h3><hr>`;
    let toplam = 0;
    adisyon.forEach(item => {
        const urunToplam = item.fiyat * item.adet;
        toplam += urunToplam;
        icerik += `<p>${item.ad} x${item.adet} - ${urunToplam.toFixed(2)} ₺</p>`;
    });
    icerik += `<hr><strong>TOPLAM: ${toplam.toFixed(2)} ₺</strong>`;

    document.getElementById("fisModalIcerik").innerHTML = icerik;

    // Modalı aç
    document.getElementById("fisModal").style.display = "block";
    document.getElementById("modalOverlay").style.display = "block";
}

// Modal içinden yazdırma işlemi
function fisYazdir() {
    const icerik = document.getElementById("fisModalIcerik").innerHTML;

    const fisPencere = window.open('', '', 'width=400,height=600');
    fisPencere.document.write(`
        <html>
        <head><title>Fiş</title></head>
        <body>${icerik}</body>
        </html>
    `);
    fisPencere.document.close();
    fisPencere.print();
}
// Masa Ekle Modal Fonksiyonları

function masaEkleModalAc() {
    document.getElementById('masaEkleModal').style.display = 'block';
    document.getElementById('modalOverlay').style.display = 'block';
    document.getElementById('yeniMasaSayisi').focus();
}

function masaEkleIslemi(event) {
    event.preventDefault();
    const yeniMasaSayisi = parseInt(document.getElementById('yeniMasaSayisi').value);
    
    if (!yeniMasaSayisi || yeniMasaSayisi <= 0) {
        bildirimGoster('Lütfen geçerli bir masa sayısı girin!', 'warning');
        return;
    }
    
    // Mevcut en yüksek masa numarasını bul
    let sonMasaNo = veriler.masalar.length > 0 ? Math.max(...veriler.masalar.map(m => m.id)) : 0;
    
    // Yeni masaları ekle
    for (let i = 1; i <= yeniMasaSayisi; i++) {
        sonMasaNo++;
        masaEkle(`Masa ${sonMasaNo}`, 'bos');
    }
    
    modalKapat();
    bildirimGoster(`${yeniMasaSayisi} adet masa başarıyla eklendi!`, 'success');
    
    // Formu temizle
    document.getElementById('masaEkleForm').reset();
}

// Masa sayısını güncelleme fonksiyonu (ayarlar bölümü için)
function masaSayisiGuncelle() {
    const yeniSayi = parseInt(document.getElementById('masa-sayisi').value);
    const mevcutSayi = veriler.masalar.length;
    
    if (!yeniSayi || yeniSayi < 1) {
        bildirimGoster('Geçerli bir masa sayısı girin!', 'warning');
        return;
    }
    
    if (yeniSayi > mevcutSayi) {
        // Masa ekle
        const eklenecekSayi = yeniSayi - mevcutSayi;
        let sonMasaNo = mevcutSayi > 0 ? Math.max(...veriler.masalar.map(m => m.id)) : 0;
        
        for (let i = 1; i <= eklenecekSayi; i++) {
            sonMasaNo++;
            masaEkle(`Masa ${sonMasaNo}`, 'bos');
        }
        bildirimGoster(`${eklenecekSayi} adet masa eklendi. Toplam masa sayısı: ${yeniSayi}`, 'success');
        
    } else if (yeniSayi < mevcutSayi) {
        // Masa sil (sadece boş masaları)
        const silinecekSayi = mevcutSayi - yeniSayi;
        const bosMasalar = veriler.masalar.filter(m => m.durum === 'bos');
        
        if (bosMasalar.length < silinecekSayi) {
            bildirimGoster(`Sadece ${bosMasalar.length} adet boş masa var. Dolu masalar silinemez!`, 'warning');
            return;
        }
        
        // Boş masalardan son eklenenleri sil
        const silinecekMasalar = bosMasalar.slice(-silinecekSayi);
        
        silinecekMasalar.forEach(masa => {
            const masaIndex = veriler.masalar.findIndex(m => m.id === masa.id);
            if (masaIndex > -1) {
                veriler.masalar.splice(masaIndex, 1);
                const masaCard = document.querySelector(`.masa-card[data-id="${masa.id}"]`);
                if (masaCard) {
                    masaCard.remove();
                }
                delete veriler.adisyonlar[masa.id];
            }
        });
        
        bildirimGoster(`${silinecekSayi} adet boş masa silindi. Toplam masa sayısı: ${yeniSayi}`, 'success');
        guncelIstatistikleriGoster();
        
    } else {
        bildirimGoster('Masa sayısı zaten bu değerde!', 'info');
    }
}

// Sipariş Ekle/Ürün Seçim Fonksiyonları (Sadece JavaScript)

let secilenUrunlerListesi = [];

function urunSecimModalAc() {
    if (!seciliMasaId) {
        bildirimGoster('Lütfen önce bir masa seçin!', 'warning');
        return;
    }

    const modal = document.getElementById('urunSecModal');
    const modalBaslik = document.getElementById('urunSecBaslik');
    const masa = veriler.masalar.find(m => m.id === seciliMasaId);
    
    modalBaslik.innerText = `${masa.ad} - Ürün Seçimi`;
    secilenUrunlerListesi = [];
    
    // Ürün grid'ini doldur
    modalUrunleriGoster();
    
    // Seçilen ürünler listesini temizle
    guncelSecilenUrunlerListesi();
    
    modal.style.display = 'block';
    document.getElementById('modalOverlay').style.display = 'block';
}

function modalUrunleriGoster(kategori = 'hepsi') {
    const urunGrid = document.getElementById('urunSecimGrid');
    let filtrelenmisUrunler = veriler.urunler;
    
    if (kategori !== 'hepsi') {
        filtrelenmisUrunler = filtrelenmisUrunler.filter(u => u.kategori === kategori);
    }
    
    urunGrid.innerHTML = '';
    
    filtrelenmisUrunler.forEach(urun => {
        const urunDiv = document.createElement('div');
        urunDiv.className = 'urun-secim-item';
        urunDiv.innerHTML = `
            <div class="urun-secim-card">
                <h4>${urun.ad}</h4>
                <p class="urun-fiyat">${urun.fiyat.toFixed(2)} ₺</p>
                <p class="urun-kategori">${kategoriAdiGetir(urun.kategori)}</p>
                <div class="urun-secim-controls">
                    <button class="btn btn-sm btn-secondary" onclick="urunAdetAzalt(${urun.id})">-</button>
                    <span class="urun-adet" id="adet-${urun.id}">0</span>
                    <button class="btn btn-sm btn-secondary" onclick="urunAdetArtir(${urun.id})">+</button>
                </div>
            </div>
        `;
        urunGrid.appendChild(urunDiv);
    });
}

function modalKategoriFiltrele(kategori) {
    // Modal içindeki kategori butonlarını güncelle
    document.querySelectorAll('.modal-kategoriler .kategori-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const aktifBtn = document.querySelector(`.modal-kategoriler .kategori-btn[onclick="modalKategoriFiltrele('${kategori}')"]`);
    if (aktifBtn) {
        aktifBtn.classList.add('active');
    }
    
    // Ürünleri filtrele
    modalUrunleriGoster(kategori);
}

function urunAdetArtir(urunId) {
    const urun = veriler.urunler.find(u => u.id === urunId);
    if (!urun) return;
    
    const mevcutUrun = secilenUrunlerListesi.find(u => u.id === urunId);
    
    if (mevcutUrun) {
        mevcutUrun.adet++;
    } else {
        secilenUrunlerListesi.push({
            id: urun.id,
            ad: urun.ad,
            fiyat: urun.fiyat,
            adet: 1
        });
    }
    
    guncelUrunAdetGosterimi(urunId);
    guncelSecilenUrunlerListesi();
}

function urunAdetAzalt(urunId) {
    const mevcutUrun = secilenUrunlerListesi.find(u => u.id === urunId);
    
    if (mevcutUrun) {
        mevcutUrun.adet--;
        
        if (mevcutUrun.adet <= 0) {
            secilenUrunlerListesi = secilenUrunlerListesi.filter(u => u.id !== urunId);
        }
    }
    
    guncelUrunAdetGosterimi(urunId);
    guncelSecilenUrunlerListesi();
}

function guncelUrunAdetGosterimi(urunId) {
    const adetSpan = document.getElementById(`adet-${urunId}`);
    const mevcutUrun = secilenUrunlerListesi.find(u => u.id === urunId);
    
    if (adetSpan) {
        adetSpan.innerText = mevcutUrun ? mevcutUrun.adet : 0;
    }
}

function guncelSecilenUrunlerListesi() {
    const secilenDiv = document.getElementById('secilenUrunler');
    
    if (secilenUrunlerListesi.length === 0) {
        secilenDiv.innerHTML = '<p>Lütfen ürün seçiniz.</p>';
        return;
    }
    
    let toplam = 0;
    let html = '<div class="secilen-urunler-baslik"><h5>Seçilen Ürünler:</h5></div>';
    
    secilenUrunlerListesi.forEach(urun => {
        const urunToplam = urun.fiyat * urun.adet;
        toplam += urunToplam;
        
        html += `
            <div class="secilen-urun-item">
                <div class="secilen-urun-bilgi">
                    <span class="secilen-urun-ad">${urun.ad}</span>
                    <span class="secilen-urun-detay">x${urun.adet} - ${urunToplam.toFixed(2)} ₺</span>
                </div>
                <button class="btn btn-sm btn-danger" onclick="urunuListedenCikar(${urun.id})">×</button>
            </div>
        `;
    });
    
    html += `
        <div class="secilen-urunler-toplam">
            <strong>Toplam: ${toplam.toFixed(2)} ₺</strong>
        </div>
    `;
    
    secilenDiv.innerHTML = html;
}

function urunuListedenCikar(urunId) {
    secilenUrunlerListesi = secilenUrunlerListesi.filter(u => u.id !== urunId);
    guncelUrunAdetGosterimi(urunId);
    guncelSecilenUrunlerListesi();
}

function urunSecimiTamamla() {
    if (secilenUrunlerListesi.length === 0) {
        bildirimGoster('Lütfen en az bir ürün seçiniz!', 'warning');
        return;
    }
    
    if (!seciliMasaId) {
        bildirimGoster('Masa seçimi hatası!', 'error');
        return;
    }
    
    // Mevcut adisyona ekle veya yeni adisyon oluştur
    if (!veriler.adisyonlar[seciliMasaId]) {
        veriler.adisyonlar[seciliMasaId] = [];
    }
    
    secilenUrunlerListesi.forEach(seciliUrun => {
        const mevcutUrun = veriler.adisyonlar[seciliMasaId].find(u => u.id === seciliUrun.id);
        
        if (mevcutUrun) {
            mevcutUrun.adet += seciliUrun.adet;
        } else {
            veriler.adisyonlar[seciliMasaId].push({ ...seciliUrun });
        }
    });
    
    // Masa durumunu dolu yap
    masaDurumGuncelle(seciliMasaId, 'dolu');
    
    const toplam = secilenUrunlerListesi.reduce((sum, urun) => sum + (urun.fiyat * urun.adet), 0);
    const masa = veriler.masalar.find(m => m.id === seciliMasaId);
    
    bildirimGoster(`${masa.ad} için ${toplam.toFixed(2)} ₺ tutarında sipariş eklendi!`, 'success');
    
    // Modalı kapat ve değişkenleri temizle
    modalKapat();
    secilenUrunlerListesi = [];
    seciliMasaId = null;
}

document.getElementById("temaSec").addEventListener("change", function () {
    if (this.value === "koyu") {
        document.body.classList.add("koyu-tema");
        localStorage.setItem("tema", "koyu");   // 🌙 kaydet
    } else {
        document.body.classList.remove("koyu-tema");
        localStorage.setItem("tema", "acik");   // ☀️ kaydet
    }
});


function masaOlustur(toplamMasa) {
    const masaGrid = document.getElementById("masaGrid");
    masaGrid.innerHTML = ""; // önceki masaları temizle

    for (let i = 1; i <= toplamMasa; i++) {
        let masaCard = document.createElement("div");
        masaCard.classList.add("masa-card", "bos");
        masaCard.innerHTML = `
            <div class="masa-number">Masa ${i}</div>
            <div class="masa-durum durum-bos">Boş</div>
        `;
        masaGrid.appendChild(masaCard);
    }
}

function urunSecimiTamamla() {
    if (!seciliMasaId) {
        bildirimGoster('Masa seçimi hatası!', 'error');
        return;
    }

    if (secilenUrunlerListesi.length === 0) {
        // ürün yok -> masa boş kalır
        masaDurumGuncelle(seciliMasaId, 'bos');
        bildirimGoster("Sipariş girilmedi, masa boş bırakıldı.", "info");
    } else {
        // ürün varsa -> adisyona ekle
        if (!veriler.adisyonlar[seciliMasaId]) {
            veriler.adisyonlar[seciliMasaId] = [];
        }

        secilenUrunlerListesi.forEach(seciliUrun => {
            const mevcutUrun = veriler.adisyonlar[seciliMasaId].find(u => u.id === seciliUrun.id);
            if (mevcutUrun) {
                mevcutUrun.adet += seciliUrun.adet;
            } else {
                veriler.adisyonlar[seciliMasaId].push({ ...seciliUrun });
            }
        });

        masaDurumGuncelle(seciliMasaId, 'dolu');

        const toplam = secilenUrunlerListesi.reduce((sum, urun) => sum + (urun.fiyat * urun.adet), 0);
        const masa = veriler.masalar.find(m => m.id === seciliMasaId);

        bildirimGoster(`${masa.ad} için ${toplam.toFixed(2)} ₺ tutarında sipariş eklendi!`, 'success');
    }

    modalKapat();
    secilenUrunlerListesi = [];
    seciliMasaId = null;
}

// Masa Adı Değiştir Modalını aç
function masaAdDegistirModalAc() {
    const select = document.getElementById("masaSecim");
    select.innerHTML = '<option value="">Masa seçiniz...</option>';

    veriler.masalar.forEach(masa => {
        const option = document.createElement("option");
        option.value = masa.id;
        option.textContent = masa.ad;
        select.appendChild(option);
    });

    document.getElementById("masaAdDegistirModal").style.display = "block";
    document.getElementById("modalOverlay").style.display = "block";
}

// Masa adını değiştirme işlemi
function masaAdDegistir(event) {
    event.preventDefault();
    const masaId = parseInt(document.getElementById("masaSecim").value);
    const yeniAd = document.getElementById("yeniMasaAdi").value.trim();

    if (!masaId || !yeniAd) {
        bildirimGoster("Lütfen masa ve yeni adı giriniz!", "warning");
        return;
    }

    const masa = veriler.masalar.find(m => m.id === masaId);
    if (masa) {
        masa.ad = yeniAd;

        // UI güncelle
        const masaCard = document.querySelector(`.masa-card[data-id="${masaId}"]`);
        if (masaCard) {
            masaCard.querySelector(".masa-number").innerText = yeniAd.replace("Masa ", "");
        }

        bildirimGoster("Masa adı güncellendi!", "success");
    }

    modalKapat();
    document.getElementById("masaAdDegistirForm").reset();
}

// Rapor fonksiyonları - anasayfa.js dosyasına eklenecek

// Global rapor verileri
const raporVerileri = {
    gunlukSatislar: [], // { tarih, tutar, siparissayisi }
    urunSatislari: {}   // { urunId: satirSayisi }
};

/**
 * Rapor gösterimi ana fonksiyonu
 */
function raporGoster(raporTuru) {
    const raporOzeti = hesaplaRaporOzeti();
    guncelRaporOzetiniGoster(raporOzeti);
    
    switch (raporTuru) {
        case 'gunluk':
            gunlukRaporGoster();
            break;
        case 'haftalik':
            haftalikRaporGoster();
            break;
        case 'aylik':
            aylikRaporGoster();
            break;
        case 'urun':
            urunSatisRaporuGoster();
            break;
        default:
            gunlukRaporGoster();
    }
}

/**
 * Rapor özetini hesapla
 */
function hesaplaRaporOzeti() {
    const bugun = new Date().toDateString();
    let bugunSatis = 0;
    let siparissayisi = 0;
    let toplamSiparis = 0;
    
    // Tüm adisyonlardan bugünkü satışları hesapla
    Object.values(veriler.adisyonlar).forEach(adisyon => {
        if (adisyon && adisyon.length > 0) {
            const adisyonToplam = adisyon.reduce((sum, item) => sum + (item.fiyat * item.adet), 0);
            bugunSatis += adisyonToplam;
            siparissayisi++;
            toplamSiparis += adisyon.reduce((sum, item) => sum + item.adet, 0);
        }
    });
    
    // Masa doluluk oranı
    const toplamMasa = veriler.masalar.length;
    const doluMasa = veriler.masalar.filter(m => m.durum === 'dolu').length;
    const dolulukOrani = toplamMasa > 0 ? Math.round((doluMasa / toplamMasa) * 100) : 0;
    
    // Ortalama hesap
    const ortalamaHesap = siparissayisi > 0 ? bugunSatis / siparissayisi : 0;
    
    return {
        bugunSatis,
        siparissayisi,
        ortalamaHesap,
        dolulukOrani,
        toplamSiparis
    };
}

/**
 * Rapor özetini UI'da göster
 */
function guncelRaporOzetiniGoster(ozet) {
    document.getElementById('bugunSatis').innerText = `${ozet.bugunSatis.toFixed(2)} ₺`;
    document.getElementById('siparissayisi').innerText = ozet.siparissayisi;
    document.getElementById('ortalamaHesap').innerText = `${ozet.ortalamaHesap.toFixed(2)} ₺`;
    document.getElementById('masaDoluluk').innerText = `%${ozet.dolulukOrani}`;
}

/**
 * Günlük rapor göster
 */
function gunlukRaporGoster() {
    const grafikContainer = document.querySelector('.grafik-container');
    const ozet = hesaplaRaporOzeti();
    
    grafikContainer.innerHTML = `
        <div class="grafik-baslik">
            <h3>📈 Günlük Performans</h3>
        </div>
        <div class="grafik-icerik">
            <div class="performans-kartlari">
                <div class="performans-kart">
                    <div class="performans-ikon">💰</div>
                    <div class="performans-bilgi">
                        <h4>Bugünkü Gelir</h4>
                        <span class="performans-deger">${ozet.bugunSatis.toFixed(2)} ₺</span>
                    </div>
                </div>
                <div class="performans-kart">
                    <div class="performans-ikon">📦</div>
                    <div class="performans-bilgi">
                        <h4>Toplam Sipariş</h4>
                        <span class="performans-deger">${ozet.siparissayisi}</span>
                    </div>
                </div>
                <div class="performans-kart">
                    <div class="performans-ikon">🏢</div>
                    <div class="performans-bilgi">
                        <h4>Masa Doluluk</h4>
                        <span class="performans-deger">%${ozet.dolulukOrani}</span>
                    </div>
                </div>
                <div class="performans-kart">
                    <div class="performans-ikon">📊</div>
                    <div class="performans-bilgi">
                        <h4>Ortalama Hesap</h4>
                        <span class="performans-deger">${ozet.ortalamaHesap.toFixed(2)} ₺</span>
                    </div>
                </div>
            </div>
            <div class="zaman-bilgisi">
                <p>Son güncelleme: ${new Date().toLocaleString('tr-TR')}</p>
            </div>
        </div>
    `;
}

/**
 * Haftalık rapor göster
 */
function haftalikRaporGoster() {
    const grafikContainer = document.querySelector('.grafik-container');
    const ozet = hesaplaRaporOzeti();
    
    // Simüle edilmiş haftalık veri (gerçek uygulamada veritabanından gelir)
    const haftalikTahminiGelir = ozet.bugunSatis * 7;
    const haftalikTahminiSiparis = ozet.siparissayisi * 7;
    
    grafikContainer.innerHTML = `
        <div class="grafik-baslik">
            <h3>📅 Haftalık Trend</h3>
        </div>
        <div class="grafik-icerik">
            <div class="trend-bilgileri">
                <div class="trend-kart">
                    <h4>Tahmini Haftalık Gelir</h4>
                    <span class="trend-deger">${haftalikTahminiGelir.toFixed(2)} ₺</span>
                    <small>Günlük ortalamaya göre</small>
                </div>
                <div class="trend-kart">
                    <h4>Tahmini Haftalık Sipariş</h4>
                    <span class="trend-deger">${haftalikTahminiSiparis}</span>
                    <small>Günlük ortalamaya göre</small>
                </div>
            </div>
            <div class="hafta-grafik">
                <p><em>Not: Gerçek haftalık veriler için daha fazla satış kaydı gereklidir.</em></p>
            </div>
        </div>
    `;
}

/**
 * Aylık rapor göster
 */
function aylikRaporGoster() {
    const grafikContainer = document.querySelector('.grafik-container');
    const ozet = hesaplaRaporOzeti();
    
    // Simüle edilmiş aylık veri
    const aylikTahminiGelir = ozet.bugunSatis * 30;
    const aylikTahminiSiparis = ozet.siparissayisi * 30;
    
    grafikContainer.innerHTML = `
        <div class="grafik-baslik">
            <h3>📆 Aylık Projeksiyon</h3>
        </div>
        <div class="grafik-icerik">
            <div class="aylik-ozet">
                <div class="aylik-kart ana-kart">
                    <h4>Aylık Gelir Projeksiyonu</h4>
                    <span class="aylik-deger">${aylikTahminiGelir.toFixed(2)} ₺</span>
                </div>
                <div class="aylik-detaylar">
                    <div class="detay-item">
                        <span class="detay-etiket">Günlük Ortalama:</span>
                        <span class="detay-deger">${ozet.bugunSatis.toFixed(2)} ₺</span>
                    </div>
                    <div class="detay-item">
                        <span class="detay-etiket">Tahmini Aylık Sipariş:</span>
                        <span class="detay-deger">${aylikTahminiSiparis}</span>
                    </div>
                    <div class="detay-item">
                        <span class="detay-etiket">Ortalama Masa Doluluk:</span>
                        <span class="detay-deger">%${ozet.dolulukOrani}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * En çok satan ürünleri hesapla ve göster
 */
function enCokSatanUrunleriHesapla() {
    const urunSatislari = {};
    
    // Tüm adisyonlardaki ürünleri say
    Object.values(veriler.adisyonlar).forEach(adisyon => {
        if (adisyon && adisyon.length > 0) {
            adisyon.forEach(item => {
                if (!urunSatislari[item.id]) {
                    urunSatislari[item.id] = {
                        ad: item.ad,
                        fiyat: item.fiyat,
                        toplamSatis: 0,
                        satirSayisi: 0
                    };
                }
                urunSatislari[item.id].toplamSatis += (item.fiyat * item.adet);
                urunSatislari[item.id].satirSayisi += item.adet;
            });
        }
    });
    
    // Satış miktarına göre sırala
    return Object.values(urunSatislari)
        .sort((a, b) => b.satirSayisi - a.satirSayisi)
        .slice(0, 5); // En çok satan 5 ürün
}

/**
 * En çok satan ürünleri göster
 */
function enCokSatanUrunleriGoster() {
    const enCokSatanListe = document.getElementById('enCokSatanListe');
    const enCokSatanUrunler = enCokSatanUrunleriHesapla();
    
    if (enCokSatanUrunler.length === 0) {
        enCokSatanListe.innerHTML = `
            <div class="en-cok-satan-bos">
                <p>Henüz satış verisi bulunmamaktadır.</p>
                <small>Siparişler alındıkça bu bölüm güncellenecektir.</small>
            </div>
        `;
        return;
    }
    
    enCokSatanListe.innerHTML = '';
    
    enCokSatanUrunler.forEach((urun, index) => {
        const urunDiv = document.createElement('div');
        urunDiv.className = 'en-cok-satan-item';
        urunDiv.innerHTML = `
            <div class="sira-badge">${index + 1}</div>
            <div class="urun-bilgileri">
                <h4 class="urun-adi">${urun.ad}</h4>
                <div class="urun-istatistikleri">
                    <span class="satilan-adet">${urun.satirSayisi} adet satıldı</span>
                    <span class="toplam-gelir">${urun.toplamSatis.toFixed(2)} ₺ gelir</span>
                </div>
            </div>
        `;
        enCokSatanListe.appendChild(urunDiv);
    });
}

/**
 * Ürün satış raporu göster
 */
function urunSatisRaporuGoster() {
    const grafikContainer = document.querySelector('.grafik-container');
    const enCokSatanUrunler = enCokSatanUrunleriHesapla();
    
    grafikContainer.innerHTML = `
        <div class="grafik-baslik">
            <h3>🍽️ Ürün Satış Analizi</h3>
        </div>
        <div class="grafik-icerik">
            <div class="urun-analiz-container">
                ${enCokSatanUrunler.length > 0 ? `
                    <div class="urun-performans-listesi">
                        ${enCokSatanUrunler.map((urun, index) => `
                            <div class="urun-performans-item">
                                <div class="performans-sira">#${index + 1}</div>
                                <div class="performans-urun-bilgi">
                                    <h5>${urun.ad}</h5>
                                    <div class="performans-metrikleri">
                                        <span class="metrik">
                                            <strong>${urun.satirSayisi}</strong> adet
                                        </span>
                                        <span class="metrik">
                                            <strong>${urun.toplamSatis.toFixed(2)} ₺</strong> gelir
                                        </span>
                                        <span class="metrik">
                                            <strong>${urun.fiyat.toFixed(2)} ₺</strong> birim fiyat
                                        </span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <div class="urun-analiz-bos">
                        <p>Henüz ürün satış verisi bulunmamaktadır.</p>
                        <small>Siparişler alındıkça bu rapor güncellenecektir.</small>
                    </div>
                `}
            </div>
        </div>
    `;
    
    // En çok satan ürünleri ayrıca göster
    enCokSatanUrunleriGoster();
}

/**
 * Rapor indirme fonksiyonu
 */
function raporIndir() {
    const raporTuru = document.getElementById('raporTuru').value;
    const ozet = hesaplaRaporOzeti();
    const enCokSatan = enCokSatanUrunleriHesapla();
    
    let raporIcerigi = `
RESTORAN YÖNETİM SİSTEMİ - ${raporTuru.toUpperCase()} RAPOR
Tarih: ${new Date().toLocaleDateString('tr-TR')}
Saat: ${new Date().toLocaleTimeString('tr-TR')}
================================================

GENEL ÖZET:
- Bugünkü Satış: ${ozet.bugunSatis.toFixed(2)} ₺
- Sipariş Sayısı: ${ozet.siparissayisi}
- Ortalama Hesap: ${ozet.ortalamaHesap.toFixed(2)} ₺
- Masa Doluluk Oranı: %${ozet.dolulukOrani}

EN ÇOK SATAN ÜRÜNLER:
${enCokSatan.length > 0 ? 
    enCokSatan.map((urun, index) => 
        `${index + 1}. ${urun.ad} - ${urun.satirSayisi} adet - ${urun.toplamSatis.toFixed(2)} ₺`
    ).join('\n') 
    : 'Henüz satış verisi bulunmamaktadır.'}

MASA DURUMLARI:
${veriler.masalar.map(masa => `${masa.ad}: ${masa.durum.toUpperCase()}`).join('\n')}

================================================
Bu rapor otomatik olarak oluşturulmuştur.
    `;
    
    // Dosya olarak indir
    const blob = new Blob([raporIcerigi], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${raporTuru}-rapor-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    bildirimGoster(`${raporTuru} raporu indirildi!`, 'success');
}

// Sayfa yüklendiğinde raporları başlat
document.addEventListener('DOMContentLoaded', function() {
    // Raporlar sekmesine tıklandığında verileri güncelle
    const raporlarTab = document.querySelector('[onclick="showSection(\'raporlar\')"]');
    if (raporlarTab) {
        raporlarTab.addEventListener('click', function() {
            setTimeout(() => {
                raporGoster('gunluk');
                enCokSatanUrunleriGoster();
            }, 100);
        });
    }
});

// CSS'i sayfaya ekle
if (!document.getElementById('raporCSS')) {
    const style = document.createElement('style');
    style.id = 'raporCSS';
    style.textContent = raporCSS;
    document.head.appendChild(style);
}

