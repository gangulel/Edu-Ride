import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { responsive, wp, hp } from '../utils/responsive';

// Components
import { Card, Badge, Button } from '../components/atoms';
import { PaymentMethodCard, StatCard, EmptyState } from '../components/molecules';
import { Header, ParentBottomNav } from '../components/organisms';

export default function PaymentsScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('history');

    // Mock data
    const paymentMethods = [
        {
            id: 1,
            type: 'card',
            lastFour: '4242',
            expiryDate: '12/27',
            cardBrand: 'visa',
            isDefault: true,
        },
        {
            id: 2,
            type: 'card',
            lastFour: '5555',
            expiryDate: '08/26',
            cardBrand: 'mastercard',
            isDefault: false,
        },
    ];

    const transactions = [
        {
            id: 1,
            type: 'payment',
            description: 'Monthly Subscription - Kasun Perera',
            amount: 8500,
            date: '2026-01-01',
            status: 'completed',
            child: 'Kavindi',
        },
        {
            id: 2,
            type: 'payment',
            description: 'Monthly Subscription - Kasun Perera',
            amount: 8500,
            date: '2025-12-01',
            status: 'completed',
            child: 'Kavindi',
        },
        {
            id: 3,
            type: 'payment',
            description: 'Monthly Subscription - Kasun Perera',
            amount: 8500,
            date: '2025-11-01',
            status: 'completed',
            child: 'Kavindi',
        },
        {
            id: 4,
            type: 'refund',
            description: 'Partial Refund - Cancelled Service',
            amount: 4250,
            date: '2025-10-15',
            status: 'completed',
            child: 'Dineth',
        },
    ];

    const upcomingPayments = [
        {
            id: 1,
            driverName: 'Kasun Perera',
            amount: 8500,
            dueDate: '2026-02-01',
            child: 'Kavindi',
        },
    ];

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'success';
            case 'pending':
                return 'warning';
            case 'failed':
                return 'danger';
            default:
                return 'neutral';
        }
    };

    const renderTransaction = ({ item }) => (
        <Card style={styles.transactionCard}>
            <View style={styles.transactionHeader}>
                <View style={[
                    styles.transactionIcon,
                    { backgroundColor: item.type === 'refund' ? '#E8F8ED' : '#E3F2FD' }
                ]}>
                    <Ionicons
                        name={item.type === 'refund' ? 'arrow-down' : 'arrow-up'}
                        size={20}
                        color={item.type === 'refund' ? '#34C759' : '#007AFF'}
                    />
                </View>
                <View style={styles.transactionInfo}>
                    <Text style={styles.transactionDescription} numberOfLines={1}>
                        {item.description}
                    </Text>
                    <Text style={styles.transactionMeta}>
                        {formatDate(item.date)} • {item.child}
                    </Text>
                </View>
                <View style={styles.transactionAmount}>
                    <Text style={[
                        styles.amountText,
                        { color: item.type === 'refund' ? '#34C759' : '#000' }
                    ]}>
                        {item.type === 'refund' ? '+' : '-'}LKR {item.amount.toLocaleString()}
                    </Text>
                    <Badge label={item.status} variant={getStatusColor(item.status)} size="small" />
                </View>
            </View>
        </Card>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Payments" showBack />

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Summary Stats */}
                <View style={styles.statsSection}>
                    <View style={styles.statsRow}>
                        <StatCard
                            icon="wallet"
                            iconColor="#007AFF"
                            value="LKR 8,500"
                            label="Due This Month"
                            style={styles.statCard}
                        />
                        <StatCard
                            icon="trending-up"
                            iconColor="#34C759"
                            value="LKR 51,000"
                            label="Total This Year"
                            style={styles.statCard}
                        />
                    </View>
                </View>

                {/* Upcoming Payments */}
                {upcomingPayments.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Upcoming Payments</Text>
                        {upcomingPayments.map(payment => (
                            <Card key={payment.id} style={styles.upcomingCard}>
                                <View style={styles.upcomingContent}>
                                    <View style={styles.upcomingInfo}>
                                        <Text style={styles.upcomingDriver}>{payment.driverName}</Text>
                                        <Text style={styles.upcomingMeta}>
                                            Due: {formatDate(payment.dueDate)} • {payment.child}
                                        </Text>
                                    </View>
                                    <View style={styles.upcomingAmount}>
                                        <Text style={styles.upcomingPrice}>
                                            LKR {payment.amount.toLocaleString()}
                                        </Text>
                                    </View>
                                </View>
                                <Button
                                    title="Pay Now"
                                    variant="primary"
                                    fullWidth
                                    style={styles.payButton}
                                />
                            </Card>
                        ))}
                    </View>
                )}

                {/* Payment Methods */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Payment Methods</Text>
                        <TouchableOpacity onPress={() => router.push('/parent/add-payment')}>
                            <Text style={styles.addText}>+ Add</Text>
                        </TouchableOpacity>
                    </View>
                    {paymentMethods.map(method => (
                        <PaymentMethodCard
                            key={method.id}
                            method={method}
                            onPress={() => { }}
                            onDelete={() => { }}
                        />
                    ))}
                </View>

                {/* Transaction History */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Transaction History</Text>
                        <TouchableOpacity>
                            <Text style={styles.filterText}>Filter</Text>
                        </TouchableOpacity>
                    </View>

                    {transactions.length > 0 ? (
                        transactions.map(transaction => renderTransaction({ item: transaction }))
                    ) : (
                        <EmptyState
                            icon="receipt-outline"
                            title="No transactions"
                            message="Your payment history will appear here."
                        />
                    )}
                </View>

                <View style={{ height: hp(100) }} />
            </ScrollView>

            <ParentBottomNav />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
    },
    scrollView: {
        flex: 1,
    },
    statsSection: {
        padding: responsive.paddingLG,
    },
    statsRow: {
        flexDirection: 'row',
        gap: responsive.paddingMD,
    },
    statCard: {
        flex: 1,
    },
    section: {
        paddingHorizontal: responsive.paddingLG,
        marginBottom: responsive.paddingLG,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: responsive.paddingMD,
    },
    sectionTitle: {
        fontSize: responsive.fontXL,
        fontWeight: '600',
        color: '#000',
    },
    addText: {
        fontSize: responsive.fontMD,
        color: '#007AFF',
        fontWeight: '600',
    },
    filterText: {
        fontSize: responsive.fontMD,
        color: '#007AFF',
    },
    upcomingCard: {
        marginBottom: responsive.paddingMD,
    },
    upcomingContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: responsive.paddingMD,
    },
    upcomingInfo: {},
    upcomingDriver: {
        fontSize: responsive.fontLG,
        fontWeight: '600',
        color: '#000',
    },
    upcomingMeta: {
        fontSize: responsive.fontSM,
        color: '#8E8E93',
        marginTop: 2,
    },
    upcomingAmount: {},
    upcomingPrice: {
        fontSize: responsive.fontXL,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    payButton: {
        marginTop: responsive.paddingSM,
    },
    transactionCard: {
        marginBottom: responsive.paddingSM,
    },
    transactionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    transactionIcon: {
        width: wp(40),
        height: wp(40),
        borderRadius: wp(20),
        alignItems: 'center',
        justifyContent: 'center',
    },
    transactionInfo: {
        flex: 1,
        marginLeft: responsive.paddingMD,
    },
    transactionDescription: {
        fontSize: responsive.fontMD,
        fontWeight: '500',
        color: '#000',
    },
    transactionMeta: {
        fontSize: responsive.fontSM,
        color: '#8E8E93',
        marginTop: 2,
    },
    transactionAmount: {
        alignItems: 'flex-end',
    },
    amountText: {
        fontSize: responsive.fontMD,
        fontWeight: '600',
        marginBottom: 4,
    },
});
