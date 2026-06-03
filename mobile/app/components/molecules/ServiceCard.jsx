import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Location, Bus, Profile2User, ShieldTick } from 'iconsax-react-native';
import Avatar from '../atoms/Avatar';
import Badge from '../atoms/Badge';
import RatingStars from '../atoms/RatingStars';
import Card from '../atoms/Card';
import { useTheme } from '../../contexts/ThemeContext';

const ServiceCard = ({ driver, onPress, variant = 'default', style }) => {
    const theme = useTheme();
    const styles = useStyles(theme);

    const {
        name,
        photo,
        initials,
        verified = false,
        rating = 0,
        reviewCount,
        totalReviews,
        monthlyFee,
        areasServed,
        areas,
        availableSeats,
        seats,
        vehicleModel,
    } = driver;

    const reviews = reviewCount ?? totalReviews ?? 0;
    const serviceAreas = areasServed || areas || [];
    const seatCount = availableSeats ?? seats ?? 0;

    if (variant === 'compact') {
        return (
            <Card onPress={onPress} style={[styles.compactCard, style]} variant="elevated">
                <View style={styles.compactContent}>
                    <Avatar source={photo} name={name} initials={initials} size="medium" verified={verified} />
                    <View style={styles.compactInfo}>
                        <Text style={styles.driverName} numberOfLines={1}>{name}</Text>
                        <View style={styles.ratingRow}>
                            <RatingStars rating={rating} size="small" />
                            <Text style={styles.reviewCount}>({reviews})</Text>
                        </View>
                        <Text style={styles.route} numberOfLines={1}>{serviceAreas.slice(0, 2).join(' • ')}</Text>
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
        <Card onPress={onPress} style={[styles.card, style]} variant="elevated">
            <View style={styles.header}>
                <Avatar source={photo} name={name} initials={initials} size="large" verified={verified} />
                <View style={styles.headerInfo}>
                    <View style={styles.nameRow}>
                        <Text style={styles.driverName} numberOfLines={1}>{name}</Text>
                        {verified && <Badge label="Verified" variant="success" tone="soft" size="small" />}
                    </View>
                    <View style={styles.ratingRow}>
                        <RatingStars rating={rating} size="small" />
                        <Text style={styles.rating}>{rating.toFixed(1)}</Text>
                        <Text style={styles.reviewCount}>({reviews} reviews)</Text>
                    </View>
                </View>
            </View>

            <View style={styles.routeSection}>
                {serviceAreas.length > 0 && (
                    <View style={styles.routeRow}>
                        <Location size={16} color={theme.colors.primary} variant="Bold" />
                        <Text style={styles.routeText} numberOfLines={2}>{serviceAreas.join(' • ')}</Text>
                    </View>
                )}
                {vehicleModel && (
                    <View style={styles.routeRow}>
                        <Bus size={16} color={theme.colors.textMuted} variant="Bold" />
                        <Text style={styles.vehicleText}>{vehicleModel}</Text>
                    </View>
                )}
            </View>

            <View style={styles.footer}>
                <View style={styles.seatsContainer}>
                    <Profile2User size={16} color={theme.colors.textMuted} variant="Bold" />
                    <Text style={styles.seatsText}>{seatCount} seats</Text>
                </View>
                <View style={styles.priceContainerFull}>
                    <Text style={styles.priceFull}>LKR {monthlyFee?.toLocaleString()}</Text>
                    <Text style={styles.pricePeriod}>/mo</Text>
                </View>
            </View>
        </Card>
    );
};

const useStyles = (theme) =>
    StyleSheet.create({
        card: {
            marginBottom: theme.spacing.md,
        },
        compactCard: {
            marginBottom: theme.spacing.sm,
        },
        compactContent: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        compactInfo: {
            flex: 1,
            marginLeft: theme.spacing.md,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: theme.spacing.md,
        },
        headerInfo: {
            flex: 1,
            marginLeft: theme.spacing.md,
        },
        nameRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.sm,
            flexWrap: 'wrap',
        },
        driverName: {
            fontFamily: theme.fontFamily.bold,
            fontSize: theme.fontSize.lg,
            color: theme.colors.textPrimary,
            flex: 1,
        },
        ratingRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: theme.spacing.xs,
            gap: theme.spacing.xs,
        },
        rating: {
            fontFamily: theme.fontFamily.medium,
            fontSize: theme.fontSize.sm,
            color: theme.colors.textPrimary,
        },
        reviewCount: {
            fontFamily: theme.fontFamily.regular,
            fontSize: theme.fontSize.xs,
            color: theme.colors.textMuted,
        },
        routeSection: {
            marginBottom: theme.spacing.md,
            gap: theme.spacing.sm,
        },
        routeRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.sm,
        },
        routeText: {
            fontFamily: theme.fontFamily.regular,
            fontSize: theme.fontSize.sm,
            color: theme.colors.textSecondary,
            flex: 1,
        },
        vehicleText: {
            fontFamily: theme.fontFamily.regular,
            fontSize: theme.fontSize.sm,
            color: theme.colors.textMuted,
        },
        footer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: theme.spacing.md,
            borderTopWidth: 1,
            borderTopColor: theme.colors.divider,
        },
        seatsContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.xs,
        },
        seatsText: {
            fontFamily: theme.fontFamily.regular,
            fontSize: theme.fontSize.sm,
            color: theme.colors.textMuted,
        },
        priceContainer: {
            alignItems: 'flex-end',
        },
        priceContainerFull: {
            flexDirection: 'row',
            alignItems: 'baseline',
        },
        priceLabel: {
            fontFamily: theme.fontFamily.regular,
            fontSize: theme.fontSize.xs,
            color: theme.colors.textMuted,
        },
        price: {
            fontFamily: theme.fontFamily.bold,
            fontSize: theme.fontSize.md,
            color: theme.colors.primary,
        },
        priceFull: {
            fontFamily: theme.fontFamily.bold,
            fontSize: theme.fontSize.xl,
            color: theme.colors.primary,
        },
        pricePeriod: {
            fontFamily: theme.fontFamily.regular,
            fontSize: theme.fontSize.sm,
            color: theme.colors.textMuted,
            marginLeft: 2,
        },
        route: {
            fontFamily: theme.fontFamily.regular,
            fontSize: theme.fontSize.xs,
            color: theme.colors.textMuted,
            marginTop: 2,
        },
    });

export default ServiceCard;
