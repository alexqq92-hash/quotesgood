import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Modal,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useCurrentTheme } from '@/lib/theme-store';
import {
  useCollectionsStore,
  COLLECTION_COLORS,
  COLLECTION_ICONS,
} from '@/lib/collections-store';
import * as Haptics from 'expo-haptics';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
} from 'react-native-reanimated';
import {
  ChevronLeft,
  Plus,
  Folder,
  Trash2,
  Check,
} from 'lucide-react-native';

function isLightTheme(theme: { group: string }): boolean {
  return theme.group === 'pastel';
}

function getCardBackground(theme: { group: string }): string {
  if (isLightTheme(theme)) {
    return 'rgba(255,255,255,0.9)';
  }
  return 'rgba(255,255,255,0.12)';
}

function getCardTextColor(theme: { group: string }): string {
  if (isLightTheme(theme)) {
    return '#1a1a2e';
  }
  return '#ffffff';
}

function getCardSecondaryColor(theme: { group: string }): string {
  if (isLightTheme(theme)) {
    return '#666666';
  }
  return 'rgba(255,255,255,0.6)';
}

export default function CollectionsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useCurrentTheme();

  const collections = useCollectionsStore((s) => s.collections);
  const createCollection = useCollectionsStore((s) => s.createCollection);
  const deleteCollection = useCollectionsStore((s) => s.deleteCollection);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(COLLECTION_ICONS[0]);
  const [selectedColor, setSelectedColor] = useState(COLLECTION_COLORS[0]);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const cardBg = getCardBackground(theme);
  const cardText = getCardTextColor(theme);
  const secondaryText = getCardSecondaryColor(theme);
  const accentColor = theme.accentColor;

  const handleCreateCollection = () => {
    if (newName.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      createCollection(newName.trim(), selectedIcon, selectedColor);
      setNewName('');
      setSelectedIcon(COLLECTION_ICONS[0]);
      setSelectedColor(COLLECTION_COLORS[0]);
      setShowCreateModal(false);
    }
  };

  const handleDeleteCollection = (id: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    deleteCollection(id);
    setDeleteConfirmId(null);
  };

  const openCollection = (id: string) => {
    Haptics.selectionAsync();
    router.push(`/collection/${id}`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.gradientColors[0] }}>
      <View
        style={{
          flex: 1,
          backgroundColor: theme.gradientColors[0],
          paddingTop: insets.top,
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 16,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            style={{ padding: 8, marginLeft: -8 }}
          >
            <ChevronLeft size={24} color={theme.textColor} />
          </Pressable>
          <Text
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: 18,
              fontWeight: '600',
              color: theme.textColor,
              marginRight: 24,
            }}
          >
            Mis Colecciones
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: insets.bottom + 100,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Create Collection Button */}
          <Animated.View entering={FadeInDown.delay(100).springify()}>
            <Pressable
              onPress={() => setShowCreateModal(true)}
              style={{
                backgroundColor: accentColor,
                borderRadius: 16,
                padding: 18,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 24,
              }}
            >
              <Plus size={22} color="#ffffff" />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#ffffff',
                  marginLeft: 10,
                }}
              >
                Crear Colección
              </Text>
            </Pressable>
          </Animated.View>

          {/* Empty State */}
          {collections.length === 0 && (
            <Animated.View
              entering={FadeInDown.delay(200).springify()}
              style={{
                alignItems: 'center',
                paddingVertical: 60,
              }}
            >
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: `${accentColor}20`,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                }}
              >
                <Folder size={40} color={accentColor} />
              </View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: cardText,
                  marginBottom: 8,
                }}
              >
                Sin colecciones
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: secondaryText,
                  textAlign: 'center',
                  lineHeight: 20,
                  paddingHorizontal: 40,
                }}
              >
                Crea tu primera colección para guardar tus afirmaciones favoritas organizadas
              </Text>
            </Animated.View>
          )}

          {/* Collections List */}
          {collections.map((collection, index) => (
            <Animated.View
              key={collection.id}
              entering={FadeInDown.delay(150 + index * 50).springify()}
            >
              <Pressable
                onPress={() => openCollection(collection.id)}
                onLongPress={() => setDeleteConfirmId(collection.id)}
                style={{
                  backgroundColor: cardBg,
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 14,
                    backgroundColor: collection.color + '30',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 14,
                  }}
                >
                  <Text style={{ fontSize: 24 }}>{collection.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '600',
                      color: cardText,
                      marginBottom: 4,
                    }}
                  >
                    {collection.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: secondaryText,
                    }}
                  >
                    {collection.affirmations.length}{' '}
                    {collection.affirmations.length === 1
                      ? 'afirmación'
                      : 'afirmaciones'}
                  </Text>
                </View>
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: collection.color,
                  }}
                />
              </Pressable>
            </Animated.View>
          ))}

          {collections.length > 0 && (
            <Text
              style={{
                fontSize: 12,
                color: secondaryText,
                textAlign: 'center',
                marginTop: 16,
              }}
            >
              Mantén presionado para eliminar
            </Text>
          )}
        </ScrollView>
      </View>

      {/* Create Collection Modal */}
      <Modal
        visible={showCreateModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            justifyContent: 'center',
            padding: 20,
          }}
          onPress={() => setShowCreateModal(false)}
        >
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(150)}
            style={{
              backgroundColor: isLightTheme(theme) ? '#ffffff' : '#1a1a2e',
              borderRadius: 24,
              padding: 24,
            }}
          >
            <Pressable onPress={(e) => e.stopPropagation()}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '600',
                  color: cardText,
                  textAlign: 'center',
                  marginBottom: 24,
                }}
              >
                Nueva Colección
              </Text>

              {/* Name Input */}
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: secondaryText,
                  marginBottom: 8,
                }}
              >
                Nombre
              </Text>
              <TextInput
                value={newName}
                onChangeText={setNewName}
                placeholder="Mi colección..."
                placeholderTextColor={secondaryText}
                style={{
                  backgroundColor: `${cardText}10`,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  fontSize: 16,
                  color: cardText,
                  marginBottom: 20,
                }}
              />

              {/* Icon Selector */}
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: secondaryText,
                  marginBottom: 10,
                }}
              >
                Icono
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginBottom: 20, flexGrow: 0 }}
              >
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {COLLECTION_ICONS.map((icon) => (
                    <Pressable
                      key={icon}
                      onPress={() => {
                        Haptics.selectionAsync();
                        setSelectedIcon(icon);
                      }}
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        backgroundColor:
                          selectedIcon === icon
                            ? `${accentColor}30`
                            : `${cardText}10`,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: selectedIcon === icon ? 2 : 0,
                        borderColor: accentColor,
                      }}
                    >
                      <Text style={{ fontSize: 22 }}>{icon}</Text>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>

              {/* Color Selector */}
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: secondaryText,
                  marginBottom: 10,
                }}
              >
                Color
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 10,
                  marginBottom: 24,
                }}
              >
                {COLLECTION_COLORS.map((color) => (
                  <Pressable
                    key={color}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setSelectedColor(color);
                    }}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: color,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: selectedColor === color ? 3 : 0,
                      borderColor: cardText,
                    }}
                  >
                    {selectedColor === color && (
                      <Check size={20} color="#ffffff" strokeWidth={3} />
                    )}
                  </Pressable>
                ))}
              </View>

              {/* Buttons */}
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <Pressable
                  onPress={() => setShowCreateModal(false)}
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    borderRadius: 12,
                    backgroundColor: `${accentColor}20`,
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '600',
                      color: accentColor,
                    }}
                  >
                    Cancelar
                  </Text>
                </Pressable>
                <Pressable
                  onPress={handleCreateCollection}
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    borderRadius: 12,
                    backgroundColor: newName.trim() ? accentColor : `${cardText}30`,
                    alignItems: 'center',
                  }}
                  disabled={!newName.trim()}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '600',
                      color: '#ffffff',
                    }}
                  >
                    Crear
                  </Text>
                </Pressable>
              </View>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={deleteConfirmId !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteConfirmId(null)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            justifyContent: 'center',
            padding: 20,
          }}
          onPress={() => setDeleteConfirmId(null)}
        >
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(150)}
            style={{
              backgroundColor: isLightTheme(theme) ? '#ffffff' : '#1a1a2e',
              borderRadius: 24,
              padding: 24,
              alignItems: 'center',
            }}
          >
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: '#FF6B6B20',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}
              >
                <Trash2 size={28} color="#FF6B6B" />
              </View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: cardText,
                  textAlign: 'center',
                  marginBottom: 8,
                }}
              >
                ¿Eliminar colección?
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: secondaryText,
                  textAlign: 'center',
                  marginBottom: 24,
                }}
              >
                Se perderán todas las afirmaciones guardadas en esta colección
              </Text>
              <View style={{ flexDirection: 'row', gap: 12, width: '100%' }}>
                <Pressable
                  onPress={() => setDeleteConfirmId(null)}
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    borderRadius: 12,
                    backgroundColor: `${cardText}15`,
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '600',
                      color: cardText,
                    }}
                  >
                    Cancelar
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() =>
                    deleteConfirmId && handleDeleteCollection(deleteConfirmId)
                  }
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    borderRadius: 12,
                    backgroundColor: '#FF6B6B',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '600',
                      color: '#ffffff',
                    }}
                  >
                    Eliminar
                  </Text>
                </Pressable>
              </View>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
    </View>
  );
}
