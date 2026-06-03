import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SearchNormal1, CloseCircle } from 'iconsax-react-native';
import { colors, typography, spacing, radii, fs } from '../../theme';

const SearchField = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  onClear,
  onSubmitEditing,
  style,
  autoFocus = false,
}) => {
  return (
    <View style={[styles.wrap, style]}>
      <SearchNormal1 size={fs(18)} color={colors.textSecondary} variant="Linear" />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        returnKeyType="search"
        onSubmitEditing={onSubmitEditing}
        autoFocus={autoFocus}
      />
      {value?.length > 0 ? (
        <TouchableOpacity onPress={onClear ?? (() => onChangeText?.(''))} hitSlop={6}>
          <CloseCircle size={fs(18)} color={colors.textTertiary} variant="Bold" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    fontSize: typography.size.md,
    color: colors.textPrimary,
    padding: 0,
  },
});

export default SearchField;
