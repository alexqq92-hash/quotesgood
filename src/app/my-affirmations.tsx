import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useCurrentTheme } from '@/lib/theme-store';
import { useMyAffirmationsStore } from '@/lib/my-affirmations-store';
import * as Haptics from 'expo-haptics';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
} from 'react-native-reanimated';
import {
  ChevronLeft,
  Plus,
  Feather,
  Trash2,
  Edit3,
  X,
  Check,
  Sparkles,
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

export default function MyAffirmationsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useCurrentTheme();

  const affirmations = useMyAffirmationsStore((s) => s.affirmations);
  const addAffirmation = useMyAffirmationsStore((s) => s.addAffirmation);
  const deleteAffirmation = useMyAffirmationsStore((s) => s.deleteAffirmation);
  const editAffirmation = useMyAffirmationsStore((s) => s.editAffirmation);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newText, setNewText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const cardBg = getCardBackground(theme);
  const cardText = getCardTextColor(theme);
  const secondaryText = getCardSecondaryColor(theme);
  const accentColor = theme.accentColor;

  const handleCreateAffirmation = () => {
    if (newText.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      addAffirmation(newText.trim());
      setNewText('');
      setShowCreateModal(false);
    }
  };

  const handleOpenEdit = (id: string, text: string) => {
    Haptics.selectionAsync();
    setEditingId(id);
    setEditingText(text);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (editingId && editingText.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      editAffirmation(editingId, editingText.trim());
      setEditingId(null);
      setEditingText('');
      setShowEditModal(false);
    }
  };

  const handleDeleteAffirmation = (id: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    deleteAffirmation(id);
    setDeleteConfirmId(null);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
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
            Mis Afirmaciones
          </Text>
        </View>

        {/* Empty State */}
        {affirmations.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 40,
            }}
          >
            <Animated.View
              entering={FadeInDown.delay(100).springify()}
              style={{
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  backgroundColor: `${accentColor}20`,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 24,
                }}
              >
                <Feather size={48} color={accentColor} />
              </View>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: '600',
                  color: cardText,
                  textAlign: 'center',
                  marginBottom: 12,
                }}
              >
                Es el momento de crear{'\n'}afirmaciones tuyas
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  color: secondaryText,
                  textAlign: 'center',
                  lineHeight: 22,
                  marginBottom: 32,
                }}
              >
                Escribe afirmaciones personales que te inspiren y te ayuden en tu camino
              </Text>
              <Pressable
                onPress={() => setShowCreateModal(true)}
                style={{
                  backgroundColor: accentColor,
                  paddingHorizontal: 28,
                  paddingVertical: 16,
                  borderRadius: 14,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Sparkles size={20} color="#ffffff" />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#ffffff',
                    marginLeft: 10,
                  }}
                >
                  Crear afirmaciones
                </Text>
              </Pressable>
            </Animated.View>
          </View>
        ) : (
          <>
            {/* Create Button */}
            <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
              <Animated.View entering={FadeInDown.delay(100).springify()}>
                <Pressable
                  onPress={() => setShowCreateModal(true)}
                  style={{
                    backgroundColor: accentColor,
                    borderRadius: 14,
                    padding: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Plus size={20} color="#ffffff" />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '600',
                      color: '#ffffff',
                      marginLeft: 8,
                    }}
                  >
                    Nueva afirmacion
                  </Text>
                </Pressable>
              </Animated.View>
            </View>

            {/* Affirmations List */}
            <ScrollView
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingBottom: insets.bottom + 100,
              }}
              showsVerticalScrollIndicator={false}
            >
              <Text
                style={{
                  fontSize: 13,
                  color: secondaryText,
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  marginBottom: 16,
                }}
              >
                {affirmations.length} {affirmations.length === 1 ? 'afirmacion' : 'afirmaciones'}
              </Text>

              {affirmations.map((affirmation, index) => (
                <Animated.View
                  key={affirmation.id}
                  entering={FadeInDown.delay(150 + index * 50).springify()}
                >
                  <View
                    style={{
                      backgroundColor: cardBg,
                      borderRadius: 16,
                      padding: 18,
                      marginBottom: 12,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        color: cardText,
                        lineHeight: 24,
                        fontStyle: 'italic',
                        marginBottom: 14,
                      }}
                    >
                      "{affirmation.text}"
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          color: secondaryText,
                        }}
                      >
                        {formatDate(affirmation.createdAt)}
                      </Text>
                      <View style={{ flexDirection: 'row', gap: 8 }}>
                        <Pressable
                          onPress={() => handleOpenEdit(affirmation.id, affirmation.text)}
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 18,
                            backgroundColor: `${accentColor}20`,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Edit3 size={16} color={accentColor} />
                        </Pressable>
                        <Pressable
                          onPress={() => setDeleteConfirmId(affirmation.id)}
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 18,
                            backgroundColor: '#FF6B6B20',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Trash2 size={16} color="#FF6B6B" />
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </Animated.View>
              ))}
            </ScrollView>
          </>
        )}
      </View>

      {/* Create Modal */}
      <Modal
        visible={showCreateModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
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
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 20,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: '600',
                      color: cardText,
                    }}
                  >
                    Nueva Afirmacion
                  </Text>
                  <Pressable
                    onPress={() => setShowCreateModal(false)}
                    style={{ padding: 4 }}
                  >
                    <X size={24} color={secondaryText} />
                  </Pressable>
                </View>

                <Text
                  style={{
                    fontSize: 14,
                    color: secondaryText,
                    marginBottom: 12,
                  }}
                >
                  Escribe tu afirmacion personal
                </Text>

                <TextInput
                  value={newText}
                  onChangeText={setNewText}
                  placeholder="Yo soy capaz de lograr todo lo que me propongo..."
                  placeholderTextColor={secondaryText}
                  multiline
                  numberOfLines={4}
                  style={{
                    backgroundColor: `${cardText}08`,
                    borderRadius: 14,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    fontSize: 16,
                    color: cardText,
                    minHeight: 120,
                    textAlignVertical: 'top',
                    marginBottom: 20,
                  }}
                  autoFocus
                />

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
                    onPress={handleCreateAffirmation}
                    style={{
                      flex: 1,
                      paddingVertical: 14,
                      borderRadius: 12,
                      backgroundColor: newText.trim() ? accentColor : `${cardText}30`,
                      alignItems: 'center',
                    }}
                    disabled={!newText.trim()}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '600',
                        color: '#ffffff',
                      }}
                    >
                      Guardar
                    </Text>
                  </Pressable>
                </View>
              </Pressable>
            </Animated.View>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>

      {/* Edit Modal */}
      <Modal
        visible={showEditModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEditModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <Pressable
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.6)',
              justifyContent: 'center',
              padding: 20,
            }}
            onPress={() => setShowEditModal(false)}
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
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 20,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: '600',
                      color: cardText,
                    }}
                  >
                    Editar Afirmacion
                  </Text>
                  <Pressable
                    onPress={() => setShowEditModal(false)}
                    style={{ padding: 4 }}
                  >
                    <X size={24} color={secondaryText} />
                  </Pressable>
                </View>

                <TextInput
                  value={editingText}
                  onChangeText={setEditingText}
                  placeholder="Tu afirmacion..."
                  placeholderTextColor={secondaryText}
                  multiline
                  numberOfLines={4}
                  style={{
                    backgroundColor: `${cardText}08`,
                    borderRadius: 14,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    fontSize: 16,
                    color: cardText,
                    minHeight: 120,
                    textAlignVertical: 'top',
                    marginBottom: 20,
                  }}
                  autoFocus
                />

                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <Pressable
                    onPress={() => setShowEditModal(false)}
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
                    onPress={handleSaveEdit}
                    style={{
                      flex: 1,
                      paddingVertical: 14,
                      borderRadius: 12,
                      backgroundColor: editingText.trim() ? accentColor : `${cardText}30`,
                      alignItems: 'center',
                    }}
                    disabled={!editingText.trim()}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '600',
                        color: '#ffffff',
                      }}
                    >
                      Guardar
                    </Text>
                  </Pressable>
                </View>
              </Pressable>
            </Animated.View>
          </Pressable>
        </KeyboardAvoidingView>
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
                ¿Eliminar afirmacion?
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: secondaryText,
                  textAlign: 'center',
                  marginBottom: 24,
                }}
              >
                Esta accion no se puede deshacer
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
                    deleteConfirmId && handleDeleteAffirmation(deleteConfirmId)
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
