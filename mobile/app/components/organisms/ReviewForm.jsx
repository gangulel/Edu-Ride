import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import RatingStars from '../atoms/RatingStars';
import Card from '../atoms/Card';
import { responsive } from '../../utils/responsive';

const ReviewForm = ({
    driver,
    onSubmit,
    loading = false,
    style,
}) => {
    const [ratings, setRatings] = useState({
        overall: 0,
        punctuality: 0,
        cleanliness: 0,
        professionalism: 0,
        safety: 0,
    });
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');

    const updateRating = (category, value) => {
        setRatings(prev => ({ ...prev, [category]: value }));
        setError('');
    };

    const validate = () => {
        if (ratings.overall === 0) {
            setError('Please provide an overall rating');
            return false;
        }
        return true;
    };

    const handleSubmit = () => {
        if (validate()) {
            onSubmit({ ratings, comment });
        }
    };

    const ratingCategories = [
        { key: 'overall', label: 'Overall Service', required: true },
        { key: 'punctuality', label: 'Punctuality' },
        { key: 'cleanliness', label: 'Vehicle Cleanliness' },
        { key: 'professionalism', label: 'Driver Professionalism' },
        { key: 'safety', label: 'Child Safety' },
    ];

    return (
        <View style={[styles.container, style]}>
            {/* Driver Info */}
            <Card style={styles.driverCard}>
                <Text style={styles.reviewTitle}>Rate your experience with</Text>
                <Text style={styles.driverName}>{driver?.name}</Text>
            </Card>

            {/* Rating Categories */}
            <View style={styles.ratingsSection}>
                {ratingCategories.map((category) => (
                    <View key={category.key} style={styles.ratingRow}>
                        <View style={styles.ratingLabel}>
                            <Text style={styles.categoryText}>{category.label}</Text>
                            {category.required && <Text style={styles.required}>*</Text>}
                        </View>
                        <RatingStars
                            rating={ratings[category.key]}
                            onRatingChange={(value) => updateRating(category.key, value)}
                            interactive
                            size="medium"
                        />
                    </View>
                ))}
            </View>

            {/* Comment */}
            <View style={styles.commentSection}>
                <Input
                    label="Your Review (Optional)"
                    placeholder="Share your experience with this service..."
                    value={comment}
                    onChangeText={setComment}
                    multiline
                    numberOfLines={4}
                />
                <Text style={styles.charCount}>{comment.length}/500</Text>
            </View>

            {/* Error Message */}
            {error && <Text style={styles.errorText}>{error}</Text>}

            {/* Submit */}
            <Button
                title="Submit Review"
                onPress={handleSubmit}
                loading={loading}
                fullWidth
                size="large"
                disabled={ratings.overall === 0}
            />

            <Text style={styles.disclaimer}>
                Your review will be visible to other parents and will help improve service quality.
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {},
    driverCard: {
        alignItems: 'center',
        marginBottom: responsive.paddingLG,
    },
    reviewTitle: {
        fontSize: responsive.fontMD,
        color: '#8E8E93',
    },
    driverName: {
        fontSize: responsive.fontXL,
        fontWeight: '600',
        color: '#000',
        marginTop: responsive.paddingSM,
    },
    ratingsSection: {
        backgroundColor: '#F9F9FB',
        borderRadius: responsive.radiusLG,
        padding: responsive.paddingLG,
        marginBottom: responsive.paddingLG,
    },
    ratingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: responsive.paddingMD,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
    },
    ratingLabel: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    categoryText: {
        fontSize: responsive.fontMD,
        color: '#000',
    },
    required: {
        fontSize: responsive.fontMD,
        color: '#FF3B30',
        marginLeft: 2,
    },
    commentSection: {
        marginBottom: responsive.paddingLG,
    },
    charCount: {
        fontSize: responsive.fontSM,
        color: '#8E8E93',
        textAlign: 'right',
        marginTop: responsive.paddingXS,
    },
    errorText: {
        fontSize: responsive.fontMD,
        color: '#FF3B30',
        textAlign: 'center',
        marginBottom: responsive.paddingMD,
    },
    disclaimer: {
        fontSize: responsive.fontSM,
        color: '#8E8E93',
        textAlign: 'center',
        marginTop: responsive.paddingMD,
        lineHeight: responsive.fontSM * 1.5,
    },
});

export default ReviewForm;
