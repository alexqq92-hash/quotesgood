import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Share } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Bookmark, Share2, Trash2, FolderOpen, ChevronRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeOut, FadeInDown, Layout } from 'react-native-reanimated';
import { affirmations, CATEGORY_LABELS } from '@/data/affirmations';
import { useCurrentTheme } from '@/lib/theme-store';
import { useSavedStore } from '@/lib/saved-store';
import { useCollectionsStore } from '@/lib/collections-store';

export default function SavedScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const currentTheme = useCurrentTheme();
  const savedIds = useSavedStore((s) => s.savedIds);
  const removeSaved = useSavedStore((s) => s.removeSaved);
  const collections = useCollectionsStore((s) => s.collections);

  const [activeTab, setActiveTab] = useState<'saved' | 'collections'>('saved');

  const savedAffirmations = affirmations.filter((a) =>
    savedIds.includes(a.id)
  );

  const handleRemove = async (id: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    removeSaved(id);
  };

  const handleShare = async (text: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Share.share({
        message: `"${text}"\n\n— Daily Affirmations`,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleTabChange = async (tab: 'saved' | 'collections') => {
    await Haptics.selectionAsync();
    setActiveTab(tab);
  };

  const openCollection = (id: string) => {
    Haptics.selectionAsync();
    router.push(`/collection/${id}`);
  };

  const goToCollections = () => {
    Haptics.selectionAsync();
    router.push('/collections');
  };

  return (
    <View style={{ flex: 1, backgroundColor: currentTheme.gradientColors[0] }}>
      <LinearGradient
        colors={[...currentTheme.gradientColors]}
        style={{
          flex: 1,
          paddingTop: insets.top,
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 16,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: 'rgba(255,255,255,0.15)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ChevronLeft size={24} color={currentTheme.iconColor} />
          </Pressable>
          <Text
            style={{
              flex: 1,
              color: currentTheme.textColor,
              fontSize: 20,
              fontWeight: '600',
              textAlign: 'center',
              marginRight: 40,
            }}
          >
            Mi Biblioteca
          </Text>
        </View>

        {/* Tabs */}
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: 20,
            marginBottom: 20,
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: 12,
            padding: 4,
          }}
        >
          <Pressable
            onPress={() => handleTabChange('saved')}
            style={{
              flex: 1,
              paddingVertical: 12,
              borderRadius: 10,
              backgroundColor: activeTab === 'saved' ? 'rgba(255,255,255,0.2)' : 'transparent',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: activeTab === 'saved' ? currentTheme.textColor : currentTheme.secondaryTextColor,
                fontSize: 14,
                fontWeight: '600',
              }}
            >
              Guardados
            </Text>
          </Pressable>
          <Pressable
            onPress={() => handleTabChange('collections')}
            style={{
              flex: 1,
              paddingVertical: 12,
              borderRadius: 10,
              backgroundColor: activeTab === 'collections' ? 'rgba(255,255,255,0.2)' : 'transparent',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: activeTab === 'collections' ? currentTheme.textColor : currentTheme.secondaryTextColor,
                fontSize: 14,
                fontWeight: '600',
              }}
            >
              Colecciones
            </Text>
          </Pressable>
        </View>

        {/* Saved Tab Content */}
        {activeTab === 'saved' && (
          <>
            {savedAffirmations.length === 0 ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 48,
                }}
              >
                <Bookmark
                  size={64}
                  color={currentTheme.secondaryTextColor}
                  strokeWidth={1}
                />
                <Text
                  style={{
                    color: currentTheme.textColor,
                    fontSize: 20,
                    fontWeight: '600',
                    marginTop: 24,
                    textAlign: 'center',
                  }}
                >
                  Sin afirmaciones guardadas
                </Text>
                <Text
                  style={{
                    color: currentTheme.secondaryTextColor,
                    fontSize: 15,
                    marginTop: 12,
                    textAlign: 'center',
                    lineHeight: 22,
                  }}
                >
                  Toca el icono de marcador en cualquier afirmación para guardarla aquí
                </Text>
              </View>
            ) : (
              <ScrollView
                contentContainerStyle={{
                  paddingHorizontal: 20,
                  paddingBottom: insets.bottom + 24,
                }}
                showsVerticalScrollIndicator={false}
              >
                <Text
                  style={{
                    color: currentTheme.secondaryTextColor,
                    fontSize: 13,
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: 1.5,
                    marginBottom: 16,
                    marginTop: 8,
                  }}
                >
                  {savedAffirmations.length} guardadas
                </Text>

                {savedAffirmations.map((affirmation) => (
                  <Animated.View
                    key={affirmation.id}
                    entering={FadeIn.duration(300)}
                    exiting={FadeOut.duration(200)}
                    layout={Layout.springify()}
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderRadius: 16,
                      padding: 20,
                      marginBottom: 12,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        alignSelf: 'flex-start',
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderRadius: 8,
                        marginBottom: 12,
                      }}
                    >
                      <Text
                        style={{
                          color: currentTheme.secondaryTextColor,
                          fontSize: 10,
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: 1,
                        }}
                      >
                        {CATEGORY_LABELS[affirmation.category]}
                      </Text>
                    </View>

                    <Text
                      style={{
                        color: currentTheme.textColor,
                        fontSize: 17,
                        lineHeight: 26,
                        fontWeight: '400',
                      }}
                    >
                      {affirmation.text}
                    </Text>

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        marginTop: 16,
                        gap: 12,
                      }}
                    >
                      <Pressable
                        onPress={() => handleShare(affirmation.text)}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Share2 size={18} color={currentTheme.iconColor} />
                      </Pressable>
                      <Pressable
                        onPress={() => handleRemove(affirmation.id)}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Trash2 size={18} color="#f87171" />
                      </Pressable>
                    </View>
                  </Animated.View>
                ))}
              </ScrollView>
            )}
          </>
        )}

        {/* Collections Tab Content */}
        {activeTab === 'collections' && (
          <>
            {collections.length === 0 ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 48,
                }}
              >
                <FolderOpen
                  size={64}
                  color={currentTheme.secondaryTextColor}
                  strokeWidth={1}
                />
                <Text
                  style={{
                    color: currentTheme.textColor,
                    fontSize: 20,
                    fontWeight: '600',
                    marginTop: 24,
                    textAlign: 'center',
                  }}
                >
                  Sin colecciones
                </Text>
                <Text
                  style={{
                    color: currentTheme.secondaryTextColor,
                    fontSize: 15,
                    marginTop: 12,
                    textAlign: 'center',
                    lineHeight: 22,
                  }}
                >
                  Crea tu primera colección para organizar tus afirmaciones favoritas
                </Text>
                <Pressable
                  onPress={goToCollections}
                  style={{
                    marginTop: 24,
                    backgroundColor: currentTheme.accentColor,
                    paddingHorizontal: 24,
                    paddingVertical: 14,
                    borderRadius: 12,
                  }}
                >
                  <Text
                    style={{
                      color: '#ffffff',
                      fontSize: 16,
                      fontWeight: '600',
                    }}
                  >
                    Crear colección
                  </Text>
                </Pressable>
              </View>
            ) : (
              <ScrollView
                contentContainerStyle={{
                  paddingHorizontal: 20,
                  paddingBottom: insets.bottom + 24,
                }}
                showsVerticalScrollIndicator={false}
              >
                <Text
                  style={{
                    color: currentTheme.secondaryTextColor,
                    fontSize: 13,
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: 1.5,
                    marginBottom: 16,
                    marginTop: 8,
                  }}
                >
                  {collections.length} {collections.length === 1 ? 'colección' : 'colecciones'}
                </Text>

                {collections.map((collection, index) => (
                  <Animated.View
                    key={collection.id}
                    entering={FadeInDown.delay(index * 50).springify()}
                  >
                    <Pressable
                      onPress={() => openCollection(collection.id)}
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.1)',
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
                            color: currentTheme.textColor,
                            marginBottom: 4,
                          }}
                        >
                          {collection.name}
                        </Text>
                        <Text
                          style={{
                            fontSize: 13,
                            color: currentTheme.secondaryTextColor,
                          }}
                        >
                          {collection.affirmations.length}{' '}
                          {collection.affirmations.length === 1
                            ? 'afirmación'
                            : 'afirmaciones'}
                        </Text>
                      </View>
                      <ChevronRight size={20} color={currentTheme.secondaryTextColor} />
                    </Pressable>
                  </Animated.View>
                ))}

                {/* Manage collections button */}
                <Pressable
                  onPress={goToCollections}
                  style={{
                    marginTop: 8,
                    paddingVertical: 14,
                    alignItems: 'center',
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.15)',
                    borderStyle: 'dashed',
                  }}
                >
                  <Text
                    style={{
                      color: currentTheme.accentColor,
                      fontSize: 15,
                      fontWeight: '600',
                    }}
                  >
                    Gestionar colecciones
                  </Text>
                </Pressable>
              </ScrollView>
            )}
          </>
        )}
      </LinearGradient>
    </View>
  );
}
