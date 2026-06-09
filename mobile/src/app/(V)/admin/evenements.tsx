/** CRUD événements admin — formulaire modal avec upload image. */
// Module : node_modules/react
import { useState } from 'react';
// Module : node_modules/react-native
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  Modal, ScrollView, Alert, ActivityIndicator, TextInput,
} from 'react-native';
// Module : node_modules/@expo/vector-icons
import { Ionicons } from '@expo/vector-icons';
// Modèle : src/models_M/constants/Colors.ts
import { COLORS } from '@/models_M/constants/Colors';
// Hook : src/hooks/useAdmin.ts
import { useAdminEvents, useAdminCreateEvent, useAdminUpdateEvent, useAdminDeleteEvent } from '@/hooks/useAdmin';
// Composant : src/components_V/ui/Loader.tsx
import { Loader } from '@/components_V/ui/Loader';
// API : src/lib/api/index.ts
import { adminApi, type Event } from '@/lib/api';
// Modèle : src/models_M/constants/app.constants.ts
import { DOMAINES, EPOQUES, REGIONS_LIST } from '@/models_M/constants/app.constants';
// Composant : src/components_V/admin/ImageUploadField.tsx
import { ImageUploadField } from '@/components_V/admin/ImageUploadField';

type FormData = {
  title: string;
  description: string;
  content: string;
  date: string;
  lieu: string;
  region: string;
  domaine: string;
  epoque: string;
  imageUrl: string;
  capaciteMax: string;
};

type Registration = {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  createdAt?: string;
};

const EMPTY: FormData = {
  title: '',
  description: '',
  content: '',
  date: '',
  lieu: '',
  region: 'NATIONAL',
  domaine: 'EVENEMENTS_MARQUANTS',
  epoque: 'CONTEMPORAIN',
  imageUrl: '',
  capaciteMax: '',
};

const FIELD_LABELS: Record<'title' | 'description' | 'date' | 'lieu', string> = {
  title: 'Titre',
  description: 'Description',
  date: 'Date et heure',
  lieu: 'Lieu',
};

function toDatetimeLocal(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatRegistrationDate(iso?: string): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString('fr-FR');
  } catch {
    return iso;
  }
}

/** Formulaire événement admin — date AAAA-MM-JJTHH:mm, lieu et métadonnées éditoriales. */
function EventForm({ initial, onSave, onClose, isSaving }: { initial: FormData; onSave: (d: FormData) => void; onClose: () => void; isSaving: boolean }) {
  const [form, setForm] = useState(initial);
  const set = (k: keyof FormData, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const formValid =
    form.title.trim().length > 0 &&
    form.description.trim().length > 0 &&
    form.lieu.trim().length > 0 &&
    form.date.trim().length > 0 &&
    form.region.length > 0 &&
    form.domaine.length > 0 &&
    form.epoque.length > 0;

  return (
    <View style={fs.container}>
      <View style={fs.header}>
        <Text style={fs.title}>{initial.title ? 'Modifier' : 'Nouvel événement'}</Text>
        <TouchableOpacity onPress={onClose}><Ionicons name="close" size={22} color={COLORS.textMuted} /></TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={fs.body} keyboardShouldPersistTaps="handled">
        {(['title', 'description', 'date', 'lieu'] as const).map((k) => (
          <View key={k}>
            <Text style={fs.label}>{FIELD_LABELS[k]}</Text>
            <TextInput
              style={[fs.input, k === 'description' && fs.textarea]}
              value={form[k]}
              onChangeText={(v) => set(k, v)}
              placeholder={k === 'date' ? 'AAAA-MM-JJTHH:mm' : FIELD_LABELS[k]}
              placeholderTextColor={COLORS.textMuted}
              multiline={k === 'description'}
            />
          </View>
        ))}
        <Text style={fs.label}>Capacité max (vide = illimité)</Text>
        <TextInput
          style={fs.input}
          value={form.capaciteMax}
          onChangeText={(v) => set('capaciteMax', v.replace(/[^\d]/g, ''))}
          placeholder="Ex. 50"
          placeholderTextColor={COLORS.textMuted}
          keyboardType="number-pad"
        />
        <Text style={fs.label}>Contenu détaillé (optionnel)</Text>
        <Text style={fs.hint}>Texte libre — pas besoin de balises HTML. Mise en forme avancée : admin web.</Text>
        <TextInput
          style={[fs.input, fs.textarea, { height: 100 }]}
          value={form.content}
          onChangeText={(v) => set('content', v)}
          placeholder="Informations complémentaires sur l'événement…"
          placeholderTextColor={COLORS.textMuted}
          multiline
        />
        <Text style={fs.label}>Domaine</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={fs.chips}>
          {DOMAINES.map((d) => (
            <TouchableOpacity key={d.id} style={[fs.chip, form.domaine === d.id && fs.chipActive]} onPress={() => set('domaine', form.domaine === d.id ? '' : d.id)}>
              <Text style={[fs.chipText, form.domaine === d.id && fs.chipTextActive]}>{d.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text style={fs.label}>Région</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={fs.chips}>
          {REGIONS_LIST.map((r) => (
            <TouchableOpacity key={r.code} style={[fs.chip, form.region === r.code && fs.chipActive]} onPress={() => set('region', form.region === r.code ? '' : r.code)}>
              <Text style={[fs.chipText, form.region === r.code && fs.chipTextActive]}>{r.nom}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text style={fs.label}>Époque</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={fs.chips}>
          {EPOQUES.map((e) => (
            <TouchableOpacity key={e.id} style={[fs.chip, form.epoque === e.id && fs.chipActive]} onPress={() => set('epoque', form.epoque === e.id ? '' : e.id)}>
              <Text style={[fs.chipText, form.epoque === e.id && fs.chipTextActive]}>{e.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <ImageUploadField label="Miniature" value={form.imageUrl} onChange={(v) => set('imageUrl', v)} />
        <TouchableOpacity style={fs.saveBtn} onPress={() => onSave(form)} disabled={isSaving || !formValid}>
          {isSaving ? <ActivityIndicator color={COLORS.bg} /> : <Text style={fs.saveBtnText}>Enregistrer</Text>}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const fs = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.navyLight },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 50, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  title: { color: COLORS.textWhite, fontSize: 18, fontWeight: '800' },
  body: { padding: 20, gap: 6, paddingBottom: 60 },
  label: { color: COLORS.textLight, fontSize: 12, fontWeight: '600', marginTop: 8 },
  hint: { color: COLORS.textMuted, fontSize: 11, lineHeight: 16, marginBottom: 4 },
  input: { backgroundColor: COLORS.bg, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: 10, color: COLORS.textWhite, fontSize: 13 },
  textarea: { height: 80, textAlignVertical: 'top' },
  chips: { gap: 8, paddingVertical: 6 },
  chip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.bg },
  chipActive: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  chipText: { color: COLORS.textMuted, fontSize: 11 },
  chipTextActive: { color: COLORS.bg, fontWeight: '700' },
  saveBtn: { backgroundColor: COLORS.gold, borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 20 },
  saveBtnText: { color: COLORS.bg, fontWeight: '800', fontSize: 15 },
});

export default function AdminEvenements() {
  const { data: events, isLoading } = useAdminEvents();
  const create = useAdminCreateEvent();
  const update = useAdminUpdateEvent();
  const del = useAdminDeleteEvent();
  const [editing, setEditing] = useState<Event | null | 'new'>(null);
  const [viewingRegs, setViewingRegs] = useState<{ eventId: string; items: Registration[] } | null>(null);

  const handleSave = async (form: FormData) => {
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.lieu.trim() ||
      !form.date.trim() ||
      !form.region ||
      !form.domaine ||
      !form.epoque
    ) {
      Alert.alert('Champs requis', 'Titre, description, lieu, date, région, domaine et époque sont obligatoires.');
      return;
    }
    const capaciteParsed = form.capaciteMax.trim() ? Number(form.capaciteMax) : null;
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      content: form.content.trim(),
      date: form.date.trim(),
      lieu: form.lieu.trim(),
      region: form.region,
      domaine: form.domaine,
      epoque: form.epoque,
      imageUrl: form.imageUrl,
      capaciteMax: capaciteParsed != null && Number.isFinite(capaciteParsed) && capaciteParsed > 0
        ? capaciteParsed
        : null,
    };
    if (editing === 'new') await create.mutateAsync(payload);
    else if (editing) await update.mutateAsync({ id: editing.id, ...payload });
    setEditing(null);
  };

  const handleDelete = (e: Event) => {
    Alert.alert('Supprimer', `Supprimer "${e.title}" ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => del.mutate(e.id) },
    ]);
  };

  const viewRegistrations = async (eventId: string) => {
    const regs = await adminApi.getEventRegistrations(eventId);
    setViewingRegs({ eventId, items: regs });
  };

  const deleteRegistration = (registrationId: string) => {
    if (!viewingRegs) return;
    Alert.alert('Supprimer', 'Retirer cette inscription ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          try {
            await adminApi.deleteEventRegistration(viewingRegs.eventId, registrationId);
            const regs = await adminApi.getEventRegistrations(viewingRegs.eventId);
            setViewingRegs({ eventId: viewingRegs.eventId, items: regs });
          } catch (e: unknown) {
            Alert.alert('Erreur', e instanceof Error ? e.message : 'Suppression impossible.');
          }
        },
      },
    ]);
  };

  if (isLoading) return <Loader />;

  return (
    <View style={styles.container}>
      <FlatList
        data={events ?? []}
        keyExtractor={(e) => e.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.rowInfo}>
              <Text style={styles.rowTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.rowMeta}>
                {new Date(item.date).toLocaleDateString('fr-FR')} • {item.lieu ?? '—'}
                {item.capaciteMax != null ? ` • ${item.capaciteMax} places` : ''}
              </Text>
            </View>
            <TouchableOpacity style={styles.iconBtn} onPress={() => viewRegistrations(item.id)}>
              <Ionicons name="people" size={18} color="#76D7C4" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => setEditing(item)}>
              <Ionicons name="pencil" size={18} color={COLORS.gold} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => handleDelete(item)}>
              <Ionicons name="trash" size={18} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Événements ({events?.length ?? 0})</Text>
            <TouchableOpacity style={styles.addBtn} onPress={() => setEditing('new')}>
              <Ionicons name="add" size={18} color={COLORS.bg} />
              <Text style={styles.addBtnText}>Ajouter</Text>
            </TouchableOpacity>
          </View>
        }
        contentContainerStyle={styles.list}
      />

      {/* Modal formulaire */}
      <Modal visible={editing !== null} animationType="slide">
        {editing !== null && (
          <EventForm
            initial={editing === 'new' ? EMPTY : {
              title: editing.title,
              description: editing.description ?? '',
              content: editing.content ?? '',
              date: toDatetimeLocal(editing.date),
              lieu: editing.lieu ?? '',
              region: editing.region ?? 'NATIONAL',
              domaine: editing.domaine ?? 'EVENEMENTS_MARQUANTS',
              epoque: editing.epoque ?? 'CONTEMPORAIN',
              imageUrl: editing.imageUrl ?? '',
              capaciteMax: editing.capaciteMax != null ? String(editing.capaciteMax) : '',
            }}
            onSave={handleSave}
            onClose={() => setEditing(null)}
            isSaving={create.isPending || update.isPending}
          />
        )}
      </Modal>

      {/* Modal inscriptions */}
      <Modal visible={viewingRegs !== null} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.regModal}>
            <View style={styles.regHeader}>
              <Text style={styles.regTitle}>Inscriptions ({viewingRegs?.items.length ?? 0})</Text>
              <TouchableOpacity onPress={() => setViewingRegs(null)}>
                <Ionicons name="close" size={22} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {(viewingRegs?.items ?? []).map((r) => (
                <View key={r.id} style={styles.regRow}>
                  <View style={styles.regInfo}>
                    <Text style={styles.regName}>{r.prenom} {r.nom}</Text>
                    <Text style={styles.regEmail}>{r.email}</Text>
                    {r.createdAt ? (
                      <Text style={styles.regDate}>{formatRegistrationDate(r.createdAt)}</Text>
                    ) : null}
                  </View>
                  <TouchableOpacity style={styles.iconBtn} onPress={() => deleteRegistration(r.id)}>
                    <Ionicons name="trash" size={18} color="#e74c3c" />
                  </TouchableOpacity>
                </View>
              ))}
              {viewingRegs?.items.length === 0 && (
                <Text style={styles.regEmpty}>Aucune inscription.</Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  list: { padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { color: COLORS.textWhite, fontSize: 18, fontWeight: '800' },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.gold, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  addBtnText: { color: COLORS.bg, fontWeight: '700', fontSize: 13 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.bgCard, borderRadius: 8, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: COLORS.borderLight, gap: 8 },
  rowInfo: { flex: 1 },
  rowTitle: { color: COLORS.textWhite, fontSize: 13, fontWeight: '600' },
  rowMeta: { color: COLORS.textMuted, fontSize: 11 },
  iconBtn: { padding: 4 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  regModal: { backgroundColor: COLORS.navyLight, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '70%' },
  regHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  regTitle: { color: COLORS.textWhite, fontSize: 16, fontWeight: '800' },
  regRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border, gap: 8 },
  regInfo: { flex: 1 },
  regName: { color: COLORS.textWhite, fontSize: 14, fontWeight: '600' },
  regEmail: { color: COLORS.textMuted, fontSize: 12 },
  regDate: { color: COLORS.textMuted, fontSize: 11, marginTop: 2 },
  regEmpty: { color: COLORS.textMuted, textAlign: 'center', paddingVertical: 20 },
});
