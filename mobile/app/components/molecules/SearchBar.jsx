import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SearchNormal1, CloseCircle, Setting4 } from 'iconsax-react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { hp } from '../../utils/responsive';

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
    const theme = useTheme();
    const styles = useStyles(theme);
    const [isFocused, setIsFocused] = useState(false);

    const handleClear = () => {
        onChangeText('');
        if (onClear) onClear();
    };

    return (
        <View style={[styles.container, style]}>
            <View style={[styles.searchContainer, isFocused && styles.searchContainerFocused]}>
                <SearchNormal1 size={18} color={theme.colors.textMuted} variant="Outline" />
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor={theme.colors.inputPlaceholder}
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
                    <TouchableOpacity onPress={handleClear} style={styles.clearButton} activeOpacity={0.7}>
                        <CloseCircle size={20} color={theme.colors.textMuted} variant="Bold" />
                    </TouchableOpacity>
                )}
            </View>

            {showFilter && (
                <TouchableOpacity style={styles.filterButton} onPress={onFilterPress} activeOpacity={0.85}>
                    <Setting4 size={22} color={theme.colors.primary} variant="Bold" />
                </TouchableOpacity>
            )}
        </View>
    );
};

const useStyles = (theme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.sm,
        },
        searchContainer: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.inputBackground,
            borderRadius: theme.radius.lg,
            paddingHorizontal: theme.spacing.lg,
            gap: theme.spacing.sm,
            minHeight: hp(50),
            borderWidth: 1.5,
            borderColor: theme.colors.inputBorder,
        },
        searchContainerFocused: {
            borderColor: theme.colors.primary,
            backgroundColor: theme.colors.surface,
        },
        input: {
            flex: 1,
            fontFamily: theme.fontFamily.regular,
            fontSize: theme.fontSize.md,
            color: theme.colors.textPrimary,
            paddingVertical: theme.spacing.md,
        },
        clearButton: {
            padding: theme.spacing.xs,
        },
        filterButton: {
            width: hp(50),
            height: hp(50),
            backgroundColor: theme.colors.primarySoft,
            borderRadius: theme.radius.lg,
            alignItems: 'center',
            justifyContent: 'center',
        },
    });

export default SearchBar;
