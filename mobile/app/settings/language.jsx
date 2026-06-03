import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Global, TickCircle } from 'iconsax-react-native';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';
import { wp, hp, fs } from '../utils/responsive';

export default function LanguageScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language, changeLanguage, languages } = useLanguage();

  const handleSelect = async (code) => {
    await changeLanguage(code);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={22} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('settings.language.title')}</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Icon + subtitle */}
        <View style={styles.iconWrap}>
          <View style={styles.iconCircle}>
            <Global size={32} color="#3B82F6" variant="Bold" />
          </View>
          <Text style={styles.selectTitle}>{t('settings.language.selectLanguage')}</Text>
          <Text style={styles.selectSubtitle}>{t('settings.language.subtitle')}</Text>
        </View>

        {/* Language options */}
        <View style={styles.optionsCard}>
          {languages.map((lang, idx) => {
            const isSelected = language === lang.code;
            const isLast = idx === languages.length - 1;

            return (
              <TouchableOpacity
                key={lang.code}
                style={[styles.option, !isLast && styles.optionBorder]}
                onPress={() => handleSelect(lang.code)}
                activeOpacity={0.7}
              >
                <View style={styles.optionLeft}>
                  <View style={[styles.flagCircle, isSelected && styles.flagCircleActive]}>
                    <Text style={styles.flagText}>{lang.code === 'en' ? '🇬🇧' : lang.code === 'si' ? '🇱🇰' : '🇮🇳'}</Text>
                  </View>
                  <View style={styles.optionLabels}>
                    <Text style={[styles.nativeLabel, isSelected && styles.nativeLabelActive]}>
                      {lang.nativeLabel}
                    </Text>
                    <Text style={styles.langLabel}>{lang.label}</Text>
                  </View>
                </View>

                {isSelected ? (
                  <TickCircle size={24} color="#3B82F6" variant="Bold" />
                ) : (
                  <View style={styles.uncheckedCircle} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.note}>
          {t('settings.language.changeSuccess')}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(16),
    paddingVertical: hp(14),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
  },
  headerTitle: {
    fontSize: fs(17),
    fontFamily: 'Roboto-Bold',
    color: '#1E293B',
  },

  content: {
    padding: wp(20),
    paddingTop: hp(28),
  },

  iconWrap: {
    alignItems: 'center',
    marginBottom: hp(32),
  },
  iconCircle: {
    width: wp(76),
    height: wp(76),
    borderRadius: wp(38),
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(16),
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  selectTitle: {
    fontSize: fs(20),
    fontFamily: 'Roboto-Bold',
    color: '#1E293B',
    marginBottom: 6,
  },
  selectSubtitle: {
    fontSize: fs(14),
    fontFamily: 'Roboto-Regular',
    color: '#64748B',
    textAlign: 'center',
  },

  optionsCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: hp(24),
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(20),
    paddingVertical: hp(18),
  },
  optionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: wp(14),
  },
  flagCircle: {
    width: wp(48),
    height: wp(48),
    borderRadius: wp(24),
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  flagCircleActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  flagText: {
    fontSize: fs(22),
  },
  optionLabels: {
    gap: 2,
  },
  nativeLabel: {
    fontSize: fs(16),
    fontFamily: 'Roboto-Medium',
    color: '#334155',
  },
  nativeLabelActive: {
    color: '#1D4ED8',
    fontFamily: 'Roboto-Bold',
  },
  langLabel: {
    fontSize: fs(13),
    fontFamily: 'Roboto-Regular',
    color: '#94A3B8',
  },
  uncheckedCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CBD5E1',
  },

  note: {
    textAlign: 'center',
    fontSize: fs(13),
    fontFamily: 'Roboto-Regular',
    color: '#94A3B8',
    paddingHorizontal: wp(16),
  },
});
