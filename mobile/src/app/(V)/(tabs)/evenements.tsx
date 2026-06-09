/** Liste événements publics — affichage et inscription via modal. */
// Module : node_modules/react
import { useState } from 'react';
// Module : node_modules/react-native
import {
  View, Text, FlatList, StyleSheet, Modal, TouchableOpacity,
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
  const [error, setError] = useState('');

  const reset = () => {
    setForm({ nom: '', prenom: '', email: '' });
    setSuccess(false);
    setError('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    setError('');
    if (!form.nom || !form.prenom || !form.email) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    if (!event) return;
    setIsLoading(true);
    try {
      await eventsApi.register({ eventId: event.id, ...form });
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
          <Text style={styles.modalTitle}>S'inscrire à l'événement</Text>
          {event && <Text style={styles.modalEventTitle}>{event.title}</Text>}

          {success ? (
            <View style={styles.successBox}>
              <Text style={styles.successText}>
                Inscription confirmée ! Vous recevrez un e-mail de confirmation.
              </Text>
              <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
                <Text style={styles.closeBtnText}>Fermer</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView keyboardShouldPersistTaps="handled">
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
                  : <Text style={styles.submitBtnText}>Confirmer l'inscription</Text>}
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

  const openModal = (event: Event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={events ?? []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            onPress={() => openModal(item)}
            onRegister={() => openModal(item)}
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
  modalEventTitle: { color: COLORS.gold, fontSize: 14, marginBottom: 20 },
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
