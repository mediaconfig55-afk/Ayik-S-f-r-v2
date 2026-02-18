import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Alert,
} from 'react-native';
import Animated, {
    FadeIn,
    FadeInDown,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { COLORS, RADIUS } from '../constants/theme';

export default function PermissionScreen({ onComplete }) {
    const [locationGranted, setLocationGranted] = useState(false);
    const [notificationGranted, setNotificationGranted] = useState(false);

    const requestLocationPermission = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                setLocationGranted(true);
            } else {
                Alert.alert(
                    'Konum İzni',
                    'Konum izni verilmedi. Ayarlardan etkinleştirebilirsiniz.',
                    [{ text: 'Tamam' }]
                );
            }
        } catch (e) {
            console.log('Location permission error:', e);
        }
    };

    const requestNotificationPermission = async () => {
        try {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status === 'granted') {
                setNotificationGranted(true);
            } else {
                Alert.alert(
                    'Bildirim İzni',
                    'Bildirim izni verilmedi. Ayarlardan etkinleştirebilirsiniz.',
                    [{ text: 'Tamam' }]
                );
            }
        } catch (e) {
            console.log('Notification permission error:', e);
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#0a0a0a', '#0f0f0f', '#0a0a0a']}
                style={StyleSheet.absoluteFill}
            />

            <Animated.View entering={FadeIn.delay(200).duration(500)} style={styles.content}>
                {/* Header Icon */}
                <LinearGradient
                    colors={['rgba(255,215,0,0.15)', 'rgba(255,215,0,0.05)']}
                    style={styles.headerIcon}
                >
                    <Ionicons name="shield-checkmark" size={48} color={COLORS.yellow} />
                </LinearGradient>

                <Text style={styles.title}>İzinler</Text>
                <Text style={styles.subtitle}>
                    Uygulama için gerekli izinleri etkinleştirin
                </Text>

                {/* Permission Cards */}
                <View style={styles.cardsContainer}>
                    {/* Location */}
                    <Animated.View entering={FadeInDown.delay(400).duration(400)}>
                        <TouchableOpacity
                            style={[styles.permissionCard, locationGranted && styles.permissionCardGranted]}
                            onPress={requestLocationPermission}
                            activeOpacity={0.7}
                            disabled={locationGranted}
                        >
                            <LinearGradient
                                colors={locationGranted
                                    ? ['rgba(34,197,94,0.15)', 'rgba(34,197,94,0.05)']
                                    : ['rgba(255,215,0,0.1)', 'rgba(255,215,0,0.02)']
                                }
                                style={styles.permissionIconBg}
                            >
                                <Ionicons
                                    name={locationGranted ? 'checkmark-circle' : 'location'}
                                    size={28}
                                    color={locationGranted ? '#22C55E' : COLORS.yellow}
                                />
                            </LinearGradient>
                            <View style={styles.permissionInfo}>
                                <Text style={styles.permissionTitle}>Konum</Text>
                                <Text style={styles.permissionDesc}>
                                    {locationGranted ? 'İzin verildi ✓' : 'En yakın şoförü bulmak için'}
                                </Text>
                            </View>
                            {!locationGranted && (
                                <View style={styles.permissionAction}>
                                    <Text style={styles.permissionActionText}>İZİN VER</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Notifications */}
                    <Animated.View entering={FadeInDown.delay(600).duration(400)}>
                        <TouchableOpacity
                            style={[styles.permissionCard, notificationGranted && styles.permissionCardGranted]}
                            onPress={requestNotificationPermission}
                            activeOpacity={0.7}
                            disabled={notificationGranted}
                        >
                            <LinearGradient
                                colors={notificationGranted
                                    ? ['rgba(34,197,94,0.15)', 'rgba(34,197,94,0.05)']
                                    : ['rgba(255,215,0,0.1)', 'rgba(255,215,0,0.02)']
                                }
                                style={styles.permissionIconBg}
                            >
                                <Ionicons
                                    name={notificationGranted ? 'checkmark-circle' : 'notifications'}
                                    size={28}
                                    color={notificationGranted ? '#22C55E' : COLORS.yellow}
                                />
                            </LinearGradient>
                            <View style={styles.permissionInfo}>
                                <Text style={styles.permissionTitle}>Bildirimler</Text>
                                <Text style={styles.permissionDesc}>
                                    {notificationGranted ? 'İzin verildi ✓' : 'Şoför güncellemeleri için'}
                                </Text>
                            </View>
                            {!notificationGranted && (
                                <View style={styles.permissionAction}>
                                    <Text style={styles.permissionActionText}>İZİN VER</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </Animated.View>

            {/* Continue Button */}
            <Animated.View entering={FadeInDown.delay(800).duration(400)} style={styles.bottomContainer}>
                <TouchableOpacity style={styles.continueButton} onPress={onComplete} activeOpacity={0.8}>
                    <LinearGradient
                        colors={[COLORS.yellow, '#E5B800']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.continueButtonGradient}
                    >
                        <Text style={styles.continueButtonText}>DEVAM ET</Text>
                        <Ionicons name="arrow-forward" size={20} color={COLORS.black} />
                    </LinearGradient>
                </TouchableOpacity>
                <Text style={styles.skipHint}>Daha sonra ayarlardan değiştirebilirsiniz</Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    headerIcon: {
        width: 96,
        height: 96,
        borderRadius: 48,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: COLORS.white,
        marginBottom: 8,
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.gray400,
        textAlign: 'center',
        marginBottom: 40,
    },
    cardsContainer: {
        width: '100%',
        gap: 12,
    },
    permissionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(26,26,26,0.8)',
        borderRadius: RADIUS.lg,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
        gap: 14,
    },
    permissionCardGranted: {
        borderColor: 'rgba(34,197,94,0.2)',
    },
    permissionIconBg: {
        width: 52,
        height: 52,
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: 'center',
    },
    permissionInfo: {
        flex: 1,
    },
    permissionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.white,
        marginBottom: 2,
    },
    permissionDesc: {
        fontSize: 12,
        color: COLORS.gray400,
    },
    permissionAction: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: RADIUS.full,
        backgroundColor: 'rgba(255,215,0,0.15)',
    },
    permissionActionText: {
        fontSize: 11,
        fontWeight: '700',
        color: COLORS.yellow,
        letterSpacing: 1,
    },
    bottomContainer: {
        paddingHorizontal: 32,
        paddingBottom: Platform.OS === 'ios' ? 50 : 64,
        gap: 12,
    },
    continueButton: {
        borderRadius: RADIUS.lg,
        overflow: 'hidden',
        shadowColor: COLORS.yellow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 8,
    },
    continueButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 16,
    },
    continueButtonText: {
        fontSize: 16,
        fontWeight: '800',
        color: COLORS.black,
        letterSpacing: 2,
    },
    skipHint: {
        fontSize: 12,
        color: COLORS.gray600,
        textAlign: 'center',
    },
});
