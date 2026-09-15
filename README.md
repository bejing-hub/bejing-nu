# Bêjing Medya - Web Portalı (bejingmedya.com)

Bu proje, **Bêjing Medya** (Genç Kadınların Sesi / Dengê Jinên Ciwan) için Antigravity tarafından sıfırdan geliştirilmiş, yüksek performanslı ve lüks editoryal tasarıma sahip modern bir medya ve video portalıdır.

---

## 🌟 Özellikler ve Tasarım İlkeleri

1. **Görsel Kimlik ve Logo Uyumu:**
   - Resmi logodan çıkartılan renk paleti: **Derin Maun / Terracotta** (`#5C2C16`), **Kraliyet Altını** (`#C59B3F`, `#D4AF37`), **Sıcak Keten** (`#FAF8F5`) ve **Espresso Koyu** (`#231C18`).
   - Tipografi: Başlıklarda ve logoda klasik ve zarif **Playfair Display & Cinzel**, gövde metinlerinde ise Kürtçe ve Türkçe karakterleri kusursuz destekleyen **Plus Jakarta Sans**.

2. **Kürtçe ve Türkçe Çift Dil Desteği (Kurmancî & Türkçe):**
   - Sayfa yenilenmesine gerek kalmadan tek tıkla tüm arayüz, menüler, sloganlar ve içerikler anında iki dil arasında geçiş yapar.
   - Tercih `localStorage` üzerinde saklanır.

3. **Gelişmiş Medya & Video Altyapısı (Bêjing TV):**
   - Sinematik koyu temalı video vitrini.
   - Iframe tabanlı açılır video oynatıcı modalı (YouTube, vb.).

4. **Kategori ve Menü Bütünlüğü:**
   - `Genç Kadın Bakışıyla / Bi Nêrîna Jinên Ciwan`
   - `Ma'nın İzindekiler / Şopdarên Ma`
   - `Örgülerin Kalemi / Pênusa Keziyan`
   - `Kadın ve Kültür / Jin û Çand`
   - `Atölye / Atolye`
   - `Kadın Külliyatı / Kûlliyata Jin`
   - `Videolar / Vîdeo`
   - `İletişim / Têkilî`

---

## 📂 Dosya Yapısı

```
bejingmedya/
├── index.html            # Ana portal sayfası (Manşet, Video Vitrini, Makaleler, Sidebar)
├── article.html          # Tekil makale okuma şablonu (Sosyal paylaşım ve font ayarı)
├── videos.html           # Video arşiv sayfası
├── contact.html          # İletişim formu ve sosyal medya detayları
├── about.html            # Hakkımızda ve yayın ilkeleri
│
├── assets/
│   ├── css/
│   │   └── style.css     # Tüm görsel tasarım, animasyonlar ve responsive kurallar
│   ├── js/
│   │   ├── data.js       # Örnek makale ve video veri tabanı
│   │   ├── i18n.js       # Türkçe ve Kürtçe dil motoru
│   │   └── main.js       # Dinamik kartlar, arama, kaydırma ve video modalları
│   └── images/
│       └── logo.jpg      # Orijinal Bêjing Medya logosu
└── README.md
```

---

## 🚀 Çalıştırma

Herhangi bir kurulum veya sunucu gerektirmez. `index.html` dosyasına çift tıklayarak tarayıcınızda doğrudan çalıştırabilirsiniz.
