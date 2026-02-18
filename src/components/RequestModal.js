import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    TouchableWithoutFeedback,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { COLORS, SPACING, RADIUS, WHATSAPP_NUMBER, APP_NAME } from '../constants/theme';

const VEHICLE_OPTIONS = ['Sedan', 'SUV', 'Minivan', 'Lüks Araç'];

export default function RequestModal({ visible, onClose, location }) {
    const [formData, setFormData] = useState({
        name: '',
        vehicle: 'Sedan',
        passengers: '1',
        description: '',
    });
    const [vehicleDropdownOpen, setVehicleDropdownOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateField = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        if (!formData.name.trim()) {
            Alert.alert('Eksik Bilgi', 'Lütfen adınızı ve soyadınızı giriniz.');
            return;
        }

        setIsSubmitting(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        const locationString =
            location?.latitude && location?.longitude
                ? `📍 Konum: https://maps.google.com/?q=${location.latitude},${location.longitude}`
                : '📍 Konum: Bilinmiyor (İzin verilmedi)';

        const message =
            `*${APP_NAME} TALEP FORMU* 🚖\n\n` +
            `👤 Müşteri: ${formData.name}\n` +
            `🚗 Araç Tipi: ${formData.vehicle}\n` +
            `👥 Kişi Sayısı: ${formData.passengers}\n` +
            `📝 Açıklama: ${formData.description}\n\n` +
            `${locationString}`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

        try {
            await Linking.openURL(whatsappUrl);
            onClose();
        } catch (e) {
            Alert.alert('Hata', 'WhatsApp açılamadı. Lütfen WhatsApp uygulamasının yüklü olduğundan emin olun.');
        } finally {
            setTimeout(() => setIsSubmitting(false), 1500);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.overlay}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.backdrop} />
                </TouchableWithoutFeedback>
                <View style={styles.modalContainer}>
                    {/* Top accent line */}
                    <LinearGradient
                        colors={['transparent', COLORS.yellow, 'transparent']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.accentLine}
                    />

                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerTitle}>
                            <View style={styles.titleDot} />
                            <Text style={styles.headerText}>Talep Oluştur</Text>
                        </View>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Ionicons name="close" size={20} color={COLORS.gray400} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.formContent}
                        keyboardShouldPersistTaps="handled"
                        bounces={false}
                    >
                        {/* Name */}
                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>MÜŞTERİ ADI - SOYADI</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="person" size={18} color={COLORS.gray500} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Adınız Soyadınız"
                                    placeholderTextColor={COLORS.gray600}
                                    value={formData.name}
                                    onChangeText={(text) => updateField('name', text)}
                                    returnKeyType="next"
                                />
                            </View>
                        </View>

                        {/* Vehicle + Passengers Row */}
                        <View style={styles.row}>
                            <View style={[styles.fieldGroup, { flex: 1 }]}>
                                <Text style={styles.label}>ARAÇ TİPİ</Text>
                                <TouchableOpacity
                                    style={styles.inputContainer}
                                    onPress={() => setVehicleDropdownOpen(!vehicleDropdownOpen)}
                                >
                                    <Ionicons name="car" size={18} color={COLORS.gray500} style={styles.inputIcon} />
                                    <Text style={styles.selectText}>{formData.vehicle}</Text>
                                    <Ionicons name="chevron-down" size={16} color={COLORS.gray500} />
                                </TouchableOpacity>
                                {vehicleDropdownOpen && (
                                    <View style={styles.dropdown}>
                                        {VEHICLE_OPTIONS.map((opt) => (
                                            <TouchableOpacity
                                                key={opt}
                                                style={styles.dropdownItem}
                                                onPress={() => {
                                                    updateField('vehicle', opt);
                                                    setVehicleDropdownOpen(false);
                                                }}
                                            >
                                                <Text style={[styles.dropdownText, formData.vehicle === opt && styles.dropdownTextActive]}>
                                                    {opt}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>

                            <View style={[styles.fieldGroup, { flex: 0.6 }]}>
                                <Text style={styles.label}>KİŞİ SAYISI</Text>
                                <View style={styles.inputContainer}>
                                    <Ionicons name="people" size={18} color={COLORS.gray500} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        keyboardType="numeric"
                                        value={formData.passengers}
                                        onChangeText={(text) => updateField('passengers', text)}
                                        returnKeyType="next"
                                    />
                                </View>
                            </View>
                        </View>

                        {/* Description */}
                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>AÇIKLAMA</Text>
                            <View style={[styles.inputContainer, styles.textAreaContainer]}>
                                <Ionicons name="document-text" size={18} color={COLORS.gray500} style={[styles.inputIcon, { marginTop: 12 }]} />
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    placeholder="Eklemek istedikleriniz..."
                                    placeholderTextColor={COLORS.gray600}
                                    multiline
                                    numberOfLines={3}
                                    value={formData.description}
                                    onChangeText={(text) => updateField('description', text)}
                                    returnKeyType="done"
                                    blurOnSubmit={true}
                                />
                            </View>
                        </View>

                        {/* Submit Button */}
                        <TouchableOpacity style={[styles.submitButton, isSubmitting && { opacity: 0.6 }]} activeOpacity={0.8} onPress={handleSubmit} disabled={isSubmitting}>
                            <LinearGradient
                                colors={[COLORS.yellow, COLORS.accent]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.submitGradient}
                            >
                                {isSubmitting ? (
                                    <ActivityIndicator size="small" color={COLORS.black} />
                                ) : (
                                    <Ionicons name="send" size={20} color={COLORS.black} />
                                )}
                                <Text style={styles.submitText}>{isSubmitting ? 'GÖNDERİLİYOR...' : 'WHATSAPP İLE GÖNDER'}</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <Text style={styles.hint}>Konum bilgileriniz otomatik olarak eklenecektir.</Text>

                        {/* Extra spacing to ensure button is visible above keyboard */}
                        <View style={{ height: 40 }} />
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    modalContainer: {
        backgroundColor: COLORS.darkBg,
        borderTopLeftRadius: RADIUS.xl,
        borderTopRightRadius: RADIUS.xl,
        paddingBottom: Platform.OS === 'ios' ? 40 : 64,
        maxHeight: '85%',
        borderWidth: 1,
        borderColor: COLORS.yellowDim,
        borderBottomWidth: 0,
    },
    accentLine: {
        height: 2,
        borderTopLeftRadius: RADIUS.xl,
        borderTopRightRadius: RADIUS.xl,
        opacity: 0.5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.lg,
        paddingBottom: SPACING.md,
    },
    headerTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    titleDot: {
        width: 4,
        height: 24,
        backgroundColor: COLORS.yellow,
        borderRadius: 2,
    },
    headerText: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.white,
    },
    closeButton: {
        padding: 8,
        borderRadius: RADIUS.full,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    formContent: {
        paddingHorizontal: SPACING.lg,
        paddingBottom: 20,
    },
    fieldGroup: {
        marginBottom: SPACING.md,
    },
    label: {
        fontSize: 10,
        fontWeight: '600',
        color: COLORS.yellow,
        letterSpacing: 1.5,
        marginBottom: 6,
        marginLeft: 2,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderWidth: 1,
        borderColor: COLORS.gray800,
        borderRadius: RADIUS.lg,
        paddingHorizontal: 12,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        color: COLORS.white,
        fontSize: 15,
        paddingVertical: 14,
    },
    selectText: {
        flex: 1,
        color: COLORS.white,
        fontSize: 15,
        paddingVertical: 14,
    },
    textAreaContainer: {
        alignItems: 'flex-start',
    },
    textArea: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    dropdown: {
        backgroundColor: COLORS.cardBg,
        borderRadius: RADIUS.md,
        marginTop: 4,
        borderWidth: 1,
        borderColor: COLORS.gray800,
        overflow: 'hidden',
    },
    dropdownItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray800,
    },
    dropdownText: {
        color: COLORS.gray300,
        fontSize: 14,
    },
    dropdownTextActive: {
        color: COLORS.yellow,
        fontWeight: '600',
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    submitButton: {
        marginTop: SPACING.lg,
        borderRadius: RADIUS.lg,
        overflow: 'hidden',
    },
    submitGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 16,
    },
    submitText: {
        fontSize: 15,
        fontWeight: '800',
        color: COLORS.black,
        letterSpacing: 1,
    },
    hint: {
        textAlign: 'center',
        fontSize: 10,
        color: COLORS.gray500,
        marginTop: 10,
    },
});
