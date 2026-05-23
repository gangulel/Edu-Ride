import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  AddSquare,
  Call,
  CloseSquare,
  InfoCircle,
  Location,
  MessageText1,
  Profile2User,
  Timer1,
  TickCircle,
  Buildings2,
} from 'iconsax-react-native';

import ScreenContainer from '../components/driver/ScreenContainer';
import PageHeader from '../components/driver/PageHeader';
import SearchField from '../components/driver/SearchField';
import FilterChip from '../components/driver/FilterChip';
import Card from '../components/driver/Card';
import Avatar from '../components/driver/Avatar';
import Badge from '../components/driver/Badge';
import EmptyState from '../components/driver/EmptyState';
import PrimaryButton from '../components/driver/PrimaryButton';
import {
  colors,
  spacing,
  typography,
  radii,
  shadows,
  fs,
} from '../theme';
import { getStudents } from '../../services/mock/driver';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'absent', label: 'Absent' },
];

export default function StudentsScreen() {
  const router = useRouter();
  const allStudents = useMemo(() => getStudents(), []);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const filtered = allStudents.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.parentName.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || s.status === filter;
    return matchesSearch && matchesFilter;
  });

  const counts = {
    all: allStudents.length,
    active: allStudents.filter((s) => s.status === 'active').length,
    absent: allStudents.filter((s) => s.status === 'absent').length,
  };

  const openDetails = (student) => {
    setSelected(student);
    setShowDetails(true);
  };

  return (
    <ScreenContainer>
      <PageHeader
        title="Students"
        subtitle={`${counts.active} active • ${counts.all} total`}
        onBack={() => router.back()}
        rightSlot={
          <TouchableOpacity hitSlop={6} style={styles.addBtn}>
            <AddSquare size={fs(22)} color={colors.primary} variant="Bold" />
          </TouchableOpacity>
        }
      />

      <View style={styles.searchSection}>
        <SearchField
          value={search}
          onChangeText={setSearch}
          placeholder="Search students or parents..."
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {FILTERS.map((f) => (
            <FilterChip
              key={f.id}
              label={f.label}
              count={counts[f.id]}
              active={filter === f.id}
              onPress={() => setFilter(f.id)}
              style={{ marginRight: spacing.sm }}
            />
          ))}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, paddingTop: 0, paddingBottom: spacing['3xl'] }}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <EmptyState
            icon={Profile2User}
            title="No students yet"
            description={
              search
                ? 'Try a different search term or clear the filters.'
                : 'Once parents enroll students with you, they will appear here.'
            }
          />
        ) : (
          filtered.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onPress={() => openDetails(student)}
            />
          ))
        )}
      </ScrollView>

      <Modal
        visible={showDetails}
        animationType="slide"
        transparent
        onRequestClose={() => setShowDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Student Profile</Text>
              <TouchableOpacity onPress={() => setShowDetails(false)} hitSlop={6}>
                <CloseSquare size={fs(26)} color={colors.textSecondary} variant="Linear" />
              </TouchableOpacity>
            </View>

            {selected ? (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.sheetHero}>
                  <Avatar
                    name={selected.name}
                    tone={selected.avatarColor}
                    size={80}
                    border
                  />
                  <Text style={styles.sheetName}>{selected.name}</Text>
                  <Text style={styles.sheetSub}>{selected.grade} • {selected.school}</Text>
                  <View style={styles.sheetBadges}>
                    <Badge
                      label={selected.status === 'active' ? 'Active' : 'Absent'}
                      tone={selected.status === 'active' ? 'success' : 'warning'}
                      variant="soft"
                    />
                    <Badge
                      label={`${selected.attendance}% attendance`}
                      tone="primary"
                      variant="soft"
                    />
                  </View>
                </View>

                <DetailSection title="Pickup & Drop-off">
                  <DetailRow icon={Location} label="Pickup" value={selected.pickupAddress} multiline />
                  <DetailRow icon={Timer1} label="Pickup Time" value={selected.pickupTime} />
                  <DetailRow icon={Buildings2} label="Drop-off" value={selected.dropoffAddress} multiline />
                </DetailSection>

                <DetailSection title="Parent / Guardian">
                  <DetailRow icon={Profile2User} label="Name" value={selected.parentName} />
                  <DetailRow icon={Call} label="Phone" value={selected.parentPhone} />
                </DetailSection>

                {selected.specialNotes ? (
                  <DetailSection title="Special Notes">
                    <View style={styles.noteCard}>
                      <InfoCircle size={fs(18)} color={colors.warning} variant="Bold" />
                      <Text style={styles.noteText}>{selected.specialNotes}</Text>
                    </View>
                  </DetailSection>
                ) : null}

                <View style={styles.sheetActions}>
                  <PrimaryButton
                    title="Call Parent"
                    variant="gradient"
                    size="md"
                    style={{ flex: 1 }}
                    iconLeft={<Call size={fs(16)} color="#fff" variant="Bold" />}
                  />
                  <PrimaryButton
                    title="Message"
                    variant="outline"
                    size="md"
                    style={{ flex: 1 }}
                    iconLeft={<MessageText1 size={fs(16)} color={colors.primary} variant="Bold" />}
                  />
                </View>
              </ScrollView>
            ) : null}
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const StudentCard = ({ student, onPress }) => (
  <Card padding="lg" style={styles.card} onPress={onPress}>
    <View style={styles.cardTop}>
      <View style={styles.cardLeft}>
        <Avatar
          name={student.name}
          tone={student.avatarColor}
          size={52}
          online={student.status === 'active'}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.studentName} numberOfLines={1}>{student.name}</Text>
          <Text style={styles.studentMeta} numberOfLines={1}>
            {student.grade} • {student.school}
          </Text>
          <View style={styles.pickupRow}>
            <Timer1 size={fs(13)} color={colors.textSecondary} variant="Bold" />
            <Text style={styles.pickupText}>{student.pickupTime}</Text>
          </View>
        </View>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.iconBtn} hitSlop={6}>
          <Call size={fs(16)} color={colors.primary} variant="Bold" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} hitSlop={6}>
          <MessageText1 size={fs(16)} color={colors.primary} variant="Bold" />
        </TouchableOpacity>
      </View>
    </View>

    <View style={styles.cardDivider} />

    <View style={styles.cardDetails}>
      <View style={styles.detailLine}>
        <Location size={fs(14)} color={colors.textTertiary} variant="Bold" />
        <Text style={styles.detailLineText} numberOfLines={1}>{student.pickupAddress}</Text>
      </View>
      <View style={styles.detailLine}>
        <Profile2User size={fs(14)} color={colors.textTertiary} variant="Bold" />
        <Text style={styles.detailLineText} numberOfLines={1}>
          {student.parentName} • {student.parentPhone}
        </Text>
      </View>
    </View>

    <View style={styles.cardFooter}>
      <View style={styles.attendanceRow}>
        <TickCircle size={fs(14)} color={colors.success} variant="Bold" />
        <Text style={styles.attendanceText}>Attendance {student.attendance}%</Text>
      </View>
      {student.status === 'absent' ? (
        <Badge label="Absent today" tone="warning" variant="soft" size="xs" />
      ) : null}
    </View>
  </Card>
);

const DetailSection = ({ title, children }) => (
  <View style={styles.detailSection}>
    <Text style={styles.detailSectionTitle}>{title}</Text>
    <View style={styles.detailSectionBody}>{children}</View>
  </View>
);

const DetailRow = ({ icon: Icon, label, value, multiline }) => (
  <View style={styles.detailRow}>
    {Icon ? <Icon size={fs(16)} color={colors.textSecondary} variant="Bold" /> : <View style={{ width: fs(16) }} />}
    <View style={{ flex: 1 }}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue} numberOfLines={multiline ? 0 : 1}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  addBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.primarySurface,
    alignItems: 'center', justifyContent: 'center',
  },

  searchSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  filterRow: {
    paddingTop: spacing.md,
  },

  card: { marginBottom: spacing.md },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 },
  studentName: { fontSize: typography.size.md, color: colors.textPrimary, fontFamily: typography.fontFamily.semibold },
  studentMeta: { fontSize: typography.size.xs, color: colors.textSecondary, marginTop: 2 },
  pickupRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  pickupText: { fontSize: typography.size.xs, color: colors.textSecondary, fontFamily: typography.fontFamily.medium },
  cardActions: { flexDirection: 'row', gap: spacing.sm },
  iconBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.primarySurface,
    alignItems: 'center', justifyContent: 'center',
  },
  cardDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
    marginVertical: spacing.md,
  },
  cardDetails: { gap: spacing.sm },
  detailLine: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  detailLineText: { fontSize: typography.size.xs, color: colors.textSecondary, flex: 1 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  attendanceRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  attendanceText: { fontSize: typography.size.xs, color: colors.successDark, fontFamily: typography.fontFamily.semibold },

  modalOverlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    padding: spacing.xl,
    paddingTop: spacing.md,
    maxHeight: '92%',
  },
  sheetHandle: {
    alignSelf: 'center', width: 44, height: 5, borderRadius: 3,
    backgroundColor: colors.border, marginBottom: spacing.md,
  },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  sheetTitle: { fontSize: typography.size.xl, color: colors.textPrimary, fontFamily: typography.fontFamily.bold },
  sheetHero: { alignItems: 'center', paddingVertical: spacing.lg },
  sheetName: { fontSize: typography.size.xl, color: colors.textPrimary, fontFamily: typography.fontFamily.bold, marginTop: spacing.md },
  sheetSub: { fontSize: typography.size.sm, color: colors.textSecondary, marginTop: 4 },
  sheetBadges: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },

  detailSection: { marginTop: spacing.lg },
  detailSectionTitle: {
    fontSize: typography.size.xs,
    color: colors.textTertiary,
    fontFamily: typography.fontFamily.bold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  detailSectionBody: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.md,
    padding: spacing.md,
    gap: spacing.md,
  },
  detailRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  detailLabel: { fontSize: typography.size.xs, color: colors.textSecondary },
  detailValue: { fontSize: typography.size.md, color: colors.textPrimary, marginTop: 2 },

  noteCard: {
    backgroundColor: colors.warningSurface,
    padding: spacing.md,
    borderRadius: radii.md,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  noteText: { flex: 1, color: colors.warningDark, fontSize: typography.size.sm, lineHeight: typography.size.sm * 1.4 },

  sheetActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xl },
});
