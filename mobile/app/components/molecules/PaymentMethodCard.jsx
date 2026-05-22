import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../atoms/Card';
import { responsive, wp } from '../../utils/responsive';

const PaymentMethodCard = ({
    method,
    selected = false,
    onPress,
    onDelete,
    style,
}) => {
    const {
        type = 'card', // card, bank, wallet
        lastFour,
        expiryDate,
        cardBrand,
        bankName,
        walletName,
        isDefault = false,
    } = method;

    const getIcon = () => {
        switch (type) {
            case 'card':
                return cardBrand === 'visa' ? 'card' : 'card-outline';
            case 'bank':
                return 'business';
            case 'wallet':
                return 'wallet';
            default:
                return 'card-outline';
        }
    };

    const getCardBrandColor = () => {
        switch (cardBrand?.toLowerCase()) {
            case 'visa':
                return '#1A1F71';
            case 'mastercard':
                return '#EB001B';
            case 'amex':
                return '#006FCF';
            default:
                return '#007AFF';
        }
    };

    const getTitle = () => {
        switch (type) {
            case 'card':
                return `${cardBrand || 'Card'} •••• ${lastFour}`;
            case 'bank':
                return `${bankName} •••• ${lastFour}`;
            case 'wallet':
                return walletName;
            default:
                return 'Payment Method';
        }
    };

    const getSubtitle = () => {
        switch (type) {
            case 'card':
                return expiryDate ? `Expires ${expiryDate}` : '';
            case 'bank':
                return 'Bank Account';
            case 'wallet':
                return 'Digital Wallet';
            default:
                return '';
        }
    };

    return (
        <Card
            onPress={onPress}
            variant={selected ? 'outlined' : 'default'}
            style={[
                styles.card,
                selected && styles.cardSelected,
                style,
            ]}
        >
            <View style={styles.content}>
                <View style={[styles.iconContainer, { backgroundColor: `${getCardBrandColor()}15` }]}>
                    <Ionicons name={getIcon()} size={24} color={getCardBrandColor()} />
                </View>

                <View style={styles.info}>
                    <View style={styles.titleRow}>
                        <Text style={styles.title}>{getTitle()}</Text>
                        {isDefault && (
                            <View style={styles.defaultBadge}>
                                <Text style={styles.defaultText}>Default</Text>
                            </View>
                        )}
                    </View>
                    <Text style={styles.subtitle}>{getSubtitle()}</Text>
                </View>

                {selected && (
                    <View style={styles.checkmark}>
                        <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
                    </View>
                )}

                {onDelete && (
                    <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
                        <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                    </TouchableOpacity>
                )}
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: responsive.paddingMD,
    },
    cardSelected: {
        borderColor: '#007AFF',
        borderWidth: 2,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: wp(48),
        height: wp(48),
        borderRadius: responsive.radiusMD,
        alignItems: 'center',
        justifyContent: 'center',
    },
    info: {
        flex: 1,
        marginLeft: responsive.paddingMD,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: responsive.fontMD,
        fontWeight: '600',
        color: '#000',
    },
    defaultBadge: {
        backgroundColor: '#E3F2FD',
        paddingHorizontal: responsive.paddingSM,
        paddingVertical: 2,
        borderRadius: responsive.radiusSM,
        marginLeft: responsive.paddingSM,
    },
    defaultText: {
        fontSize: responsive.fontXS,
        color: '#007AFF',
        fontWeight: '500',
    },
    subtitle: {
        fontSize: responsive.fontSM,
        color: '#8E8E93',
        marginTop: 2,
    },
    checkmark: {
        marginLeft: responsive.paddingSM,
    },
    deleteButton: {
        padding: responsive.paddingSM,
        marginLeft: responsive.paddingSM,
    },
});

export default PaymentMethodCard;
