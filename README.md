# 🚖 AYIK ŞOFÖR - Premium Şoför Hizmeti (v2)

**AYIK ŞOFÖR**, kullanıcıların tek dokunuşla özel şoför çağırabildiği, modern ve premium tasarıma sahip bir mobil uygulamadır. Alkol aldığınızda veya yorgun olduğunuzda aracınızı güvenle evinize ulaştırmak için profesyonel şoför hizmeti sunar.

## 🌟 Özellikler

### Temel Özellikler
*   **Premium Arayüz:** Siyah ve Altın sarısı (Gold) tonlarında, göz yormayan modern tasarım
*   **Kolay Çağrı:** Tek tuşla WhatsApp üzerinden konum paylaşarak şoför çağırma
*   **Animasyonlu Geçişler:** `react-native-reanimated` ile akıcı sayfa geçişleri ve buton efektleri
*   **Anlık Konum:** Hassas konum tespiti ile sizi olduğunuz yerden alma
*   **Şeffaf Fiyatlandırma:** Uygulama içinde güncel fiyat listesi (Açılış, KM başı, Bekleme, VIP)
*   **Gizlilik Odaklı:** Kişisel verileriniz sunucuda saklanmaz, sadece talep anında iletilir

### v2 Yenilikleri
*   **🫨 Haptic Feedback:** BAŞLAT ve arama butonlarında titreşim geri bildirimi
*   **✨ Gelişmiş Splash Screen:** Native → Custom splash pürüzsüz geçişi (beyaz flaş yok)
*   **🔒 Çift Tıklama Koruması:** Tüm butonlarda rate limiting ile çift talep engelleme
*   **📐 Merkezi Metin Yönetimi:** Tüm uygulama metinleri tek noktadan yönetiliyor
*   **🎬 Animasyonlu Onboarding:** Pulsing, rotating, glow ve particle efektleri ile premium deneyim
*   **🧮 Otomatik Fiyat Hesaplama:** KM girişiyle anlık fiyat hesaplayıcı (Haversine mesafe desteği)

## 🛠️ Teknolojiler

| Teknoloji | Versiyon |
|---|---|
| React Native | 0.81.5 |
| Expo SDK | 54 |
| React Native Reanimated | 4.1 |
| Expo Location | 19.0 |
| Expo Haptics | Son sürüm |
| Expo Splash Screen | 31.0 |
| AsyncStorage | 2.2 |

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
*   Node.js (LTS sürümü önerilir)
*   Expo Go uygulaması (Telefonunuzda yüklü olmalı)

### Adımlar

1.  **Repoyu Klonlayın:**
    ```bash
    git clone https://github.com/mediaconfig55-afk/Ayik-S-f-r-v2.git
    cd Ayik-S-f-r-v2
    ```

2.  **Bağımlılıkları Yükleyin:**
    ```bash
    npm install
    ```

3.  **Uygulamayı Başlatın:**
    ```bash
    npx expo start
    ```

4.  **Test Edin:**
    *   Açılan QR kodu telefonunuzdaki **Expo Go** uygulaması ile taratın
    *   Web önizleme için: `npx expo start --web`

### EAS ile APK Oluşturma
```bash
npx eas-cli build --platform android --profile preview
```

## 📂 Proje Yapısı

```
├── App.js                      # Ana uygulama + Splash Screen geçişi
├── src/
│   ├── constants/
│   │   └── theme.js            # Renkler, fontlar, fiyatlar, sabitler
│   ├── screens/
│   │   ├── SplashScreen.js     # Animasyonlu açılış ekranı
│   │   ├── OnboardingScreen.js # 3 adımlı tanıtım (animasyonlu)
│   │   ├── PermissionScreen.js # Konum & bildirim izinleri
│   │   └── HomeScreen.js       # Ana sayfa + fiyat hesaplayıcı
│   ├── components/
│   │   └── RequestModal.js     # Şoför talep formu
│   └── utils/
│       └── pricing.js          # Mesafe & fiyat hesaplama
├── eas.json                    # EAS Build yapılandırması
└── app.json                    # Expo uygulama yapılandırması
```

## 💰 Fiyatlandırma

| Hizmet | Fiyat |
|---|---|
| Açılış (0-5 KM) | 500 ₺ |
| Şehir İçi (KM başı) | 100 ₺ |
| Premium Hizmet (15 KM) | 1.400 ₺ |
| Park Halinde Bekleme (saat) | 250 ₺ |
| VIP Hizmet | 5.000 ₺ |

## 🔒 Gizlilik

*   Uygulama sadece hizmet vermek amacıyla **konum** verisi toplar
*   İletişim **WhatsApp** üzerinden sağlanır
*   Detaylı bilgi için [Gizlilik Politikası](PRIVACY_POLICY.md)

## 📄 Lisans

Bu proje MIT lisansı ile lisanslanmıştır.

---
**Geliştirici:** MediaConfig
**EAS Hesabı:** @admin_r
