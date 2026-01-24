import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { responsive, hp } from '../../utils/responsive';

const SearchBar = ({
    placeholder = 'Search...',
    value,
    onChangeText,
    onSearch,
    onClear,
    showFilter = false,
    onFilterPress,
    autoFocus = false,
    style,
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleClear = () => {
        onChangeText('');
        if (onClear) onClear();
    };

    return (
        <View style={[styles.container, style]}>
            <View style={[styles.searchContainer, isFocused && styles.searchContainerFocused]}>
                <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />

                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor="#C7C7CC"
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onSubmitEditing={onSearch}
                    returnKeyType="search"
                    autoFocus={autoFocus}
                    autoCorrect={false}
                />

                {value?.length > 0 && (
                    <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
                        <Ionicons name="close-circle" size={20} color="#8E8E93" />
                    </TouchableOpacity>
                )}
            </View>

            {showFilter && (
                <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
                    <Ionicons name="options-outline" size={24} color="#007AFF" />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: responsive.paddingSM,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F2F2F7',
        borderRadius: responsive.radiusMD,
        paddingHorizontal: responsive.paddingMD,
        minHeight: hp(48),
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    searchContainerFocused: {
        borderColor: '#007AFF',
        backgroundColor: '#fff',
    },
    searchIcon: {
        marginRight: responsive.paddingSM,
    },
    input: {
        flex: 1,
        fontSize: responsive.fontMD,
        color: '#000',
        paddingVertical: responsive.paddingMD,
    },
    clearButton: {
        padding: responsive.paddingXS,
    },
    filterButton: {
        width: hp(48),
        height: hp(48),
        backgroundColor: '#E3F2FD',
        borderRadius: responsive.radiusMD,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default SearchBar;
