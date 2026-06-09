/** Liste événements publics — à venir / passés + inscription (aligné web). */
// Module : node_modules/react
import { useMemo, useState } from 'react';
// Module : node_modules/react-native
import {
  View, Text, SectionList, StyleSheet, Modal, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView,
} from 'react-native';
// Modèle : src/models_M/constants/Colors.ts
import { COLORS } from '@/models_M/constants/Colors';
// Hook : src/hooks/useEvents.ts
import { useEvents } from '@/hooks/useEvents';
// Composant : src/components_V/EventCard.tsx
import { EventCard } from '@/components_V/EventCard';
// Composant : src/components_V/ui/Loader.tsx
import { Loader } from '@/components_V/ui/Loader';
// Composant : src/components_V/ui/EmptyState.tsx
import { EmptyState } from '@/components_V/ui/EmptyState';
// API : src/lib/api/index.ts
import { eventsApi, type Event } from '@/lib/api';

type InscriptionForm = { nom: string; prenom: string; email: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function formatEventDateTime(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const date = d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const time = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    return `${date} · ${time}`;
  } catch {
    return dateStr;
  }
}

/** Modal inscription — formulaire nom/prénom/e-mail puis eventsApi.register. */
function InscriptionModal({
  event,
  visible,
  onClose,
}: {
  event: Event | null;
  visible: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState<InscriptionForm>({ nom: '', prenom: '', email: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [error, setError] = useState('');

  const reset = () => {
    setForm({ nom: '', prenom: '', email: '' });
    setSuccess(false);
    setEmailSent(false);
    setSubmittedEmail('');
    setError('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    setError('');
    const nom = form.nom.trim();
    const prenom = form.prenom.trim();
    const email = form.email.trim().toLowerCase();

    if (!nom || !prenom || !email) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setError('Adresse e-mail invalide.');
      return;
    }
    if (!event) return;

    setIsLoading(true);
    try {
      const result = await eventsApi.register({ eventId: event.id, nom, prenom, email });
      setSubmittedEmail(email);
      setEmailSent(result.emailSent === true);
      setSuccess(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur lors de l'inscription.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={handleClose} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalWrapper}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>S&apos;inscrire</Text>
          {event && <Text style={styles.modalEventTitle}>{event.title}</Text>}

          {success ? (
            <View style={styles.successBox}>
              <Text style={styles.successText}>
                Inscription confirmée ! Vous êtes inscrit(e) à {event?.title}.
                {emailSent
                  ? ` Un récapitulatif a été envoyé à ${submittedEmail}.`
                  : " Votre inscription est enregistrée, mais l'e-mail de confirmation n'a pas pu être envoyé."}
              </Text>
              <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
                <Text style={styles.closeBtnText}>Fermer</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView keyboardShouldPersistTaps="handled">
              {event && (
                <View style={styles.modalEventInfo}>
                  <Text style={styles.modalEventInfoText}>📅 {formatEventDateTime(event.date)}</Text>
                  {event.lieu ? <Text style={styles.modalEventInfoText}>📍 {event.lieu}</Text> : null}
                </View>
              )}
              {!!error && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}
              <View style={styles.modalRow}>
                <View style={styles.modalHalf}>
                  <Text style={styles.label}>Prénom *</Text>
                  <TextInput
                    style={styles.input}
                    value={form.prenom}
                    onChangeText={(v) => setForm((p) => ({ ...p, prenom: v }))}
                    placeholder="Jean"
                    placeholderTextColor={COLORS.textMuted}
                  />
                </View>
                <View style={styles.modalHalf}>
                  <Text style={styles.label}>Nom *</Text>
                  <TextInput
                    style={styles.input}
                    value={form.nom}
                    onChangeText={(v) => setForm((p) => ({ ...p, nom: v }))}
                    placeholder="Dupont"
                    placeholderTextColor={COLORS.textMuted}
                  />
                </View>
              </View>
              <Text style={styles.label}>Adresse e-mail *</Text>
              <TextInput
                style={styles.input}
                value={form.email}
                onChangeText={(v) => setForm((p) => ({ ...p, email: v }))}
                placeholder="vous@exemple.fr"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={isLoading}>
                {isLoading
                  ? <ActivityIndicator color={COLORS.bg} />
                  : <Text style={styles.submitBtnText}>Confirmer l&apos;inscription</Text>}
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default function EvenementsScreen() {
  const { data: events, isLoading, isError, refetch } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const sections = useMemo(() => {
    const now = new Date();
    const upcoming = (events ?? [])
      .filter((e) => new Date(e.date) > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const past = (events ?? [])
      .filter((e) => new Date(e.date) <= now)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const result: { title: string; data: Event[]; upcoming: boolean }[] = [];
    if (upcoming.length > 0) result.push({ title: 'À venir', data: upcoming, upcoming: true });
    if (past.length > 0) result.push({ title: 'Événements passés', data: past, upcoming: false });
    return result;
  }, [events]);

  const openModal = (event: Event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionTitle}>{section.title}</Text>
        )}
        renderItem={({ item, section }) => (
          <EventCard
            event={item}
            onPress={section.upcoming ? () => openModal(item) : undefined}
            onRegister={section.upcoming ? () => openModal(item) : undefined}
          />
        )}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.badge}>AGENDA CULTUREL</Text>
            <Text style={styles.title}>Événements</Text>
            <View style={styles.underline} />
            <Text style={styles.subtitle}>
              Conférences, expositions, ateliers et rencontres autour du patrimoine historique français.
            </Text>
          </View>
        }
        ListEmptyComponent={
          isLoading
            ? <Loader />
            : isError
              ? <EmptyState
                  icon="cloud-offline-outline"
                  title="Erreur de chargement"
                  actionLabel="Réessayer"
                  onAction={refetch}
                />
              : <EmptyState
                  icon="calendar-outline"
                  title="Aucun événement"
                  subtitle="Aucun événement n'est programmé pour le moment."
                />
        }
        stickySectionHeadersEnabled={false}
      />

      <InscriptionModal
        event={selectedEvent}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  list: { padding: 16, paddingBottom: 40 },
  header: {
    padding: 24,
    paddingTop: 20,
    backgroundColor: COLORS.navyLight,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 6,
    marginHorizontal: -16,
    marginTop: -16,
    marginBottom: 16,
  },
  badge: { color: COLORS.gold, fontSize: 11, fontWeight: '700', letterSpacing: 2 },
  title: { color: COLORS.textWhite, fontSize: 26, fontWeight: '900' },
  underline: { width: 40, height: 3, backgroundColor: COLORS.gold, borderRadius: 2 },
  subtitle: { color: COLORS.textMuted, fontSize: 13, lineHeight: 20 },
  sectionTitle: {
    color: COLORS.textWhite,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 12,
    marginTop: 8,
  },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  modalWrapper: { justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: COLORS.navyLight,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '85%',
  },
  modalHandle: {
    width: 40, height: 4, backgroundColor: COLORS.border,
    borderRadius: 2, alignSelf: 'center', marginBottom: 20,
  },
  modalTitle: { color: COLORS.textWhite, fontSize: 20, fontWeight: '800', marginBottom: 4 },
  modalEventTitle: { color: COLORS.gold, fontSize: 14, marginBottom: 12 },
  modalEventInfo: { gap: 4, marginBottom: 16 },
  modalEventInfoText: { color: COLORS.textMuted, fontSize: 13 },
  modalRow: { flexDirection: 'row', gap: 12 },
  modalHalf: { flex: 1 },
  label: { color: COLORS.textLight, fontSize: 13, fontWeight: '600', marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    color: COLORS.textWhite,
    fontSize: 14,
  },
  submitBtn: {
    backgroundColor: COLORS.gold,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  submitBtnText: { color: COLORS.bg, fontWeight: '800', fontSize: 15 },
  closeBtn: {
    marginTop: 12,
    alignItems: 'center',
    paddingVertical: 10,
  },
  closeBtnText: { color: COLORS.gold, fontWeight: '600' },
  errorBox: {
    backgroundColor: '#e74c3c22', borderWidth: 1, borderColor: '#e74c3c',
    borderRadius: 8, padding: 10, marginBottom: 12,
  },
  errorText: { color: '#e74c3c', fontSize: 13 },
  successBox: { gap: 16 },
  successText: { color: '#2ecc71', fontSize: 14, lineHeight: 21 },
});
