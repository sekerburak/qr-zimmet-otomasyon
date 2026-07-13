# QR Kodlu Stok / Demirbaş Zimmet Otomasyonu
## Staj Projesi Ajandası ve Görev Takip Dosyası

Bu belge, projenin yol haritasına (Word dosyası) dayanılarak oluşturulmuştur. Ekip içi görev dağılımını, fazlara göre yapılacakları ve toplantı notlarını takip etmek için **bağımsız bir ajanda** olarak kullanılabilir. (Mevcut `README.md` dosyasına dokunulmamıştır, projenin sonunda yer alan Taslak README içeriğini daha sonra ana README'ye kopyalayabilirsiniz).

---

## 👥 Ekip ve Detaylı İş Bölümü

Word belgesindeki 20. madde (Görev Dağılımı) referans alınarak, rollerin alt görevleri daha detaylı hale getirilmiştir:

### 1. Yusuf Barut (Sistem Mimarisi, QR, Zimmet & Dashboard)
*Ana Odak: Sistem mimarisi, QR tarama, Dashboard ve Zimmet iş akışlarının Full-Stack yönetimi.*
- [ ] **Sistem Mimarisi:** Katmanlı mimarinin (Controller, Service, Repository vb.) projeye kurulması.
- [ ] **Dashboard:** Sistemin ana özet ekranının (React) geliştirilmesi ve API'ye bağlanması.
- [ ] **QR Tarama & Altyapı:** Hem QR kod üretiminin (Backend) hem de `html5-qrcode` ile tarama arayüzünün (Frontend) yapılması.
- [ ] **Zimmet İşlemleri:** Zimmet verme/iade API'leri (Backend) ve arayüzdeki akışların (Frontend) tamamlanması.
- [ ] **API Entegrasyonları:** Geliştirilen uç noktaların (endpoints) Frontend ile genel entegrasyonu.

### 2. Muhammet Burak Şeker (Core Backend & Veritabanı)
*Ana Odak: Veritabanı, kimlik doğrulama ve temel CRUD API işlemleri.*
- [ ] **Veritabanı & ORM:** PostgreSQL tablolarının tasarımı ve Prisma ORM entegrasyonu (migration'lar).
- [ ] **Kimlik Doğrulama & Güvenlik:** JWT altyapısı, bcrypt şifreleme ve Rol Bazlı Erişim Kontrolü (RBAC) middleware'leri.
- [ ] **Demirbaş ve Kategori API:** Demirbaş listeleme, ekleme, güncelleme, silme (CRUD) işlemlerinin Backend tarafında yazılması.
- [ ] **Audit Logging:** Sistem içi kritik işlemlerin loglanması.

### 3. Metehan Aluçlu (Frontend Lideri, Component Kütüphanesi, Auth & Test)
*Ana Odak: Yusuf'un almadığı tüm arayüzlerin yapılması, UI sisteminin kurulması ve projenin test edilmesi.*
- [ ] **Tasarım Sistemi (Design System):** Projede kullanılacak tüm ortak UI bileşenlerinin (Özel Tablolar, Modallar, Butonlar, Form elementleri) Tailwind ile sıfırdan yazılması.
- [ ] **Demirbaş ve Kategori Yönetimi (UI):** Envanterin listelendiği, filtrelendiği ve yeni stok eklendiği karmaşık ekranların geliştirilmesi.
- [ ] **Auth Flow & Kullanıcı Yönetimi:** Login/Register ekranları, Admin paneli (kullanıcı/rol yönetimi) ve Frontend yetki kalkanlarının (Protected Routes) yazılması.
- [ ] **State Management:** Redux Toolkit veya Zustand ile global state'in (kullanıcı bilgileri, sepet/seçili demirbaşlar) yönetilmesi.
- [ ] **Raporlama Ekranları:** PDF/Excel çıktı alınabilecek detaylı raporlama sayfalarının tasarlanması.
- [ ] **Test ve Dokümantasyon:** Tüm projenin (Yusuf'un yazdıkları dahil) Cypress ile E2E testlerinin yapılması, Jest ile unit testlerin yazılması.

---

## 📅 Fazlara Göre Yapılacaklar (To-Do List)

Aşağıdaki kutucukları `[x]` şeklinde işaretleyerek görevleri takip edebilirsiniz:

### Faz 1 & 2: Analiz ve Altyapı
- [ ] Proje klasör yapısının (backend/frontend) oluşturulması.
- [ ] Backend: Express.js, Prisma kurulumu.
- [ ] Frontend: Vite/React projesinin başlatılması, TailwindCSS ayarları.
- [ ] Veritabanının local'de ayağa kaldırılması.

### Faz 3: Kullanıcı Sistemi ve Güvenlik
- [ ] User ve Role tablolarının oluşturulması, Register/Login API'leri (Muhammet).
- [ ] JWT ve yetkilendirme (RBAC) middleware'lerinin yazılması (Muhammet).
- [ ] Frontend'de Login ekranı, global auth state'i ve Admin yetki kalkanlarının yazılması (Metehan).
- [ ] Genel Dashboard arayüzünün ve grafiklerin API bağlantılarıyla kurulması (Yusuf).

### Faz 4: Demirbaş Modülü
- [ ] Asset ve Category tablolarının Prisma ile oluşturulması, CRUD API'leri (Muhammet).
- [ ] AuditLog mekanizmasının Backend'e kurulması (Muhammet).
- [ ] Frontend'de Component Kütüphanesinin (Buton, Tablo, Input) inşa edilmesi (Metehan).
- [ ] Demirbaş/Stok ekleme ve kategori yönetimi UI ekranlarının yapılması (Metehan).
- [ ] Raporlama (PDF/Excel dışa aktarma) sayfalarının arayüzü ve veriye bağlanması (Metehan).

### Faz 5: QR Sistemi
- [ ] Backend'de UUID oluşturup QR kod üreten servislerin yazılması (Yusuf).
- [ ] Kamera üzerinden QR kod okuma (Scanner) arayüzünün geliştirilmesi ve entegrasyonu (Yusuf).

### Faz 6: Zimmet Sistemi
- [ ] Assignments tablosu, Zimmet verme/iade API'lerinin yazılması (Yusuf).
- [ ] Frontend'de QR kod okutulduğunda çıkan zimmet atama/iade modal ve akışlarının yazılması (Yusuf).
- [ ] Tüm sistemin Cypress ile E2E testlerinin ve Jest ile unit testlerinin yapılması (Metehan).

---

## 📝 Toplantı ve Karar Notları

*Tarih:* ... / ... / 2026
- **Alınan Kararlar:**
  - 
  - 
- **Blocker Durumlar:**
  - 

---

## 📦 Taslak README.md İçeriği
*(Mevcut README dosyanıza dokunulmadı. Proje bitimine doğru veya istediğiniz zaman aşağıdaki içeriği ana README.md'ye kopyalayabilirsiniz.)*

```markdown
# QR Kodlu Stok ve Demirbaş Zimmet Otomasyonu

Bu proje, kurum bünyesindeki demirbaş ve stok varlıklarının dijital ortamda kayıt altına alınmasını, QR kod teknolojisi ile hızlı ve hatasız biçimde takip edilmesini sağlayan web tabanlı bir otomasyon sistemidir.

## 🚀 Teknolojiler
- **Frontend:** React.js, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Veritabanı & ORM:** PostgreSQL, Prisma ORM
- **Güvenlik:** JWT Tabanlı Kimlik Doğrulama, Role-Based Access Control (RBAC), bcrypt
- **QR Entegrasyonu:** qrcode (Üretim), html5-qrcode (Tarama)

## 👥 Geliştirici Ekip
- **Yusuf Barut:** Sistem Mimarisi, QR Entegrasyonu, Dashboard & Zimmet İşlemleri
- **Muhammet Burak Şeker:** Core Backend (API, ORM, Auth & Security)
- **Metehan Aluçlu:** Frontend Component Kütüphanesi, Auth UI, Raporlama & Test Lideri

## 🛠️ Kurulum (Local Development)

### Gereksinimler
- Node.js (v18+)
- PostgreSQL (v14+)
- Git

### Backend Kurulumu
1. `cd backend`
2. `npm install`
3. `.env` dosyasını oluşturun ve `DATABASE_URL` ile `JWT_SECRET` değerlerini girin.
4. `npx prisma migrate dev`
5. `npm run dev`

### Frontend Kurulumu
1. `cd frontend`
2. `npm install`
3. `.env` dosyasını oluşturun ve `VITE_API_URL=http://localhost:5000/api` değerini girin.
4. `npm run dev`
```
