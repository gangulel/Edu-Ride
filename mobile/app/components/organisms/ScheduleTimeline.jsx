import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../atoms/Card';
import { responsive, wp } from '../../utils/responsive';

const ScheduleTimeline = ({
    stops = [],
    school,
    schoolArrival,
    schoolDeparture,
    type = 'morning', // morning, afternoon
    style,
}) => {
    return (
        <Card style={[styles.container, style]}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    {type === 'morning' ? 'Morning Pickup' : 'Afternoon Drop-off'}
                </Text>
                <Text style={styles.subtitle}>
                    {type === 'morning' ? `Arrives at ${schoolArrival}` : `Departs at ${schoolDeparture}`}
                </Text>
            </View>

            <View style={styles.timeline}>
                {/* Start Point */}
                <View style={styles.timelineItem}>
                    <View style={styles.timelineIconContainer}>
                        <View style={[styles.timelineIcon, styles.timelineIconStart]}>
                            <Ionicons name="flag" size={14} color="#fff" />
                        </View>
                        {stops.length > 0 && <View style={styles.timelineLine} />}
                    </View>
                    <View style={styles.timelineContent}>
                        <Text style={styles.stopName}>Route Start</Text>
                        <Text style={styles.stopTime}>
                            {type === 'morning' ? stops[0]?.pickupTime : stops[0]?.dropoffTime}
                        </Text>
                    </View>
                </View>

                {/* Stops */}
                {stops.map((stop, index) => (
                    <View key={stop.id || index} style={styles.timelineItem}>
                        <View style={styles.timelineIconContainer}>
                            <View style={styles.timelineIcon}>
                                <Ionicons name="location" size={14} color="#007AFF" />
                            </View>
                            {index < stops.length - 1 && <View style={styles.timelineLine} />}
                            {index === stops.length - 1 && <View style={styles.timelineLine} />}
                        </View>
                        <View style={styles.timelineContent}>
                            <Text style={styles.stopName}>{stop.location}</Text>
                            <Text style={styles.stopTime}>
                                {type === 'morning' ? stop.pickupTime : stop.dropoffTime}
                            </Text>
                        </View>
                    </View>
                ))}

                {/* School */}
                <View style={styles.timelineItem}>
                    <View style={styles.timelineIconContainer}>
                        <View style={[styles.timelineIcon, styles.timelineIconEnd]}>
                            <Ionicons name="school" size={14} color="#fff" />
                        </View>
                    </View>
                    <View style={styles.timelineContent}>
                        <Text style={styles.stopName}>{school}</Text>
                        <Text style={styles.stopTime}>
                            {type === 'morning' ? `Arrival: ${schoolArrival}` : `Departure: ${schoolDeparture}`}
                        </Text>
                    </View>
                </View>
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: responsive.paddingMD,
    },
    header: {
        marginBottom: responsive.paddingMD,
        paddingBottom: responsive.paddingMD,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
    },
    title: {
        fontSize: responsive.fontLG,
        fontWeight: '600',
        color: '#000',
    },
    subtitle: {
        fontSize: responsive.fontSM,
        color: '#8E8E93',
        marginTop: 2,
    },
    timeline: {},
    timelineItem: {
        flexDirection: 'row',
        marginBottom: responsive.paddingSM,
    },
    timelineIconContainer: {
        alignItems: 'center',
        marginRight: responsive.paddingMD,
        width: wp(32),
    },
    timelineIcon: {
        width: wp(28),
        height: wp(28),
        borderRadius: wp(14),
        backgroundColor: '#E3F2FD',
        alignItems: 'center',
        justifyContent: 'center',
    },
    timelineIconStart: {
        backgroundColor: '#34C759',
    },
    timelineIconEnd: {
        backgroundColor: '#FF9500',
    },
    timelineLine: {
        width: 2,
        flex: 1,
        backgroundColor: '#E5E5EA',
        marginVertical: 4,
        minHeight: 20,
    },
    timelineContent: {
        flex: 1,
        paddingTop: 2,
    },
    stopName: {
        fontSize: responsive.fontMD,
        fontWeight: '500',
        color: '#000',
    },
    stopTime: {
        fontSize: responsive.fontSM,
        color: '#8E8E93',
        marginTop: 2,
    },
});

export default ScheduleTimeline;
