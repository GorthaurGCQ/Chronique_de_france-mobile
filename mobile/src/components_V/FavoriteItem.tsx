import { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/models_M/constants/Colors';
import type { Favorite } from '@/lib/api';
import {
  EPOQUE_COLORS,
  getEpoqueLabel,
  getResourceTypeLabel,
} from '@/models_M/constants/app.constants';

type Props = {
  favorite: Favorite;
  onRemove: (resourceId: string) => void;
  onSaveNote: (resourceId: string, note: string) => Promise<void>;
  isSavingNote?: boolean;
};

export function FavoriteItem({ favorite, onRemove, onSaveNote, isSavingNote }: Props) {
  const resource = favorite.resource;
  const [editingNote, setEditingNote] = useState(false);
  const [note, setNote] = useState(favorite.note ?? '');

  if (!resource) return null;

  const thumbColor = resource.epoque ? EPOQUE_COLORS[resource.epoque] ?? COLORS.navyLight : COLORS.navyLight;

  const handleSaveNote = async () => {
    await onSaveNote(favorite.resourceId, note.trim());
    setEditingNote(false);
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.thumbWrap}
        onPress={() => router.push(`/bibliotheque/${favorite.resourceId}`)}
      >
        {resource.imageUrl ? (
          <Image source={{ uri: resource.imageUrl }} style={styles.thumb} resizeMode="cover" />
        ) : (
          <View style={[styles.thumb, styles.thumbPlaceholder, { backgroundColor: thumbColor }]}>
            {resource.epoque ? (
              <Text style={styles.thumbEpoque}>{getEpoqueLabel(resource.epoque)}</Text>
            ) : null}
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.body}>
        <Text style={styles.type}>{getResourceTypeLabel(resource.type)}</Text>
        <TouchableOpacity onPress={() => router.push(`/bibliotheque/${favorite.resourceId}`)}>
          <Text style={styles.title} numberOfLines={2}>{resource.title}</Text>
        </TouchableOpacity>
        {resource.description ? (
          <Text style={styles.desc} numberOfLines={2}>{resource.description}</Text>
        ) : null}

        {editingNote ? (
          <View style={styles.noteEdit}>
            <TextInput
              style={styles.noteInput}
              value={note}
              onChangeText={setNote}
              placeholder="Note personnelle…"
              placeholderTextColor={COLORS.textMuted}
              multiline
              autoFocus
            />
            <View style={styles.noteActions}>
              <TouchableOpacity style={styles.noteSaveBtn} onPress={handleSaveNote} disabled={isSavingNote}>
                <Text style={styles.noteSaveText}>{isSavingNote ? '…' : 'Enregistrer'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setEditingNote(false); setNote(favorite.note ?? ''); }}>
                <Text style={styles.noteCancel}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : favorite.note ? (
          <TouchableOpacity style={styles.noteDisplay} onPress={() => setEditingNote(true)}>
            <Ionicons name="document-text-outline" size={14} color={COLORS.gold} />
            <Text style={styles.noteText} numberOfLines={2}>{favorite.note}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setEditingNote(true)}>
            <Text style={styles.noteAdd}>+ Ajouter une note</Text>
          </TouchableOpacity>
        )}

        <View style={styles.footer}>
          <Text style={styles.date}>
            Sauvegardé le {new Date(favorite.createdAt).toLocaleDateString('fr-FR')}
          </Text>
          <TouchableOpacity onPress={() => onRemove(favorite.resourceId)} hitSlop={8}>
            <Ionicons name="close-circle" size={20} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: COLORS.bgCard,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  thumbWrap: { width: 88 },
  thumb: { width: 88, height: 88, borderRadius: 8 },
  thumbPlaceholder: { alignItems: 'center', justifyContent: 'center', padding: 6 },
  thumbEpoque: { color: 'rgba(255,255,255,0.85)', fontSize: 10, fontWeight: '700', textAlign: 'center' },
  body: { flex: 1, gap: 4 },
  type: { color: COLORS.gold, fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  title: { color: COLORS.textWhite, fontSize: 14, fontWeight: '700', lineHeight: 20 },
  desc: { color: COLORS.textMuted, fontSize: 12, lineHeight: 17 },
  noteEdit: { gap: 6, marginTop: 4 },
  noteInput: {
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 8,
    color: COLORS.textWhite,
    fontSize: 12,
    minHeight: 56,
    textAlignVertical: 'top',
  },
  noteActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  noteSaveBtn: { backgroundColor: COLORS.gold, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 5 },
  noteSaveText: { color: COLORS.bg, fontWeight: '700', fontSize: 11 },
  noteCancel: { color: COLORS.textMuted, fontSize: 11 },
  noteDisplay: { flexDirection: 'row', gap: 6, alignItems: 'flex-start', marginTop: 2 },
  noteText: { flex: 1, color: COLORS.textLight, fontSize: 12, fontStyle: 'italic' },
  noteAdd: { color: COLORS.gold, fontSize: 12, fontWeight: '600', marginTop: 2 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  date: { color: COLORS.textMuted, fontSize: 10 },
});
