import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    FlatList,
    Platform,
} from 'react-native';
import Animated, {
    FadeIn,
    FadeInDown,
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    withSpring,
    withDelay,
    Easing,
    interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, APP_NAME, APP_SUBTITLE } from '../constants/theme';

const { width } = Dimensions.get('window');

const SLIDES = [
    {
        id: '1',
        icon: 'car-sport',
        title: APP_NAME,
        subtitle: APP_SUBTITLE,
        description: 'Güvenli ve konforlu yolculuk deneyimi için profesyonel şoför hizmetiniz.',
        color: COLORS.yellow,
    },
    {
        id: '2',
        icon: 'shield-checkmark',
        title: 'Güvenli Yolculuk',
        subtitle: 'Sertifikalı Şoförler',
        description: 'Tüm şoförlerimiz eğitimli ve güvenlik kontrollerinden geçmiştir.',
        color: '#22C55E',
    },
    {
        id: '3',
        icon: 'flash',
        title: 'Hızlı Hizmet',
        subtitle: 'Tek Tuşla Ulaşın',
        description: 'WhatsApp üzerinden anında talep oluşturun, şoförünüz kapınızda olsun.',
        color: COLORS.accent,
    },
];

// Her slide için ayrı animasyonlu ikon bileşeni
function AnimatedIcon({ icon, color, isActive }) {
    const pulseScale = useSharedValue(1);
    const ringScale = useSharedValue(0.8);
    const ringOpacity = useSharedValue(0);
    const rotateZ = useSharedValue(0);
    const glowOpacity = useSharedValue(0.2);

    useEffect(() => {
        if (isActive) {
            // Pulsing icon
            pulseScale.value = withRepeat(
                withSequence(
                    withTiming(1.08, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
                    withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) })
                ),
                -1, true
            );

            // Expanding ring
            ringScale.value = withRepeat(
                withSequence(
                    withTiming(1.6, { duration: 2000, easing: Easing.out(Easing.ease) }),
                    withTiming(0.8, { duration: 0 })
                ),
                -1, false
            );
            ringOpacity.value = withRepeat(
                withSequence(
                    withTiming(0.5, { duration: 200 }),
                    withTiming(0, { duration: 1800 })
                ),
                -1, false
            );

            // Subtle rotation
            rotateZ.value = withRepeat(
                withSequence(
                    withTiming(5, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
                    withTiming(-5, { duration: 2500, easing: Easing.inOut(Easing.ease) })
                ),
                -1, true
            );

            // Glow pulse
            glowOpacity.value = withRepeat(
                withSequence(
                    withTiming(0.5, { duration: 1500 }),
                    withTiming(0.15, { duration: 1500 })
                ),
                -1, true
            );
        }
    }, [isActive]);

    const iconStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: pulseScale.value },
            { rotate: `${rotateZ.value}deg` },
        ],
    }));

    const ringStyle = useAnimatedStyle(() => ({
        transform: [{ scale: ringScale.value }],
        opacity: ringOpacity.value,
    }));

    const glowStyle = useAnimatedStyle(() => ({
        opacity: glowOpacity.value,
    }));

    return (
        <View style={styles.iconWrapper}>
            {/* Background glow */}
            <Animated.View style={[styles.iconGlow, glowStyle]}>
                <LinearGradient
                    colors={[color + '40', color + '10', 'transparent']}
                    style={styles.iconGlowGradient}
                />
            </Animated.View>

            {/* Expanding ring */}
            <Animated.View
                style={[
                    styles.expandingRing,
                    { borderColor: color },
                    ringStyle,
                ]}
            />

            {/* Main icon circle */}
            <Animated.View style={iconStyle}>
                <View style={[styles.iconCircle, { borderColor: color + '30' }]}>
                    <View style={[styles.iconInner, { backgroundColor: color + '15' }]}>
                        <Ionicons name={icon} size={60} color={color} />
                    </View>
                </View>
            </Animated.View>

            {/* Decorative particles */}
            {isActive && (
                <>
                    <Animated.View
                        entering={FadeIn.delay(300).duration(600)}
                        style={[styles.particle, styles.particleTopRight, { backgroundColor: color }]}
                    />
                    <Animated.View
                        entering={FadeIn.delay(500).duration(600)}
                        style={[styles.particle, styles.particleBottomLeft, { backgroundColor: color }]}
                    />
                    <Animated.View
                        entering={FadeIn.delay(700).duration(600)}
                        style={[styles.particle, styles.particleTopLeft, { backgroundColor: color }]}
                    />
                </>
            )}
        </View>
    );
}

function SlideItem({ item, index, currentIndex }) {
    const isActive = index === currentIndex;

    return (
        <View style={styles.slide}>
            <AnimatedIcon icon={item.icon} color={item.color} isActive={isActive} />

            <Animated.View entering={FadeIn.delay(200).duration(500)} style={styles.textContent}>
                <Text style={[styles.slideTitle, { color: item.color }]}>{item.title}</Text>
                <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
                <View style={styles.descDivider}>
                    <LinearGradient
                        colors={['transparent', item.color + '60', 'transparent']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.descDividerLine}
                    />
                </View>
                <Text style={styles.slideDescription}>{item.description}</Text>
            </Animated.View>
        </View>
    );
}

export default function OnboardingScreen({ onComplete }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);

    const handleNext = () => {
        if (currentIndex < SLIDES.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
            setCurrentIndex(currentIndex + 1);
        } else {
            onComplete();
        }
    };

    const handleSkip = () => {
        onComplete();
    };

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems[0]) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[COLORS.black, COLORS.darkBg, COLORS.black]}
                style={StyleSheet.absoluteFill}
            />

            {/* Skip Button */}
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip} activeOpacity={0.7}>
                <Text style={styles.skipText}>Atla</Text>
            </TouchableOpacity>

            {/* Slides */}
            <FlatList
                ref={flatListRef}
                data={SLIDES}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                    <SlideItem item={item} index={index} currentIndex={currentIndex} />
                )}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
            />

            {/* Bottom Controls */}
            <View style={styles.bottomContainer}>
                {/* Dots */}
                <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.dotsContainer}>
                    {SLIDES.map((item, index) => (
                        <View
                            key={item.id}
                            style={[
                                styles.dot,
                                {
                                    backgroundColor: index === currentIndex ? COLORS.yellow : COLORS.gray700,
                                    width: index === currentIndex ? 24 : 8,
                                },
                            ]}
                        />
                    ))}
                </Animated.View>

                {/* Next / Start Button */}
                <Animated.View entering={FadeInDown.delay(500).duration(400)}>
                    <TouchableOpacity style={styles.nextButton} onPress={handleNext} activeOpacity={0.8}>
                        <LinearGradient
                            colors={[COLORS.yellow, COLORS.accent]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.nextButtonGradient}
                        >
                            <Text style={styles.nextButtonText}>
                                {currentIndex === SLIDES.length - 1 ? 'BAŞLA' : 'İLERİ'}
                            </Text>
                            <Ionicons
                                name={currentIndex === SLIDES.length - 1 ? 'checkmark' : 'arrow-forward'}
                                size={20}
                                color={COLORS.black}
                            />
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.black,
    },
    skipButton: {
        position: 'absolute',
        top: Platform.OS === 'android' ? 50 : 60,
        right: 24,
        zIndex: 10,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: RADIUS.full,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    skipText: {
        color: COLORS.gray400,
        fontSize: 14,
        fontWeight: '500',
    },
    slide: {
        width: width,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    // Animated Icon Styles
    iconWrapper: {
        marginBottom: 40,
        alignItems: 'center',
        justifyContent: 'center',
        width: 200,
        height: 200,
    },
    iconGlow: {
        position: 'absolute',
        width: 280,
        height: 280,
        borderRadius: 140,
    },
    iconGlowGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 140,
    },
    expandingRing: {
        position: 'absolute',
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 1.5,
    },
    iconCircle: {
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconInner: {
        width: 130,
        height: 130,
        borderRadius: 65,
        alignItems: 'center',
        justifyContent: 'center',
    },
    particle: {
        position: 'absolute',
        width: 6,
        height: 6,
        borderRadius: 3,
        opacity: 0.5,
    },
    particleTopRight: {
        top: 15,
        right: 20,
    },
    particleBottomLeft: {
        bottom: 20,
        left: 15,
    },
    particleTopLeft: {
        top: 30,
        left: 25,
    },
    // Text Content
    textContent: {
        alignItems: 'center',
    },
    slideTitle: {
        fontSize: 32,
        fontWeight: '800',
        letterSpacing: 2,
        marginBottom: 8,
    },
    slideSubtitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.gray300,
        marginBottom: 16,
    },
    descDivider: {
        width: 60,
        height: 2,
        marginBottom: 16,
    },
    descDividerLine: {
        width: '100%',
        height: '100%',
        borderRadius: 1,
    },
    slideDescription: {
        fontSize: 14,
        color: COLORS.gray400,
        textAlign: 'center',
        lineHeight: 22,
        maxWidth: 280,
    },
    // Bottom Controls
    bottomContainer: {
        paddingHorizontal: 32,
        paddingBottom: Platform.OS === 'ios' ? 50 : 64,
        gap: 24,
    },
    dotsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    dot: {
        height: 8,
        borderRadius: 4,
    },
    nextButton: {
        borderRadius: RADIUS.lg,
        overflow: 'hidden',
    },
    nextButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 16,
    },
    nextButtonText: {
        fontSize: 16,
        fontWeight: '800',
        color: COLORS.black,
        letterSpacing: 2,
    },
});
