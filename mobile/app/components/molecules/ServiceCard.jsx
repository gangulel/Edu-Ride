import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Avatar from '../atoms/Avatar';
import Badge from '../atoms/Badge';
import RatingStars from '../atoms/RatingStars';
import Card from '../atoms/Card';
import { responsive, wp } from '../../utils/responsive';

const ServiceCard = ({
    driver,
    onPress,
    variant = 'default', // default, compact
    style,
}) => {
    const {
        name,
        photo,
        verified = false,
        rating = 0,
        reviewCount = 0,
        monthlyFee,
        areasServed = [],
        availableSeats = 0,
        totalSeats = 0,
        school,
    } = driver;

    if (variant === 'compact') {
        return (
            <Card onPress={onPress} style={[styles.compactCard, style]}>
                <View style={styles.compactContent}>
                    <Avatar source={photo} name={name} size="medium" verified={verified} />
                    <View style={styles.compactInfo}>
                        <Text style={styles.driverName} numberOfLines={1}>{name}</Text>
                        <View style={styles.ratingRow}>
                            <RatingStars rating={rating} size="small" />
                            <Text style={styles.reviewCount}>({reviewCount})</Text>
                        </View>
                        <Text style={styles.route} numberOfLines={1}>
                            {areasServed.slice(0, 2).join(' → ')}
                        </Text>
                    </View>
                    <View style={styles.priceContainer}>
                        <Text style={styles.priceLabel}>from</Text>
                        <Text style={styles.price}>LKR {monthlyFee?.toLocaleString()}</Text>
                        <Text style={styles.priceLabel}>/month</Text>
                    </View>
                </View>
            </Card>
        );
    }

    return (
        <Card onPress={onPress} style={[styles.card, style]}>
            {/* Header */}
            <View style={styles.header}>
                <Avatar source={photo} name={name} size="large" verified={verified} />
                <View style={styles.headerInfo}>
                    <View style={styles.nameRow}>
                        <Text style={styles.driverName} numberOfLines={1}>{name}</Text>
                        {verified && (
                            <Badge label="Verified" variant="success" size="small" />
                        )}
                    </View>
                    <View style={styles.ratingRow}>
                        <RatingStars rating={rating} size="small" />
                        <Text style={styles.rating}>{rating.toFixed(1)}</Text>
                        <Text style={styles.reviewCount}>({reviewCount} reviews)</Text>
                    </View>
                </View>
            </View>

            {/* Route Info */}
            <View style={styles.routeSection}>
                <View style={styles.routeRow}>
                    <Ionicons name="location" size={18} color="#007AFF" />
                    <Text style={styles.routeText} numberOfLines={2}>
                        {areasServed.join(' → ')}
                    </Text>
                </View>
                {school && (
                    <View style={styles.routeRow}>
                        <Ionicons name="school" size={18} color="#FF9500" />
                        <Text style={styles.schoolText}>{school}</Text>
                    </View>
                )}
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <View style={styles.seatsContainer}>
                    <Ionicons name="people" size={18} color="#8E8E93" />
                    <Text style={styles.seatsText}>
                        {availableSeats} seats available
                    </Text>
                </View>
                <View style={styles.priceContainerFull}>
                    <Text style={styles.priceFull}>LKR {monthlyFee?.toLocaleString()}</Text>
                    <Text style={styles.pricePeriod}>/month</Text>
                </View>
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: responsive.paddingMD,
    },
    compactCard: {
        marginBottom: responsive.paddingSM,
    },
    compactContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    compactInfo: {
        flex: 1,
        marginLeft: responsive.paddingMD,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: responsive.paddingMD,
    },
    headerInfo: {
        flex: 1,
        marginLeft: responsive.paddingMD,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: responsive.paddingSM,
        flexWrap: 'wrap',
    },
    driverName: {
        fontSize: responsive.fontLG,
        fontWeight: '600',
        color: '#000',
        flex: 1,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: responsive.paddingXS,
    },
    rating: {
        fontSize: responsive.fontMD,
        fontWeight: '600',
        color: '#000',
        marginLeft: responsive.paddingSM,
    },
    reviewCount: {
        fontSize: responsive.fontSM,
        color: '#8E8E93',
        marginLeft: responsive.paddingXS,
    },
    routeSection: {
        marginBottom: responsive.paddingMD,
    },
    routeRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: responsive.paddingSM,
    },
    routeText: {
        fontSize: responsive.fontMD,
        color: '#000',
        marginLeft: responsive.paddingSM,
        flex: 1,
    },
    schoolText: {
        fontSize: responsive.fontMD,
        color: '#000',
        marginLeft: responsive.paddingSM,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: responsive.paddingMD,
        borderTopWidth: 1,
        borderTopColor: '#E5E5EA',
    },
    seatsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    seatsText: {
        fontSize: responsive.fontSM,
        color: '#8E8E93',
        marginLeft: responsive.paddingSM,
    },
    priceContainer: {
        alignItems: 'flex-end',
    },
    priceContainerFull: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    priceLabel: {
        fontSize: responsive.fontXS,
        color: '#8E8E93',
    },
    price: {
        fontSize: responsive.fontMD,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    priceFull: {
        fontSize: responsive.fontXL,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    pricePeriod: {
        fontSize: responsive.fontSM,
        color: '#8E8E93',
        marginLeft: 2,
    },
    route: {
        fontSize: responsive.fontSM,
        color: '#8E8E93',
        marginTop: 2,
    },
});

export default ServiceCard;
