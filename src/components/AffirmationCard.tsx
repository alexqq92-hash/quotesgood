import React, { useState } from 'react';
import { View, Text, Pressable, Share, Modal, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Share2, FolderPlus, Plus, Check, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Affirmation, CATEGORY_LABELS } from '@/data/affirmations';
import { Theme } from '@/lib/themes';
import { useFavoritesStore } from '@/lib/favorites-store';
import { useCurrentBackground } from '@/lib/background-store';
import { useCollectionsStore } from '@/lib/collections-store';
import { useRouter } from 'expo-router';

interface AffirmationCardProps {
  affirmation: Affirmation;
  theme: Theme;
  currentIndex: number;
  totalCount: number;
}

export function AffirmationCard({
  affirmation,
  theme,
  currentIndex,
  totalCount,
}: AffirmationCardProps) {
  const router = useRouter();
  const [showCollectionsModal, setShowCollectionsModal] = useState(false);

  const favoriteIds = useFavoritesStore((s) => s.favoriteIds);
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const isFavorite = favoriteIds.includes(affirmation.id);

  const collections = useCollectionsStore((s) => s.collections);
  const addAffirmationToCollection = useCollectionsStore((s) => s.addAffirmationToCollection);
  const removeAffirmationFromCollection = useCollectionsStore((s) => s.removeAffirmationFromCollection);
  const isAffirmationInAnyCollection = useCollectionsStore((s) => s.isAffirmationInAnyCollection);

  const isInAnyCollection = isAffirmationInAnyCollection(affirmation.text);

  const currentBackground = useCurrentBackground();

  const handleFavorite = async (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleFavorite(affirmation.id);
  };

  const handleOpenCollections = async (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowCollectionsModal(true);
  };

  const handleShare = async (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Share.share({
        message: `"${affirmation.text}"\n\n— Daily Affirmations\n\nSi quieres adentrarte en el mundo de las afirmaciones, este es tu momento ❤️\n\nhttps://apps.apple.com/app/daily-affirmations`,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleToggleCollection = async (collectionId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const collection = collections.find((c) => c.id === collectionId);
    if (!collection) return;

    const isInCollection = collection.affirmations.some((a) => a.text === affirmation.text);

    if (isInCollection) {
      const affirmationInCollection = collection.affirmations.find((a) => a.text === affirmation.text);
      if (affirmationInCollection) {
        removeAffirmationFromCollection(collectionId, affirmationInCollection.id);
      }
    } else {
      addAffirmationToCollection(collectionId, {
        text: affirmation.text,
        category: CATEGORY_LABELS[affirmation.category],
      });
    }
  };

  const handleCreateCollection = () => {
    setShowCollectionsModal(false);
    router.push('/collections');
  };

  return (
    <View style={{ flex: 1, width: '100%' }}>
      {/* Background - Image or Gradient */}
      {currentBackground ? (
        <Image
          source={currentBackground.image}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
          }}
          contentFit="cover"
          cachePolicy="memory-disk"
          priority="high"
        />
      ) : (
        <LinearGradient
          colors={[...theme.gradientColors]}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      )}

      {/* Dark overlay for better text readability when using image */}
      {currentBackground && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.25)',
          }}
        />
      )}

      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 32,
        }}
      >
        {/* Category Badge */}
        <View
          style={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            marginBottom: 32,
          }}
        >
          <Text
            style={{
              color: currentBackground ? 'rgba(255,255,255,0.8)' : theme.secondaryTextColor,
              fontSize: 12,
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: 2,
            }}
          >
            {CATEGORY_LABELS[affirmation.category]}
          </Text>
        </View>

        {/* Affirmation Text */}
        <Text
          style={{
            color: currentBackground ? '#ffffff' : theme.textColor,
            fontSize: 32,
            fontWeight: '300',
            textAlign: 'center',
            lineHeight: 46,
            letterSpacing: 0.5,
          }}
        >
          {affirmation.text}
        </Text>

        {/* Decorative Line */}
        <View
          style={{
            width: 60,
            height: 2,
            backgroundColor: currentBackground ? '#ffffff' : theme.accentColor,
            marginTop: 40,
            borderRadius: 1,
            opacity: 0.6,
          }}
        />
      </View>

      {/* Action Buttons */}
      <View
        style={{
          position: 'absolute',
          bottom: 180,
          left: 0,
          right: 0,
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 40,
        }}
      >
        <Pressable
          onPress={handleOpenCollections}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <FolderPlus
            size={28}
            color={isInAnyCollection ? theme.accentColor : (currentBackground ? 'rgba(255,255,255,0.8)' : theme.iconColor)}
          />
        </Pressable>

        <Pressable
          onPress={handleFavorite}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Heart
            size={28}
            color={isFavorite ? theme.accentColor : (currentBackground ? 'rgba(255,255,255,0.8)' : theme.iconColor)}
            fill={isFavorite ? theme.accentColor : 'transparent'}
          />
        </Pressable>

        <Pressable
          onPress={handleShare}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Share2 size={28} color={currentBackground ? 'rgba(255,255,255,0.8)' : theme.iconColor} />
        </Pressable>
      </View>

      {/* Collections Modal */}
      <Modal
        visible={showCollectionsModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCollectionsModal(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            justifyContent: 'flex-end',
          }}
          onPress={() => setShowCollectionsModal(false)}
        >
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(150)}
            style={{
              backgroundColor: '#1a1a2e',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingTop: 20,
              paddingBottom: 40,
              maxHeight: '60%',
            }}
          >
            <Pressable onPress={(e) => e.stopPropagation()}>
              {/* Handle */}
              <View
                style={{
                  width: 40,
                  height: 4,
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  borderRadius: 2,
                  alignSelf: 'center',
                  marginBottom: 16,
                }}
              />

              {/* Header */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 20,
                  marginBottom: 16,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: '#ffffff',
                  }}
                >
                  Guardar en colección
                </Text>
                <Pressable
                  onPress={() => setShowCollectionsModal(false)}
                  style={{
                    padding: 4,
                  }}
                >
                  <X size={24} color="rgba(255,255,255,0.6)" />
                </Pressable>
              </View>

              {/* Collections List */}
              {collections.length === 0 ? (
                <View
                  style={{
                    alignItems: 'center',
                    paddingVertical: 40,
                    paddingHorizontal: 20,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      color: 'rgba(255,255,255,0.6)',
                      textAlign: 'center',
                      marginBottom: 20,
                    }}
                  >
                    No tienes colecciones todavía
                  </Text>
                  <Pressable
                    onPress={handleCreateCollection}
                    style={{
                      backgroundColor: theme.accentColor,
                      paddingHorizontal: 24,
                      paddingVertical: 14,
                      borderRadius: 12,
                      flexDirection: 'row',
                      alignItems: 'center',
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
                      Crear colección
                    </Text>
                  </Pressable>
                </View>
              ) : (
                <ScrollView
                  contentContainerStyle={{ paddingHorizontal: 20 }}
                  showsVerticalScrollIndicator={false}
                >
                  {collections.map((collection) => {
                    const isInCollection = collection.affirmations.some(
                      (a) => a.text === affirmation.text
                    );

                    return (
                      <Pressable
                        key={collection.id}
                        onPress={() => handleToggleCollection(collection.id)}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          paddingVertical: 14,
                          paddingHorizontal: 14,
                          marginBottom: 10,
                          backgroundColor: isInCollection
                            ? `${collection.color}30`
                            : 'rgba(255,255,255,0.08)',
                          borderRadius: 14,
                          borderWidth: isInCollection ? 1.5 : 0,
                          borderColor: collection.color,
                        }}
                      >
                        <View
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: 12,
                            backgroundColor: `${collection.color}30`,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 14,
                          }}
                        >
                          <Text style={{ fontSize: 22 }}>{collection.icon}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text
                            style={{
                              fontSize: 16,
                              fontWeight: '600',
                              color: '#ffffff',
                            }}
                          >
                            {collection.name}
                          </Text>
                          <Text
                            style={{
                              fontSize: 12,
                              color: 'rgba(255,255,255,0.5)',
                              marginTop: 2,
                            }}
                          >
                            {collection.affirmations.length}{' '}
                            {collection.affirmations.length === 1
                              ? 'afirmación'
                              : 'afirmaciones'}
                          </Text>
                        </View>
                        {isInCollection && (
                          <View
                            style={{
                              width: 26,
                              height: 26,
                              borderRadius: 13,
                              backgroundColor: collection.color,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Check size={16} color="#ffffff" strokeWidth={3} />
                          </View>
                        )}
                      </Pressable>
                    );
                  })}

                  {/* Create new collection button */}
                  <Pressable
                    onPress={handleCreateCollection}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingVertical: 14,
                      marginTop: 6,
                      backgroundColor: `${theme.accentColor}20`,
                      borderRadius: 14,
                      borderWidth: 1,
                      borderColor: theme.accentColor,
                      borderStyle: 'dashed',
                    }}
                  >
                    <Plus size={20} color={theme.accentColor} />
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: '600',
                        color: theme.accentColor,
                        marginLeft: 8,
                      }}
                    >
                      Nueva colección
                    </Text>
                  </Pressable>
                </ScrollView>
              )}
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
    </View>
  );
}
