/** CRUD ressources bibliothèque — formulaire modal création/édition. */
// Module : node_modules/react
import { useState } from 'react';
// Module : node_modules/react-native
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput,
  Modal, ScrollView, Alert, ActivityIndicator,
} from 'react-native';
// Module : node_modules/@expo/vector-icons
import { Ionicons } from '@expo/vector-icons';
// Modèle : src/models_M/constants/Colors.ts
import { COLORS } from '@/models_M/constants/Colors';
// Hook : src/hooks/useAdmin.ts
import { useAdminResources, useAdminCreateResource, useAdminUpdateResource, useAdminDeleteResource } from '@/hooks/useAdmin';
// Hook : src/hooks/usePermissions.ts
import { usePermissions } from '@/hooks/usePermissions';
// Composant : src/components_V/ui/Loader.tsx
import { Loader } from '@/components_V/ui/Loader';
// API : src/lib/api/index.ts
import type { Resource } from '@/lib/api';
// Modèle : src/models_M/constants/app.constants.ts
import { EPOQUES, DOMAINES, RESOURCE_TYPES, REGIONS_LIST, getEpoqueLabel, getResourceTypeLabel } from '@/models_M/constants/app.constants';
// Composant : src/components_V/admin/ImageUploadField.tsx
import { ImageUploadField } from '@/components_V/admin/ImageUploadField';

type FormData = {
  title: string;
  description: string;
  content: string;
  type: string;
  epoque: string;
  domaine: string;
  region: string;
  imageUrl: string;
};

const EMPTY_FORM: FormData = {
  title: '',
  description: '',
  content: '',
  type: 'CHRONOLOGIE',
  epoque: 'ANTIQUITE',
  domaine: 'PATRIMOINE_HISTOIRE',
  region: 'NATIONAL',
  imageUrl: '',
};

/** Formulaire ressource admin — chips type/époque/domaine/région + upload image. */
function ResourceForm({
  initial,
  onSave,
  onClose,
  isSaving,
  allowImport,
}: {
  initial: FormData;
  onSave: (data: FormData) => void;
  onClose: () => void;
  isSaving: boolean;
  allowImport: boolean;
}) {
  const [form, setForm] = useState<FormData>(initial);
  const set = (k: keyof FormData, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const renderSelect = (label: string, key: keyof FormData, options: readonly { id: string; label: string }[]) => (
    <View>
      <Text style={fs.label}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={fs.chips}>
        {options.map((o) => (
          <TouchableOpacity
            key={o.id}
            style={[fs.chip, form[key] === o.id && fs.chipActive]}
            onPress={() => set(key, form[key] === o.id ? '' : o.id)}
          >
            <Text style={[fs.chipText, form[key] === o.id && fs.chipTextActive]}>{o.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={fs.container}>
      <View style={fs.header}>
        <Text style={fs.title}>{initial.title ? 'Modifier' : 'Nouvelle ressource'}</Text>
        <TouchableOpacity onPress={onClose}><Ionicons name="close" size={22} color={COLORS.textMuted} /></TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={fs.body} keyboardShouldPersistTaps="handled">
        <Text style={fs.label}>Titre *</Text>
        <TextInput style={fs.input} value={form.title} onChangeText={(v) => set('title', v)} placeholder="Titre" placeholderTextColor={COLORS.textMuted} />
        <Text style={fs.label}>Description</Text>
        <TextInput style={[fs.input, fs.textarea]} value={form.description} onChangeText={(v) => set('description', v)} placeholder="Description" placeholderTextColor={COLORS.textMuted} multiline numberOfLines={3} />
        {renderSelect('Type', 'type', RESOURCE_TYPES)}
        {renderSelect('Époque', 'epoque', EPOQUES)}
        {renderSelect('Domaine', 'domaine', DOMAINES)}
        {renderSelect('Région', 'region', REGIONS_LIST.map((r) => ({ id: r.code, label: r.nom })))}
        {allowImport && (
          <ImageUploadField label="Miniature" value={form.imageUrl} onChange={(v) => set('imageUrl', v)} />
        )}
        <Text style={fs.label}>Contenu détaillé (optionnel)</Text>
        <Text style={fs.hint}>Texte libre — pas besoin de balises HTML. Mise en forme avancée : admin web.</Text>
        <TextInput
          style={[fs.input, fs.textarea, { height: 120 }]}
          value={form.content}
          onChangeText={(v) => set('content', v)}
          placeholder="Article, chronologie, notes de cours…"
          placeholderTextColor={COLORS.textMuted}
          multiline
        />
        <TouchableOpacity style={fs.saveBtn} onPress={() => onSave(form)} disabled={isSaving || !form.title}>
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
  body: { padding: 20, gap: 8, paddingBottom: 60 },
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

export default function AdminRessources() {
  const { data: resources, isLoading } = useAdminResources();
  const create = useAdminCreateResource();
  const update = useAdminUpdateResource();
  const del = useAdminDeleteResource();
  const {
    canCreateResource,
    canEditResource,
    canDeleteResource,
    canImportMedia,
  } = usePermissions();
  const [editing, setEditing] = useState<Resource | null | 'new'>(null);

  const allowCreate = canCreateResource();
  const allowEdit = canEditResource();
  const allowDelete = canDeleteResource();
  const allowImport = canImportMedia();

  const openCreate = () => {
    if (!allowCreate) return;
    setEditing('new');
  };

  const openEdit = (item: Resource) => {
    if (!allowEdit) return;
    setEditing(item);
  };

  const handleSave = async (form: FormData) => {
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.type ||
      !form.region ||
      !form.epoque ||
      !form.domaine
    ) {
      Alert.alert('Champs requis', 'Titre, description, type, région, époque et domaine sont obligatoires.');
      return;
    }
    if (editing === 'new') {
      await create.mutateAsync(form);
    } else if (editing) {
      await update.mutateAsync({ id: editing.id, ...form });
    }
    setEditing(null);
  };

  const handleDelete = (r: Resource) => {
    Alert.alert('Supprimer', `Supprimer "${r.title}" ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => del.mutate(r.id) },
    ]);
  };

  if (isLoading) return <Loader />;

  return (
    <View style={styles.container}>
      <FlatList
        data={resources ?? []}
        keyExtractor={(r) => r.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.rowInfo}>
              <Text style={styles.rowTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.rowMeta}>{getResourceTypeLabel(item.type)} • {item.epoque ? getEpoqueLabel(item.epoque) : '—'}</Text>
            </View>
            {allowEdit && (
              <TouchableOpacity style={styles.iconBtn} onPress={() => openEdit(item)}>
                <Ionicons name="pencil" size={18} color={COLORS.gold} />
              </TouchableOpacity>
            )}
            {allowDelete && (
              <TouchableOpacity style={styles.iconBtn} onPress={() => handleDelete(item)}>
                <Ionicons name="trash" size={18} color="#e74c3c" />
              </TouchableOpacity>
            )}
            {!allowEdit && !allowDelete && (
              <Text style={styles.readOnly}>Lecture seule</Text>
            )}
          </View>
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Ressources ({resources?.length ?? 0})</Text>
            {allowCreate && (
              <TouchableOpacity style={styles.addBtn} onPress={openCreate}>
                <Ionicons name="add" size={18} color={COLORS.bg} />
                <Text style={styles.addBtnText}>Ajouter</Text>
              </TouchableOpacity>
            )}
          </View>
        }
        contentContainerStyle={styles.list}
      />

      <Modal visible={editing !== null} animationType="slide">
        {editing !== null && (
          <ResourceForm
            initial={editing === 'new' ? EMPTY_FORM : {
              title: editing.title,
              description: editing.description ?? '',
              content: editing.content ?? '',
              type: editing.type ?? 'CHRONOLOGIE',
              epoque: editing.epoque ?? 'ANTIQUITE',
              domaine: editing.domaine ?? 'PATRIMOINE_HISTOIRE',
              region: editing.region ?? 'NATIONAL',
              imageUrl: editing.imageUrl ?? '',
            }}
            onSave={handleSave}
            onClose={() => setEditing(null)}
            isSaving={create.isPending || update.isPending}
            allowImport={allowImport}
          />
        )}
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    gap: 8,
  },
  rowInfo: { flex: 1 },
  rowTitle: { color: COLORS.textWhite, fontSize: 14, fontWeight: '600' },
  rowMeta: { color: COLORS.textMuted, fontSize: 11 },
  iconBtn: { padding: 4 },
  readOnly: { color: COLORS.textMuted, fontSize: 11, fontStyle: 'italic' },
});
