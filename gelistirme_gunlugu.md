# Proje Geliştirme Günlüğü (Walkthrough & Changelog)

Bu belge, Frontend lideri (Metehan) ve ekibin proje boyunca adım adım ne geliştirdiğini kayıt altına almak için oluşturulmuştur.

## [13 Temmuz 2026] - Başlangıç ve Temel Kurulum
- **Proje Analizi:** Word yol haritası incelendi, görev dağılımları netleştirilip `agenda.md` oluşturuldu.
- **Frontend İskeleti:** `vite`, `react`, `typescript`, `tailwindcss` kurulumları yapıldı.
- **Tasarım:** Modern ve şık (Glassmorphism/Gradients) tarzda bir Dashboard (App.tsx) geliştirildi.

## [13 Temmuz 2026] - Sayfa Yönlendirmeleri (Routing)
- **Router Kurulumu:** `react-router-dom` projeye dahil edildi.
- **Klasör Yapısı:** `src/pages`, `src/components`, `src/layouts` klasörleri oluşturuldu.
- **Layout (Düzen):** Sidebar ve Header bileşenleri `MainLayout.tsx` içine alındı, diğer sayfalar `<Outlet />` ile bağlandı.
- **Sayfalar:** `Dashboard`, `Login`, `QrScanner` (yer tutucu) ve `Assignments` (yer tutucu) sayfaları yaratıldı ve `App.tsx` üzerinden rotalandı.

## [13 Temmuz 2026] - Local Auth & Login Profesyonelleşmesi
- **State Yönetimi:** Global durum yönetimi için `zustand` kuruldu.
- **Mock Auth (Yerel DB/Browser Hesabı):** Tarayıcının `localStorage` mekanizması kullanılarak geçici (mock) bir kimlik doğrulama akışı kuruldu.
- **Login Ekranı Geliştirme:** Login sayfası state'lere bağlandı, form doğrulamaları eklendi, hata mesajları ve yükleniyor animasyonları tasarıma yedirildi.
- **Protected Routes (Korumalı Yollar):** Giriş yapmamış kullanıcıların Dashboard'a erişimi engellenip zorunlu olarak Login sayfasına yönlendirilmesi sağlandı. Çıkış yap (LogOut) butonu aktifleştirildi.

## [13 Temmuz 2026] - Veri Modellenmesi (Mock Data) & Excel Çıktısı
- **Mock Veritabanı:** `src/data/mockData.ts` oluşturuldu. Ekip üyeleri (Metehan, Yusuf, Muhammet vd.) ve geniş bir demirbaş katalogu (Bilgisayarlar, Monitörler, Aksesuarlar, Mobilyalar) sahte veri olarak tanımlandı.
- **Login Güncellemesi:** Login ekranı artık bu mockUsers listesindeki herhangi bir mail adresiyle (şifre: 123456) giriş yapabilir hale getirildi.
- **Dashboard Entegrasyonu:** Dashboard'daki sayılar (Toplam Demirbaş, Doluluk oranı) statik verilerden kurtarılıp doğrudan `mockData.ts`'deki demirbaş dizisinden hesaplanacak şekilde kodlandı.
- **Excel Raporlaması:** `exceljs` kütüphanesi kurularak bir Node betiği (`generate_excel.js`) yazıldı. Katalogdaki tüm veriler; renkli, tablolu, genişlikleri ayarlanmış estetik bir `.xlsx` (Demirbas_Katalogu.xlsx) dosyasına dönüştürülüp kök dizine kaydedildi.

## [13 Temmuz 2026] - Büyük Veri Seti & Yönetim Ekranları
- **Veri Ölçeklendirme:** `generate_mock_data.js` scripti yazıldı. Farklı departmanlardan **100 kullanıcı** ve 12 kategoride (Dizüstü, Masaüstü, Monitör, Yazıcı, Telefon, Tablet, Ağ Donanımı, Klavye, Mouse, Kulaklık, Projeksiyon, Ofis Mobilyası) toplamda **1000 demirbaş** kaydı üretildi.
- **Kullanıcı Yönetimi Ekranı (`UsersPage.tsx`):** 100 kullanıcıyı gösteren, isim/e-posta ile arama, rol (Admin/Personel/Depo/Zimmet Sorumlusu) ve departman bazlı filtreleme, sayfalama (pagination) destekli profesyonel tablo sayfası oluşturuldu.
- **Demirbaş Yönetimi Ekranı (`InventoryPage.tsx`):** 1000 ürünlük katalogu gösteren, ürün adı/kod/seri no/marka ile arama, kategori ve durum (Zimmetli/Depoda/Bakımda/Hurda) filtreleme, durum özet kartları ve sayfalama destekli profesyonel envanter sayfası oluşturuldu.
- **Sidebar Güncellendi:** Sol menüye "Demirbaş Yönetimi" linki eklendi. Kullanıcı bilgileri (isim, e-posta) sidebar alt kısmında gösterilmeye başlandı.
- **Dashboard Güncellendi:** Kategori dağılım grafiği (yatay bar) ve son zimmet listesi eklendi. İstatistikler gerçek veriden hesaplanıyor.
- **Excel Güncellendi:** 3 sayfalı (Demirbaş Kataloğu, Kullanıcılar, Özet) rapor haline getirildi. Zebra striping, AutoFilter ve durum renklendirmesi eklendi.
