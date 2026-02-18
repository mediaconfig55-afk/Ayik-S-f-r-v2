import React, { useState, useRef } from 'react';
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
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS } from '../constants/theme';

const { width } = Dimensions.get('window');

const SLIDES = [
    {
        id: '1',
        icon: 'car-sport',
        title: 'AYIK ŞOFÖR',
        subtitle: 'Premium Şoför Hizmeti',
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

function SlideItem({ item, index, currentIndex }) {
    const isActive = index === currentIndex;

    return (
        <View style={styles.slide}>
            <Animated.View
                entering={FadeIn.duration(500)}
                style={styles.iconWrapper}
            >
                <View style={[styles.iconCircle, { borderColor: item.color + '30' }]}>
                    <View style={[styles.iconInner, { backgroundColor: item.color + '15' }]}>
                        <Ionicons name={item.icon} size={60} color={item.color} />
                    </View>
                </View>
            </Animated.View>

            <Animated.View entering={FadeIn.delay(200).duration(500)} style={styles.textContent}>
                <Text style={[styles.slideTitle, { color: item.color }]}>{item.title}</Text>
                <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
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
                <View style={styles.dotsContainer}>
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
                </View>

                {/* Next / Start Button */}
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
    iconWrapper: {
        marginBottom: 40,
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
    slideDescription: {
        fontSize: 14,
        color: COLORS.gray400,
        textAlign: 'center',
        lineHeight: 22,
        maxWidth: 280,
    },
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
