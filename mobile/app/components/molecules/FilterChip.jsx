import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { responsive, wp, hp } from '../../utils/responsive';

const FilterChip = ({
    label,
    selected = false,
    onPress,
    icon,
    count,
    style,
}) => {
    return (
        <TouchableOpacity
            style={[
                styles.chip,
                selected && styles.chipSelected,
                style,
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {icon && (
                <Ionicons
                    name={icon}
                    size={16}
                    color={selected ? '#fff' : '#8E8E93'}
                    style={styles.icon}
                />
            )}
            <Text style={[styles.label, selected && styles.labelSelected]}>
                {label}
            </Text>
            {count !== undefined && count > 0 && (
                <Text style={[styles.count, selected && styles.countSelected]}>
                    {count}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: responsive.paddingMD,
        paddingVertical: responsive.paddingSM,
        backgroundColor: '#F2F2F7',
        borderRadius: responsive.radiusFull,
        marginRight: responsive.paddingSM,
        borderWidth: 1,
        borderColor: '#E5E5EA',
    },
    chipSelected: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    icon: {
        marginRight: 4,
    },
    label: {
        fontSize: responsive.fontSM,
        color: '#000',
        fontWeight: '500',
    },
    labelSelected: {
        color: '#fff',
    },
    count: {
        fontSize: responsive.fontXS,
        color: '#8E8E93',
        marginLeft: 4,
        backgroundColor: '#E5E5EA',
        paddingHorizontal: 6,
        paddingVertical: 1,
        borderRadius: 10,
        overflow: 'hidden',
    },
    countSelected: {
        color: '#007AFF',
        backgroundColor: '#fff',
    },
});

export default FilterChip;
