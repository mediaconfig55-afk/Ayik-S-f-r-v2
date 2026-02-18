import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    withSequence,
    withSpring,
    runOnJS,
    Easing,
    interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ onFinish }) {
    const iconScale = useSharedValue(0);
    const iconRotation = useSharedValue(-15);
    const textOpacity = useSharedValue(0);
    const textTranslateY = useSharedValue(40);
    const lineWidth = useSharedValue(0);
    const glowOpacity = useSharedValue(0);
    const particleScale = useSharedValue(0);
    const containerOpacity = useSharedValue(1);

    useEffect(() => {
        // Stage 1: Glow appears
        glowOpacity.value = withTiming(1, { duration: 600 });

        // Stage 2: Icon springs in with rotation
        iconScale.value = withDelay(200, withSpring(1, {
            damping: 12,
            stiffness: 100,
            mass: 0.8,
        }));
        iconRotation.value = withDelay(200, withSpring(0, {
            damping: 8,
            stiffness: 80,
        }));

        // Stage 3: Particles burst
        particleScale.value = withDelay(500, withSequence(
            withTiming(1.5, { duration: 400 }),
            withTiming(0, { duration: 300 })
        ));

        // Stage 4: Text slides up
        textOpacity.value = withDelay(600, withTiming(1, { duration: 500 }));
        textTranslateY.value = withDelay(600, withSpring(0, { damping: 15, stiffness: 100 }));

        // Stage 5: Line expands
        lineWidth.value = withDelay(900, withTiming(120, { duration: 500, easing: Easing.out(Easing.cubic) }));

        // Stage 6: Fade out
        containerOpacity.value = withDelay(2200, withTiming(0, { duration: 400 }, (finished) => {
            if (finished) {
                runOnJS(onFinish)();
            }
        }));
    }, []);

    const iconAnimStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: iconScale.value },
            { rotate: `${iconRotation.value}deg` },
        ],
    }));

    const glowAnimStyle = useAnimatedStyle(() => ({
        opacity: glowOpacity.value * 0.6,
        transform: [{ scale: interpolate(iconScale.value, [0, 1], [0.5, 1.2]) }],
    }));

    const particleAnimStyle = useAnimatedStyle(() => ({
        opacity: particleScale.value > 0 ? 0.4 : 0,
        transform: [{ scale: particleScale.value }],
    }));

    const textAnimStyle = useAnimatedStyle(() => ({
        opacity: textOpacity.value,
        transform: [{ translateY: textTranslateY.value }],
    }));

    const lineAnimStyle = useAnimatedStyle(() => ({
        width: lineWidth.value,
    }));

    const containerAnimStyle = useAnimatedStyle(() => ({
        opacity: containerOpacity.value,
    }));

    return (
        <Animated.View style={[styles.container, containerAnimStyle]}>
            <LinearGradient
                colors={['#0a0a0a', '#111111', '#0a0a0a']}
                style={StyleSheet.absoluteFill}
            />

            {/* Ambient glow behind icon */}
            <Animated.View style={[styles.ambientGlow, glowAnimStyle]}>
                <LinearGradient
                    colors={['rgba(255,215,0,0.25)', 'rgba(255,215,0,0.05)', 'transparent']}
                    style={styles.ambientGlowGradient}
                />
            </Animated.View>

            {/* Particle burst ring */}
            <Animated.View style={[styles.particleRing, particleAnimStyle]} />

            {/* Icon */}
            <Animated.View style={[styles.iconContainer, iconAnimStyle]}>
                <LinearGradient
                    colors={['rgba(255,215,0,0.2)', 'rgba(255,215,0,0.08)']}
                    style={styles.iconRing}
                >
                    <View style={styles.iconInner}>
                        <Ionicons name="car-sport" size={72} color={COLORS.yellow} />
                    </View>
                </LinearGradient>
            </Animated.View>

            {/* Title */}
            <Animated.View style={[styles.textContainer, textAnimStyle]}>
                <Text style={styles.title}>
                    AYIK <Text style={styles.titleAccent}>ŞOFÖR</Text>
                </Text>
                <View style={styles.subtitleRow}>
                    <View style={styles.subtitleLine} />
                    <Text style={styles.subtitle}>Premium Şoför Hizmeti</Text>
                    <View style={styles.subtitleLine} />
                </View>
            </Animated.View>

            {/* Animated Line */}
            <Animated.View style={[styles.line, lineAnimStyle]}>
                <LinearGradient
                    colors={['transparent', COLORS.yellow, 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={StyleSheet.absoluteFill}
                />
            </Animated.View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 100,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0a0a',
    },
    ambientGlow: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
    },
    ambientGlowGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 150,
    },
    particleRing: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: COLORS.yellow,
    },
    iconContainer: {
        marginBottom: 28,
    },
    iconRing: {
        width: 150,
        height: 150,
        borderRadius: 75,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(255,215,0,0.3)',
    },
    iconInner: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255,215,0,0.08)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: 38,
        fontWeight: '800',
        color: COLORS.white,
        letterSpacing: 6,
    },
    titleAccent: {
        color: COLORS.yellow,
    },
    subtitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 10,
    },
    subtitleLine: {
        width: 24,
        height: 1,
        backgroundColor: COLORS.gray700,
    },
    subtitle: {
        fontSize: 12,
        fontWeight: '400',
        color: COLORS.gray400,
        letterSpacing: 4,
        textTransform: 'uppercase',
    },
    line: {
        height: 3,
        borderRadius: 2,
        marginTop: 28,
        overflow: 'hidden',
    },
});
