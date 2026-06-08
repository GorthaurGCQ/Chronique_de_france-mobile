import { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/models_M/constants/Colors';
import { adminApi } from '@/lib/api';

type Props = {
  label: string;
  value?: string;
  onChange: (url: string) => void;
};

export function ImageUploadField({ label, value, onChange }: Props) {
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission requise', "Autorisez l'accès à vos photos.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.85,
    });
    if (result.canceled || !result.assets[0]) return;

    setUploading(true);
    try {
      const asset = result.assets[0];
      const formData = new FormData();
      formData.append('file', {
        uri: asset.uri,
        type: asset.mimeType ?? 'image/jpeg',
        name: asset.fileName ?? 'upload.jpg',
      } as unknown as Blob);
      const { url } = await adminApi.upload(formData);
      onChange(url);
    } catch (e: unknown) {
      Alert.alert('Erreur', e instanceof Error ? e.message : "Impossible d'uploader l'image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.box} onPress={pickImage} disabled={uploading}>
        {uploading ? (
          <ActivityIndicator color={COLORS.gold} />
        ) : value ? (
          <Image source={{ uri: value }} style={styles.preview} resizeMode="cover" />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="cloud-upload-outline" size={28} color={COLORS.textMuted} />
            <Text style={styles.placeholderText}>Choisir une image</Text>
          </View>
        )}
      </TouchableOpacity>
      {!!value && (
        <TouchableOpacity onPress={() => onChange('')}>
          <Text style={styles.remove}>Retirer l'image</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6, marginTop: 8 },
  label: { color: COLORS.textLight, fontSize: 12, fontWeight: '600' },
  box: {
    height: 120,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    overflow: 'hidden',
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  preview: { width: '100%', height: '100%' },
  placeholder: { alignItems: 'center', gap: 6 },
  placeholderText: { color: COLORS.textMuted, fontSize: 12 },
  remove: { color: '#e74c3c', fontSize: 12, fontWeight: '600' },
});
