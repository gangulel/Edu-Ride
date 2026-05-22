import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Avatar from '../atoms/Avatar';
import Badge from '../atoms/Badge';
import Card from '../atoms/Card';
import { responsive, wp } from '../../utils/responsive';

const ChildCard = ({
    child,
    onPress,
    onEdit,
    showSubscription = true,
    style,
}) => {
    const {
        name,
        photo,
        grade,
        school,
        age,
        subscription,
    } = child;

    return (
        <Card onPress={onPress} style={[styles.card, style]}>
            <View style={styles.content}>
                <Avatar source={photo} name={name} size="large" />

                <View style={styles.info}>
                    <Text style={styles.name}>{name}</Text>
                    <View style={styles.detailsRow}>
                        <View style={styles.detailItem}>
                            <Ionicons name="school-outline" size={14} color="#8E8E93" />
                            <Text style={styles.detailText}>{school}</Text>
                        </View>
                    </View>
                    <View style={styles.detailsRow}>
                        <View style={styles.detailItem}>
                            <Ionicons name="book-outline" size={14} color="#8E8E93" />
                            <Text style={styles.detailText}>Grade {grade}</Text>
                        </View>
                        {age && (
                            <View style={styles.detailItem}>
                                <Ionicons name="person-outline" size={14} color="#8E8E93" />
                                <Text style={styles.detailText}>{age} years</Text>
                            </View>
                        )}
                    </View>
                </View>

                {onEdit && (
                    <TouchableOpacity style={styles.editButton} onPress={onEdit}>
                        <Ionicons name="create-outline" size={20} color="#007AFF" />
                    </TouchableOpacity>
                )}
            </View>

            {showSubscription && subscription && (
                <View style={styles.subscriptionContainer}>
                    <View style={styles.subscriptionInfo}>
                        <Ionicons name="bus" size={16} color="#007AFF" />
                        <Text style={styles.subscriptionText}>{subscription.driverName}</Text>
                    </View>
                    <Badge
                        label={subscription.status === 'active' ? 'Active' : subscription.status}
                        variant={subscription.status === 'active' ? 'success' : 'warning'}
                        size="small"
                    />
                </View>
            )}

            {showSubscription && !subscription && (
                <TouchableOpacity style={styles.addSubscriptionButton}>
                    <Ionicons name="add-circle-outline" size={18} color="#007AFF" />
                    <Text style={styles.addSubscriptionText}>Find Bus Service</Text>
                </TouchableOpacity>
            )}
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: responsive.paddingMD,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    info: {
        flex: 1,
        marginLeft: responsive.paddingMD,
    },
    name: {
        fontSize: responsive.fontLG,
        fontWeight: '600',
        color: '#000',
        marginBottom: responsive.paddingXS,
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: responsive.paddingXS,
        flexWrap: 'wrap',
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: responsive.paddingMD,
    },
    detailText: {
        fontSize: responsive.fontSM,
        color: '#8E8E93',
        marginLeft: 4,
    },
    editButton: {
        padding: responsive.paddingSM,
    },
    subscriptionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: responsive.paddingMD,
        paddingTop: responsive.paddingMD,
        borderTopWidth: 1,
        borderTopColor: '#E5E5EA',
    },
    subscriptionInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    subscriptionText: {
        fontSize: responsive.fontMD,
        color: '#000',
        marginLeft: responsive.paddingSM,
    },
    addSubscriptionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: responsive.paddingMD,
        paddingTop: responsive.paddingMD,
        borderTopWidth: 1,
        borderTopColor: '#E5E5EA',
    },
    addSubscriptionText: {
        fontSize: responsive.fontMD,
        color: '#007AFF',
        fontWeight: '500',
        marginLeft: responsive.paddingSM,
    },
});

export default ChildCard;
