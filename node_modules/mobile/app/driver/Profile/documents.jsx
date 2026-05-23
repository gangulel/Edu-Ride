import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowRight2,
  Calendar,
  Camera,
  Card as CardIcon,
  CloseCircle,
  DocumentText,
  DocumentUpload,
  ShieldTick,
  TickCircle,
  Warning2,
  SecuritySafe,
  TaskSquare,
} from 'iconsax-react-native';

import ScreenContainer from '../../components/driver/ScreenContainer';
import PageHeader from '../../components/driver/PageHeader';
import Card from '../../components/driver/Card';
import Badge from '../../components/driver/Badge';
import PrimaryButton from '../../components/driver/PrimaryButton';
import {
  colors,
  spacing,
  typography,
  radii,
  shadows,
  fs,
} from '../../theme';
import { getDocuments } from '../../../services/mock/driver';

const STATUS_META = {
  verified: { tone: 'success', label: 'Verified', icon: TickCircle, color: colors.success, surface: colors.successSurface },
  expiring: { tone: 'warning', label: 'Expiring soon', icon: Warning2, color: colors.warning, surface: colors.warningSurface },
  expired: { tone: 'danger', label: 'Expired', icon: CloseCircle, color: colors.danger, surface: colors.dangerSurface },
  pending: { tone: 'neutral', label: 'Upload required', icon: DocumentUpload, color: colors.textSecondary, surface: colors.surfaceMuted },
};

const ICON_FOR_TYPE = {
  card: CardIcon,
  document: DocumentText,
  shield: ShieldTick,
  security: SecuritySafe,
  task: TaskSquare,
};

export default function Documents() {
  const router = useRouter();
  const [docs] = useState(() => getDocuments());

  const verifiedCount = docs.filter((d) => d.status === 'verified').length;
  const issuesCount = docs.filter((d) => d.status !== 'verified').length;

  const handleUpload = (docName) => {
    Alert.alert('Upload Document', `How would you like to upload ${docName}?`, [
      { text: 'Take Photo', onPress: () => {} },
      { text: 'Choose from Gallery', onPress: () => {} },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <ScreenContainer>
      <PageHeader
        title="Documents"
        subtitle="Keep your paperwork current to stay active"
        onBack={() => router.back()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing['3xl'] }}
      >
        {/* Summary */}
        <View style={styles.summaryRow}>
          <Card padding="md" style={[styles.summaryCard, { backgroundColor: colors.successSurface }]}>
            <TickCircle size={fs(24)} color={colors.success} variant="Bold" />
            <Text style={styles.summaryValue}>{verifiedCount}</Text>
            <Text style={styles.summaryLabel}>Verified</Text>
          </Card>
          <Card padding="md" style={[styles.summaryCard, { backgroundColor: issuesCount > 0 ? colors.warningSurface : colors.surfaceMuted }]}>
            <Warning2 size={fs(24)} color={issuesCount > 0 ? colors.warning : colors.textSecondary} variant="Bold" />
            <Text style={styles.summaryValue}>{issuesCount}</Text>
            <Text style={styles.summaryLabel}>Need attention</Text>
          </Card>
        </View>

        {/* Documents list */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Documents</Text>
          {docs.map((doc) => {
            const meta = STATUS_META[doc.status] ?? STATUS_META.pending;
            const Icon = meta.icon;
            const TypeIcon = ICON_FOR_TYPE[doc.icon] ?? DocumentText;
            return (
              <Card key={doc.id} padding="lg" style={{ marginBottom: spacing.sm }}>
                <View style={styles.docRow}>
                  <View style={[styles.docIcon, { backgroundColor: meta.surface }]}>
                    <TypeIcon size={fs(22)} color={meta.color} variant="Bold" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.docName}>{doc.name}</Text>
                    {doc.expiresOn ? (
                      <View style={styles.docMeta}>
                        <Calendar size={fs(12)} color={colors.textSecondary} variant="Bold" />
                        <Text style={styles.docMetaText}>Expires {doc.expiresOn}</Text>
                      </View>
                    ) : (
                      <Text style={styles.docMetaText}>Not uploaded yet</Text>
                    )}
                    <View style={styles.docStatusRow}>
                      <Icon size={fs(13)} color={meta.color} variant="Bold" />
                      <Text style={[styles.docStatusText, { color: meta.color }]}>{meta.label}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.docAction}
                    activeOpacity={0.85}
                    onPress={() => handleUpload(doc.name)}
                  >
                    {doc.status === 'pending' || doc.status === 'expired' ? (
                      <DocumentUpload size={fs(18)} color={colors.primary} variant="Bold" />
                    ) : (
                      <ArrowRight2 size={fs(18)} color={colors.textSecondary} variant="Linear" />
                    )}
                  </TouchableOpacity>
                </View>
              </Card>
            );
          })}
        </View>

        <Card padding="lg" tone="muted" style={styles.tipCard}>
          <View style={styles.tipIcon}>
            <ShieldTick size={fs(20)} color={colors.primary} variant="Bold" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.tipTitle}>Why we ask for documents</Text>
            <Text style={styles.tipDescription}>
              Verified documents keep your driver profile active and help parents trust the service.
              We renew automatically when you upload a refreshed copy.
            </Text>
          </View>
        </Card>

        <PrimaryButton
          title="Upload New Document"
          variant="gradient"
          size="lg"
          fullWidth
          iconLeft={<Camera size={fs(20)} color="#fff" variant="Bold" />}
          onPress={() => handleUpload('New Document')}
          style={{ marginTop: spacing.lg }}
        />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  summaryRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  summaryCard: { flex: 1, alignItems: 'flex-start' },
  summaryValue: { fontSize: typography.size.xl, color: colors.textPrimary, fontFamily: typography.fontFamily.bold, marginTop: spacing.sm },
  summaryLabel: { fontSize: typography.size.xs, color: colors.textSecondary, marginTop: 2 },

  section: { marginTop: spacing.sm },
  sectionTitle: {
    fontSize: typography.size.xs,
    color: colors.textTertiary,
    fontFamily: typography.fontFamily.bold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
    marginLeft: spacing.sm,
  },

  docRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  docIcon: {
    width: 48, height: 48, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
  },
  docName: { fontSize: typography.size.md, color: colors.textPrimary, fontFamily: typography.fontFamily.semibold },
  docMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  docMetaText: { fontSize: typography.size.xs, color: colors.textSecondary },
  docStatusRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  docStatusText: { fontSize: typography.size.xs, fontFamily: typography.fontFamily.semibold },
  docAction: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.primarySurface,
    alignItems: 'center', justifyContent: 'center',
  },

  tipCard: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, marginTop: spacing.lg },
  tipIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.primarySurface,
    alignItems: 'center', justifyContent: 'center',
  },
  tipTitle: { fontSize: typography.size.md, color: colors.textPrimary, fontFamily: typography.fontFamily.bold },
  tipDescription: { fontSize: typography.size.sm, color: colors.textSecondary, marginTop: 4, lineHeight: typography.size.sm * 1.4 },
});
