import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RatingStars from '../atoms/RatingStars';
import Avatar from '../atoms/Avatar';
import Card from '../atoms/Card';
import { responsive } from '../../utils/responsive';

const ReviewCard = ({
    review,
    showDriverResponse = true,
    style,
}) => {
    const {
        author,
        rating = 0,
        date,
        comment,
        driverResponse,
        ratingCategories = {},
    } = review;

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <Card style={[styles.card, style]}>
            {/* Header */}
            <View style={styles.header}>
                <Avatar source={author?.photo} name={author?.name} size="medium" />
                <View style={styles.headerInfo}>
                    <Text style={styles.authorName}>{author?.name || 'Anonymous'}</Text>
                    <View style={styles.ratingRow}>
                        <RatingStars rating={rating} size="small" />
                        <Text style={styles.date}>{formatDate(date)}</Text>
                    </View>
                </View>
            </View>

            {/* Rating Categories (if available) */}
            {Object.keys(ratingCategories).length > 0 && (
                <View style={styles.categoriesContainer}>
                    {Object.entries(ratingCategories).map(([category, value]) => (
                        <View key={category} style={styles.categoryItem}>
                            <Text style={styles.categoryLabel}>{category}</Text>
                            <RatingStars rating={value} size="small" maxRating={5} />
                        </View>
                    ))}
                </View>
            )}

            {/* Comment */}
            {comment && (
                <Text style={styles.comment}>{comment}</Text>
            )}

            {/* Driver Response */}
            {showDriverResponse && driverResponse && (
                <View style={styles.responseContainer}>
                    <View style={styles.responseHeader}>
                        <Text style={styles.responseLabel}>Driver's Response</Text>
                    </View>
                    <Text style={styles.responseText}>{driverResponse.text}</Text>
                    <Text style={styles.responseDate}>{formatDate(driverResponse.date)}</Text>
                </View>
            )}
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: responsive.paddingMD,
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
    authorName: {
        fontSize: responsive.fontMD,
        fontWeight: '600',
        color: '#000',
        marginBottom: responsive.paddingXS,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    date: {
        fontSize: responsive.fontSM,
        color: '#8E8E93',
    },
    categoriesContainer: {
        backgroundColor: '#F9F9FB',
        borderRadius: responsive.radiusMD,
        padding: responsive.paddingMD,
        marginBottom: responsive.paddingMD,
    },
    categoryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: responsive.paddingSM,
    },
    categoryLabel: {
        fontSize: responsive.fontSM,
        color: '#8E8E93',
    },
    comment: {
        fontSize: responsive.fontMD,
        color: '#000',
        lineHeight: responsive.fontMD * 1.5,
    },
    responseContainer: {
        marginTop: responsive.paddingMD,
        marginLeft: responsive.paddingMD,
        paddingLeft: responsive.paddingMD,
        borderLeftWidth: 2,
        borderLeftColor: '#007AFF',
    },
    responseHeader: {
        marginBottom: responsive.paddingSM,
    },
    responseLabel: {
        fontSize: responsive.fontSM,
        fontWeight: '600',
        color: '#007AFF',
    },
    responseText: {
        fontSize: responsive.fontMD,
        color: '#000',
        lineHeight: responsive.fontMD * 1.5,
    },
    responseDate: {
        fontSize: responsive.fontSM,
        color: '#8E8E93',
        marginTop: responsive.paddingSM,
    },
});

export default ReviewCard;
