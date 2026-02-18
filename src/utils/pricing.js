import { PRICE_CONFIG } from '../constants/theme';

/**
 * Haversine formülü ile iki koordinat arasındaki mesafeyi hesaplar (KM)
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Dünya yarıçapı (KM)
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function toRad(deg) {
    return deg * (Math.PI / 180);
}

/**
 * KM değerine göre fiyat hesaplar
 * @param {number} km - Mesafe (KM)
 * @returns {{ total: number, breakdown: object }}
 */
export function calculatePrice(km) {
    const { base, baseKm, perKm } = PRICE_CONFIG;

    if (km <= 0) {
        return { total: 0, breakdown: { base: 0, extra: 0 } };
    }

    if (km <= baseKm) {
        return { total: base, breakdown: { base, extra: 0 } };
    }

    const extraKm = km - baseKm;
    const extraCost = Math.ceil(extraKm) * perKm;
    const total = base + extraCost;

    return {
        total,
        breakdown: {
            base,
            extraKm: Math.ceil(extraKm),
            extraCost,
        },
    };
}

/**
 * Fiyatı formatlar
 */
export function formatPrice(amount) {
    return `${amount.toLocaleString('tr-TR')} ₺`;
}
