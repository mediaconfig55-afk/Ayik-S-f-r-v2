import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Platform,
    StatusBar,
    Modal,
    ScrollView,
    ActivityIndicator,
    Alert,
    TextInput,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    withSpring,
    withDelay,
    Easing,
    FadeIn,
    FadeOut,
    SlideInDown,
    SlideOutDown,
    interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as Linking from 'expo-linking';
import * as Haptics from 'expo-haptics';
import { COLORS, SPACING, RADIUS, WHATSAPP_NUMBER, GITHUB_APK_URL, APP_NAME_FIRST, APP_NAME_LAST, APP_SUBTITLE, PRICE_CONFIG } from '../constants/theme';
import { calculatePrice, formatPrice } from '../utils/pricing';
import RequestModal from '../components/RequestModal';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
    const [modalVisible, setModalVisible] = useState(false);
    const [callModalVisible, setCallModalVisible] = useState(false);
    const [priceModalVisible, setPriceModalVisible] = useState(false);
    const [location, setLocation] = useState(null);
    const [locationGranted, setLocationGranted] = useState(false);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [estimatedKm, setEstimatedKm] = useState('');

    // Animations
    const glowScale = useSharedValue(1);
    const glowOpacity = useSharedValue(0.3);
    const pingScale = useSharedValue(0);
    const pingOpacity = useSharedValue(1);
    const heroEnter = useSharedValue(0);
    const titleEnter = useSharedValue(0);
    const buttonsEnter = useSharedValue(0);

    useEffect(() => {
        // Staggered entrance animations
        titleEnter.value = withDelay(100, withSpring(1, { damping: 15, stiffness: 80 }));
        heroEnter.value = withDelay(300, withSpring(1, { damping: 12, stiffness: 70 }));
        buttonsEnter.value = withDelay(500, withSpring(1, { damping: 15, stiffness: 80 }));

        // Pulsating glow
        glowScale.value = withRepeat(
            withSequence(
                withTiming(1.2, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
                withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
            ),
            -1, true
        );
        glowOpacity.value = withRepeat(
            withSequence(
                withTiming(0.5, { duration: 2000 }),
                withTiming(0.2, { duration: 2000 })
            ),
            -1, true
        );

        // Location ping
        pingScale.value = withRepeat(withTiming(2.5, { duration: 1500 }), -1, false);
        pingOpacity.value = withRepeat(withTiming(0, { duration: 1500 }), -1, false);

        requestLocation();
    }, []);

    const requestLocation = async () => {
        setIsLoadingLocation(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                setLocationGranted(true);
                const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
                setLocation(loc.coords);
            }
        } catch (e) {
            console.log('Location error:', e);
            Alert.alert('Konum Hatası', 'Konumunuz alınırken bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setIsLoadingLocation(false);
        }
    };

    const glowAnimStyle = useAnimatedStyle(() => ({
        transform: [{ scale: glowScale.value }],
        opacity: glowOpacity.value,
    }));

    const pingAnimStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pingScale.value }],
        opacity: pingOpacity.value,
    }));

    const titleAnimStyle = useAnimatedStyle(() => ({
        opacity: titleEnter.value,
        transform: [{ translateY: interpolate(titleEnter.value, [0, 1], [-30, 0]) }],
    }));

    const heroAnimStyle = useAnimatedStyle(() => ({
        opacity: heroEnter.value,
        transform: [{ scale: interpolate(heroEnter.value, [0, 1], [0.6, 1]) }],
    }));

    const buttonsAnimStyle = useAnimatedStyle(() => ({
        opacity: buttonsEnter.value,
        transform: [{ translateY: interpolate(buttonsEnter.value, [0, 1], [40, 0]) }],
    }));

    const handleQRDownload = useCallback(async () => {
        if (isProcessing) return;
        setIsProcessing(true);
        try {
            await Linking.openURL(GITHUB_APK_URL);
        } catch (e) {
            Alert.alert('Hata', 'Bağlantı açılamadı. Lütfen daha sonra tekrar deneyin.');
        } finally {
            setTimeout(() => setIsProcessing(false), 1500);
        }
    }, [isProcessing]);

    const handleCall = useCallback(async () => {
        if (isProcessing) return;
        setIsProcessing(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        try {
            await Linking.openURL(`tel:+${WHATSAPP_NUMBER}`);
            setCallModalVisible(false);
        } catch (e) {
            Alert.alert('Arama Hatası', 'Arama başlatılamadı. Lütfen numarayı manuel olarak arayın.');
            setCallModalVisible(false);
        } finally {
            setTimeout(() => setIsProcessing(false), 1500);
        }
    }, [isProcessing]);

    const handleHeroPress = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setModalVisible(true);
    }, []);

    const priceEstimate = estimatedKm ? calculatePrice(parseFloat(estimatedKm) || 0) : null;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.black} />
            <LinearGradient
                colors={['#0a0a0a', '#0f0f0f', '#0a0a0a']}
                style={StyleSheet.absoluteFill}
            />

            {/* Background Ambient Glow */}
            <View style={styles.ambientGlow}>
                <LinearGradient
                    colors={['rgba(255,215,0,0.08)', 'transparent']}
                    style={styles.ambientGlowGradient}
                />
            </View>

            {/* Location Badge */}
            <Animated.View entering={FadeIn.delay(800).duration(500)} style={styles.locationBadge}>
                <View style={styles.locationDotContainer}>
                    <Animated.View style={[styles.locationPing, pingAnimStyle]} />
                    <View style={[styles.locationDot, { backgroundColor: locationGranted ? COLORS.green : COLORS.gray500 }]} />
                </View>
                {isLoadingLocation ? (
                    <ActivityIndicator size="small" color={COLORS.yellow} />
                ) : (
                    <Ionicons name="location" size={14} color={COLORS.yellow} />
                )}
                <Text style={styles.locationText}>
                    {isLoadingLocation ? 'Konum Alınıyor...' : locationGranted ? 'Konum Aktif' : 'Konum Kapalı'}
                </Text>
            </Animated.View>

            {/* Main Content */}
            <View style={styles.content}>
                {/* Title */}
                <Animated.View style={[styles.titleContainer, titleAnimStyle]}>
                    <Text style={styles.title}>
                        {APP_NAME_FIRST} <Text style={styles.titleYellow}>{APP_NAME_LAST}</Text>
                    </Text>
                    <View style={styles.subtitleRow}>
                        <View style={styles.subtitleLine} />
                        <Text style={styles.subtitle}>{APP_SUBTITLE}</Text>
                        <View style={styles.subtitleLine} />
                    </View>
                </Animated.View>

                {/* Hero Button */}
                <Animated.View style={[styles.heroContainer, heroAnimStyle]}>
                    <Animated.View style={[styles.heroGlow, glowAnimStyle]}>
                        <LinearGradient
                            colors={['rgba(255,215,0,0.3)', 'rgba(255,215,0,0.05)', 'transparent']}
                            style={styles.heroGlowGradient}
                        />
                    </Animated.View>
                    <TouchableOpacity
                        style={styles.heroButton}
                        activeOpacity={0.8}
                        onPress={handleHeroPress}
                    >
                        <LinearGradient
                            colors={['rgba(255,215,0,0.12)', 'rgba(255,215,0,0.04)']}
                            style={styles.heroButtonGradient}
                        >
                            <Ionicons name="car-sport" size={56} color={COLORS.yellow} />
                            <View style={styles.heroLabel}>
                                <Text style={styles.heroLabelText}>BAŞLAT</Text>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>

                {/* Call Driver Button */}
                <Animated.View style={[{ width: '100%' }, buttonsAnimStyle]}>
                    <TouchableOpacity
                        style={styles.callButton}
                        activeOpacity={0.8}
                        onPress={() => setCallModalVisible(true)}
                    >
                        <LinearGradient
                            colors={[COLORS.yellow, '#E5B800']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.callButtonGradient}
                        >
                            <Ionicons name="call" size={22} color={COLORS.black} />
                            <Text style={styles.callButtonText}>ŞOFÖRÜ ARA</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Price + QR Row */}
                    <View style={styles.actionRow}>
                        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7} onPress={() => setPriceModalVisible(true)}>
                            <LinearGradient
                                colors={['rgba(255,215,0,0.1)', 'rgba(255,215,0,0.03)']}
                                style={styles.actionButtonGradient}
                            >
                                <Ionicons name="pricetag" size={22} color={COLORS.yellow} />
                                <Text style={styles.actionButtonText}>FİYATLAR</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7} onPress={handleQRDownload}>
                            <LinearGradient
                                colors={['rgba(255,215,0,0.1)', 'rgba(255,215,0,0.03)']}
                                style={styles.actionButtonGradient}
                            >
                                <Ionicons name="qr-code" size={22} color={COLORS.yellow} />
                                <Text style={styles.actionButtonText}>APP İNDİR</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>

            {/* About & Privacy Link */}
            <TouchableOpacity
                style={styles.aboutButton}
                activeOpacity={0.7}
                onPress={() => Linking.openURL('https://mediaconfig55-afk.github.io/Hakk-mda/')}
            >
                <Text style={styles.aboutButtonText}>Hakkında & Gizlilik</Text>
            </TouchableOpacity>

            {/* Footer */}
            <Text style={styles.footer}>v1.0.0 • 2026</Text>

            {/* Request Modal */}
            <RequestModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                location={location}
            />

            {/* Call Modal */}
            <Modal
                visible={callModalVisible}
                transparent
                animationType="none"
                onRequestClose={() => setCallModalVisible(false)}
            >
                <View style={styles.callModalOverlay}>
                    <TouchableOpacity
                        style={StyleSheet.absoluteFill}
                        activeOpacity={1}
                        onPress={() => setCallModalVisible(false)}
                    />
                    <Animated.View
                        entering={FadeIn.duration(200)}
                        exiting={FadeOut.duration(200)}
                        style={styles.callModalContainer}
                    >
                        <LinearGradient
                            colors={['rgba(255,215,0,0.15)', 'rgba(255,215,0,0.02)']}
                            style={styles.callModalIconGlow}
                        >
                            <Ionicons name="call" size={40} color={COLORS.yellow} />
                        </LinearGradient>
                        <Text style={styles.callModalTitle}>Şoförü Ara</Text>
                        <Text style={styles.callModalNumber}>+90 544 294 65 70</Text>
                        <Text style={styles.callModalHint}>Bu numarayı aramak istediğinize emin misiniz?</Text>

                        <View style={styles.callModalActions}>
                            <TouchableOpacity
                                style={styles.callModalCancel}
                                onPress={() => setCallModalVisible(false)}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.callModalCancelText}>İPTAL</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.callModalConfirm}
                                onPress={handleCall}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={['#22C55E', '#16A34A']}
                                    style={styles.callModalConfirmGradient}
                                >
                                    <Ionicons name="call" size={18} color={COLORS.white} />
                                    <Text style={styles.callModalConfirmText}>ARA</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </View>
            </Modal>

            {/* Price Modal */}
            <Modal
                visible={priceModalVisible}
                transparent
                animationType="none"
                onRequestClose={() => setPriceModalVisible(false)}
            >
                <View style={styles.priceModalOverlay}>
                    <TouchableOpacity
                        style={StyleSheet.absoluteFill}
                        activeOpacity={1}
                        onPress={() => setPriceModalVisible(false)}
                    />
                    <Animated.View
                        entering={SlideInDown.springify().damping(18).stiffness(120)}
                        exiting={SlideOutDown.duration(300)}
                        style={styles.priceModalContainer}
                    >
                        {/* Header accent */}
                        <LinearGradient
                            colors={['transparent', COLORS.yellow, 'transparent']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.priceModalAccent}
                        />

                        {/* Header */}
                        <View style={styles.priceModalHeaderRow}>
                            <View style={styles.priceModalHeaderLeft}>
                                <View style={styles.priceModalTitleDot} />
                                <Text style={styles.priceModalTitle}>Fiyat Listesi</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.priceModalCloseBtn}
                                onPress={() => setPriceModalVisible(false)}
                            >
                                <Ionicons name="close" size={20} color={COLORS.gray400} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.priceScrollContent}>
                            {/* Card 1 */}
                            <Animated.View entering={FadeIn.delay(100).duration(300)} style={styles.priceCard}>
                                <LinearGradient colors={['rgba(255,215,0,0.15)', 'rgba(255,215,0,0.05)']} style={styles.priceCardIcon}>
                                    <Ionicons name="flag" size={22} color={COLORS.yellow} />
                                </LinearGradient>
                                <View style={styles.priceCardCenter}>
                                    <Text style={styles.priceCardTitle}>Açılış</Text>
                                    <Text style={styles.priceCardDesc}>0-5 KM</Text>
                                </View>
                                <Text style={styles.priceCardAmount}>500 ₺</Text>
                            </Animated.View>

                            {/* Card 2 */}
                            <Animated.View entering={FadeIn.delay(200).duration(300)} style={styles.priceCard}>
                                <LinearGradient colors={['rgba(59,130,246,0.15)', 'rgba(59,130,246,0.05)']} style={styles.priceCardIcon}>
                                    <Ionicons name="navigate" size={22} color="#3B82F6" />
                                </LinearGradient>
                                <View style={styles.priceCardCenter}>
                                    <Text style={styles.priceCardTitle}>Şehir İçi</Text>
                                    <Text style={styles.priceCardDesc}>5 KM Sonrası</Text>
                                </View>
                                <Text style={styles.priceCardAmount}>+ 100 ₺</Text>
                            </Animated.View>

                            {/* Card 3 */}
                            <Animated.View entering={FadeIn.delay(300).duration(300)} style={styles.priceCard}>
                                <LinearGradient colors={['rgba(168,85,247,0.15)', 'rgba(168,85,247,0.05)']} style={styles.priceCardIcon}>
                                    <Ionicons name="diamond" size={22} color="#A855F7" />
                                </LinearGradient>
                                <View style={styles.priceCardCenter}>
                                    <Text style={styles.priceCardTitle}>Premium Hizmet</Text>
                                    <Text style={styles.priceCardDesc}>15 KM</Text>
                                </View>
                                <Text style={styles.priceCardAmount}>1400 ₺</Text>
                            </Animated.View>

                            {/* Card 4 */}
                            <Animated.View entering={FadeIn.delay(400).duration(300)} style={styles.priceCard}>
                                <LinearGradient colors={['rgba(249,115,22,0.15)', 'rgba(249,115,22,0.05)']} style={styles.priceCardIcon}>
                                    <Ionicons name="time" size={22} color="#F97316" />
                                </LinearGradient>
                                <View style={styles.priceCardCenter}>
                                    <Text style={styles.priceCardTitle}>Park Halinde Bekleme</Text>
                                    <Text style={styles.priceCardDesc}>Saat başı</Text>
                                </View>
                                <Text style={styles.priceCardAmount}>250 ₺</Text>
                            </Animated.View>

                            {/* Card 5 - VIP */}
                            <Animated.View entering={FadeIn.delay(500).duration(300)}>
                                <LinearGradient
                                    colors={['rgba(255,215,0,0.15)', 'rgba(255,215,0,0.03)']}
                                    style={styles.priceCardVIP}
                                >
                                    <LinearGradient colors={['rgba(255,215,0,0.3)', 'rgba(255,215,0,0.1)']} style={styles.priceCardIcon}>
                                        <Ionicons name="star" size={22} color={COLORS.yellow} />
                                    </LinearGradient>
                                    <View style={styles.priceCardCenter}>
                                        <Text style={[styles.priceCardTitle, { color: COLORS.yellow }]}>VİP HİZMET</Text>
                                        <Text style={styles.priceCardDesc}>ÖZEL</Text>
                                    </View>
                                    <Text style={[styles.priceCardAmount, { color: COLORS.yellow, fontSize: 20 }]}>5000 ₺</Text>
                                </LinearGradient>
                            </Animated.View>

                            {/* Fiyat Hesaplayıcı */}
                            <Animated.View entering={FadeIn.delay(600).duration(300)} style={styles.priceCalcContainer}>
                                <View style={styles.priceCalcHeader}>
                                    <Ionicons name="calculator" size={18} color={COLORS.yellow} />
                                    <Text style={styles.priceCalcTitle}>Fiyat Hesapla</Text>
                                </View>
                                <View style={styles.priceCalcInputRow}>
                                    <TextInput
                                        style={styles.priceCalcInput}
                                        placeholder="KM girin"
                                        placeholderTextColor={COLORS.gray600}
                                        keyboardType="numeric"
                                        value={estimatedKm}
                                        onChangeText={setEstimatedKm}
                                    />
                                    <Text style={styles.priceCalcUnit}>KM</Text>
                                </View>
                                {priceEstimate && priceEstimate.total > 0 && (
                                    <View style={styles.priceCalcResult}>
                                        <View style={styles.priceCalcBreakdown}>
                                            <Text style={styles.priceCalcLabel}>Açılış (0-{PRICE_CONFIG.baseKm} KM)</Text>
                                            <Text style={styles.priceCalcValue}>{formatPrice(priceEstimate.breakdown.base)}</Text>
                                        </View>
                                        {priceEstimate.breakdown.extraKm > 0 && (
                                            <View style={styles.priceCalcBreakdown}>
                                                <Text style={styles.priceCalcLabel}>+{priceEstimate.breakdown.extraKm} KM × {PRICE_CONFIG.perKm} ₺</Text>
                                                <Text style={styles.priceCalcValue}>{formatPrice(priceEstimate.breakdown.extraCost)}</Text>
                                            </View>
                                        )}
                                        <View style={styles.priceCalcDivider} />
                                        <View style={styles.priceCalcBreakdown}>
                                            <Text style={styles.priceCalcTotalLabel}>Toplam</Text>
                                            <Text style={styles.priceCalcTotalValue}>{formatPrice(priceEstimate.total)}</Text>
                                        </View>
                                    </View>
                                )}
                            </Animated.View>
                        </ScrollView>
                    </Animated.View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.black,
    },
    ambientGlow: {
        position: 'absolute',
        top: -100,
        left: -50,
        width: width * 0.8,
        height: width * 0.8,
        borderRadius: width * 0.4,
        opacity: 0.5,
    },
    ambientGlowGradient: {
        width: '100%', height: '100%', borderRadius: width * 0.4,
    },
    locationBadge: {
        position: 'absolute',
        top: Platform.OS === 'android' ? 50 : 60,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(18, 18, 18, 0.95)',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: RADIUS.full,
        borderWidth: 1,
        borderColor: 'rgba(255,215,0,0.15)',
        gap: 6,
        zIndex: 10,
    },
    locationDotContainer: {
        width: 10, height: 10,
        alignItems: 'center', justifyContent: 'center',
    },
    locationPing: {
        position: 'absolute', width: 10, height: 10,
        borderRadius: 5, backgroundColor: COLORS.greenDim,
    },
    locationDot: { width: 6, height: 6, borderRadius: 3 },
    locationText: { fontSize: 10, color: COLORS.gray300, fontWeight: '500' },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: SPACING.lg,
    },
    titleContainer: { alignItems: 'center', marginBottom: 36 },
    title: { fontSize: 42, fontWeight: '800', color: COLORS.white, letterSpacing: 3 },
    titleYellow: { color: COLORS.yellow },
    subtitleRow: {
        flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8,
    },
    subtitleLine: { width: 20, height: 1, backgroundColor: COLORS.gray700 },
    subtitle: {
        fontSize: 11, fontWeight: '400', color: COLORS.gray400,
        letterSpacing: 4, textTransform: 'uppercase',
    },
    heroContainer: {
        alignItems: 'center', justifyContent: 'center', marginBottom: 28,
    },
    heroGlow: {
        position: 'absolute', width: 220, height: 220, borderRadius: 110,
    },
    heroGlowGradient: {
        width: '100%', height: '100%', borderRadius: 110,
    },
    heroButton: {
        width: 170, height: 170, borderRadius: 85,
        borderWidth: 2, borderColor: 'rgba(255,215,0,0.5)',
        overflow: 'hidden',
        shadowColor: COLORS.yellow,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3, shadowRadius: 20, elevation: 15,
    },
    heroButtonGradient: {
        width: '100%', height: '100%',
        alignItems: 'center', justifyContent: 'center',
    },
    heroLabel: {
        marginTop: 6,
        backgroundColor: 'rgba(255,215,0,0.2)',
        paddingHorizontal: 18, paddingVertical: 5,
        borderRadius: RADIUS.full,
    },
    heroLabelText: {
        fontSize: 11, fontWeight: '700', color: COLORS.white, letterSpacing: 3,
    },
    callButton: {
        width: '100%', marginBottom: 16,
        borderRadius: RADIUS.lg, overflow: 'hidden',
        shadowColor: COLORS.yellow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25, shadowRadius: 12, elevation: 8,
    },
    callButtonGradient: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: 10, paddingVertical: 16,
    },
    callButtonText: {
        fontSize: 16, fontWeight: '800', color: COLORS.black, letterSpacing: 2,
    },
    actionRow: { flexDirection: 'row', gap: 12, width: '100%' },
    actionButton: {
        flex: 1, borderRadius: RADIUS.lg, overflow: 'hidden',
        borderWidth: 1, borderColor: 'rgba(255,215,0,0.15)',
    },
    actionButtonGradient: {
        alignItems: 'center', justifyContent: 'center',
        gap: 6, paddingVertical: 18,
    },
    actionButtonText: {
        fontSize: 11, color: COLORS.gray300, fontWeight: '700', letterSpacing: 1,
    },
    aboutButton: {
        marginBottom: 8,
        padding: 8,
        alignSelf: 'center',
    },
    aboutButtonText: {
        fontSize: 11,
        color: COLORS.gray500,
        textDecorationLine: 'underline',
        fontWeight: '500',
    },
    footer: {
        textAlign: 'center', fontSize: 10, color: COLORS.gray600,
        paddingBottom: Platform.OS === 'android' ? 64 : 32,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    // Call Modal
    callModalOverlay: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32,
    },
    callModalContainer: {
        backgroundColor: '#151515',
        borderRadius: RADIUS.xl, padding: 32,
        alignItems: 'center', width: '100%',
        borderWidth: 1, borderColor: 'rgba(255,215,0,0.2)',
    },
    callModalIconGlow: {
        width: 88, height: 88, borderRadius: 44,
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 16,
    },
    callModalTitle: {
        fontSize: 22, fontWeight: '800', color: COLORS.white, marginBottom: 8,
    },
    callModalNumber: {
        fontSize: 20, fontWeight: '600', color: COLORS.yellow,
        letterSpacing: 1, marginBottom: 8,
    },
    callModalHint: {
        fontSize: 13, color: COLORS.gray400, textAlign: 'center', marginBottom: 24,
    },
    callModalActions: { flexDirection: 'row', gap: 12, width: '100%' },
    callModalCancel: {
        flex: 1, paddingVertical: 14, borderRadius: RADIUS.lg,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1, borderColor: COLORS.gray700, alignItems: 'center',
    },
    callModalCancelText: {
        fontSize: 14, fontWeight: '700', color: COLORS.gray300, letterSpacing: 1,
    },
    callModalConfirm: { flex: 1, borderRadius: RADIUS.lg, overflow: 'hidden' },
    callModalConfirmGradient: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: 8, paddingVertical: 14,
    },
    callModalConfirmText: {
        fontSize: 14, fontWeight: '700', color: COLORS.white, letterSpacing: 1,
    },
    // Price Modal
    priceModalOverlay: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'flex-end',
    },
    priceModalContainer: {
        backgroundColor: '#151515',
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
        paddingBottom: Platform.OS === 'android' ? 64 : 40,
        maxHeight: '92%',
        borderWidth: 1, borderColor: 'rgba(255,215,0,0.15)',
        borderBottomWidth: 0,
    },
    priceModalAccent: {
        height: 2, borderTopLeftRadius: 28, borderTopRightRadius: 28, opacity: 0.5,
    },
    priceModalHeaderRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 20, paddingTop: 12, paddingBottom: 10,
    },
    priceModalHeaderLeft: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
    },
    priceModalTitleDot: {
        width: 4, height: 24, backgroundColor: COLORS.yellow, borderRadius: 2,
    },
    priceModalTitle: { fontSize: 20, fontWeight: '700', color: COLORS.white },
    priceModalCloseBtn: {
        padding: 8, borderRadius: RADIUS.full,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    priceScrollContent: {
        paddingHorizontal: 20, paddingBottom: 16, gap: 8,
    },
    priceCard: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: 'rgba(26,26,26,0.8)',
        borderRadius: RADIUS.lg, padding: 12,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', gap: 12,
    },
    priceCardVIP: {
        flexDirection: 'row', alignItems: 'center',
        borderRadius: RADIUS.lg, padding: 12,
        borderWidth: 1, borderColor: 'rgba(255,215,0,0.3)', gap: 12,
    },
    priceCardIcon: {
        width: 42, height: 42, borderRadius: 21,
        alignItems: 'center', justifyContent: 'center',
    },
    priceCardCenter: { flex: 1 },
    priceCardTitle: { fontSize: 15, fontWeight: '700', color: COLORS.white, marginBottom: 2 },
    priceCardDesc: { fontSize: 12, color: COLORS.gray400 },
    priceCardAmount: { fontSize: 18, fontWeight: '800', color: COLORS.white },
    // Price Calculator
    priceCalcContainer: {
        marginTop: 4,
        backgroundColor: 'rgba(255,215,0,0.08)',
        borderRadius: RADIUS.lg,
        padding: 16,
        borderWidth: 1.5,
        borderColor: 'rgba(255,215,0,0.25)',
    },
    priceCalcHeader: {
        flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12,
    },
    priceCalcTitle: {
        fontSize: 15, fontWeight: '700', color: COLORS.yellow,
    },
    priceCalcInputRow: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
    },
    priceCalcInput: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: RADIUS.md,
        paddingHorizontal: 14,
        paddingVertical: 12,
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
        borderWidth: 1,
        borderColor: COLORS.gray800,
    },
    priceCalcUnit: {
        fontSize: 14, fontWeight: '700', color: COLORS.gray400, letterSpacing: 1,
    },
    priceCalcResult: {
        marginTop: 12,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: RADIUS.md,
        padding: 12,
        gap: 6,
    },
    priceCalcBreakdown: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    },
    priceCalcLabel: {
        fontSize: 13, color: COLORS.gray400,
    },
    priceCalcValue: {
        fontSize: 13, fontWeight: '600', color: COLORS.gray300,
    },
    priceCalcDivider: {
        height: 1, backgroundColor: COLORS.gray800, marginVertical: 4,
    },
    priceCalcTotalLabel: {
        fontSize: 15, fontWeight: '700', color: COLORS.white,
    },
    priceCalcTotalValue: {
        fontSize: 18, fontWeight: '800', color: COLORS.yellow,
    },
});
