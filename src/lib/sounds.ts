// Catálogo de sonidos relajantes para alarmas y recordatorios
import { Audio, AVPlaybackStatus } from 'expo-av';
import * as Haptics from 'expo-haptics';

export interface SoundOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  // URL del sonido para preview y notificaciones
  soundUrl: string;
}

// Sonidos relajantes usando URLs públicas confiables
// Todos son sonidos suaves y delicados, ideales para meditación
export const RELAXING_SOUNDS: SoundOption[] = [
  {
    id: 'default',
    name: 'Tono Suave',
    description: 'Notificación delicada del sistema',
    icon: '🔔',
    soundUrl: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
  },
  {
    id: 'harp-gentle',
    name: 'Arpa Celestial',
    description: 'Notas de arpa suaves y etéreas',
    icon: '🎵',
    soundUrl: 'https://cdn.freesound.org/previews/411/411089_5121236-lq.mp3',
  },
  {
    id: 'piano-soft',
    name: 'Piano Sereno',
    description: 'Acordes de piano delicados',
    icon: '🎹',
    soundUrl: 'https://assets.mixkit.co/active_storage/sfx/2870/2870-preview.mp3',
  },
  {
    id: 'bells-magic',
    name: 'Campanitas Mágicas',
    description: 'Tintineo suave y encantador',
    icon: '✨',
    soundUrl: 'https://assets.mixkit.co/active_storage/sfx/2868/2868-preview.mp3',
  },
  {
    id: 'chime-positive',
    name: 'Melodía Positiva',
    description: 'Tono alegre y reconfortante',
    icon: '🌟',
    soundUrl: 'https://assets.mixkit.co/active_storage/sfx/2867/2867-preview.mp3',
  },
  {
    id: 'gentle-notification',
    name: 'Aviso Gentil',
    description: 'Notificación muy suave',
    icon: '💫',
    soundUrl: 'https://assets.mixkit.co/active_storage/sfx/2866/2866-preview.mp3',
  },
  {
    id: 'dreamy-chime',
    name: 'Sueño Tranquilo',
    description: 'Melodía para despertar suavemente',
    icon: '🌙',
    soundUrl: 'https://assets.mixkit.co/active_storage/sfx/2864/2864-preview.mp3',
  },
  {
    id: 'morning-light',
    name: 'Luz de la Mañana',
    description: 'Despertar con paz',
    icon: '🌅',
    soundUrl: 'https://assets.mixkit.co/active_storage/sfx/2863/2863-preview.mp3',
  },
];

export function getSoundById(id: string): SoundOption {
  return RELAXING_SOUNDS.find((s) => s.id === id) ?? RELAXING_SOUNDS[0];
}

export function getSoundName(id: string): string {
  const sound = getSoundById(id);
  return sound.name;
}

// Instancia de sonido actual para preview
let currentSound: Audio.Sound | null = null;
let currentPlayingSoundId: string | null = null;
let playbackStatusCallback: ((soundId: string | null, isPlaying: boolean) => void) | null = null;

// Cache de sonidos precargados para reproducción instantánea
const preloadedSounds: Map<string, Audio.Sound> = new Map();
let isPreloading = false;

// Registrar callback para estado de reproducción
export function setPlaybackStatusCallback(
  callback: ((soundId: string | null, isPlaying: boolean) => void) | null
): void {
  playbackStatusCallback = callback;
}

// Obtener el ID del sonido actualmente reproduciéndose
export function getCurrentPlayingSoundId(): string | null {
  return currentPlayingSoundId;
}

// Precargar todos los sonidos para reproducción instantánea
export async function preloadAllSounds(): Promise<void> {
  if (isPreloading) return;
  isPreloading = true;

  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });

    // Precargar cada sonido en paralelo
    const preloadPromises = RELAXING_SOUNDS.map(async (soundOption) => {
      try {
        // Skip si ya está precargado
        if (preloadedSounds.has(soundOption.id)) return;

        const { sound } = await Audio.Sound.createAsync(
          { uri: soundOption.soundUrl },
          { shouldPlay: false, volume: 0.8 }
        );
        preloadedSounds.set(soundOption.id, sound);
      } catch (error) {
        console.log('[Sounds] Failed to preload:', soundOption.name);
      }
    });

    await Promise.all(preloadPromises);
    console.log('[Sounds] Preloaded', preloadedSounds.size, 'sounds');
  } catch (error) {
    console.error('[Sounds] Error preloading sounds:', error);
  } finally {
    isPreloading = false;
  }
}

// Limpiar sonidos precargados
export async function unloadAllSounds(): Promise<void> {
  for (const sound of preloadedSounds.values()) {
    try {
      await sound.unloadAsync();
    } catch (e) {
      // Ignorar
    }
  }
  preloadedSounds.clear();
}

// Reproducir sonido de preview (usa caché si está disponible)
export async function playPreviewSound(soundId: string): Promise<boolean> {
  try {
    // Si el mismo sonido está reproduciéndose, detenerlo
    if (currentPlayingSoundId === soundId && currentSound) {
      await stopPreviewSound();
      return false;
    }

    // Detener sonido anterior si existe
    await stopPreviewSound();

    const soundOption = getSoundById(soundId);

    // Vibrar para feedback inmediato
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Marcar como reproduciéndose inmediatamente
    currentPlayingSoundId = soundId;
    playbackStatusCallback?.(soundId, true);

    // Configurar modo de audio
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });

    // Intentar usar sonido precargado
    const preloadedSound = preloadedSounds.get(soundId);
    if (preloadedSound) {
      try {
        await preloadedSound.setPositionAsync(0);
        await preloadedSound.playAsync();
        currentSound = preloadedSound;

        // Configurar callback para cuando termine
        preloadedSound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
          if (status.isLoaded && status.didJustFinish) {
            if (currentPlayingSoundId === soundId) {
              currentPlayingSoundId = null;
              playbackStatusCallback?.(null, false);
              currentSound = null;
            }
          }
        });

        return true;
      } catch (e) {
        // Si falla el precargado, cargar de nuevo
        preloadedSounds.delete(soundId);
      }
    }

    // Cargar y reproducir el sonido (fallback)
    const { sound } = await Audio.Sound.createAsync(
      { uri: soundOption.soundUrl },
      { shouldPlay: true, volume: 0.8 },
      (status: AVPlaybackStatus) => {
        if (status.isLoaded && status.didJustFinish) {
          if (currentPlayingSoundId === soundId) {
            currentPlayingSoundId = null;
            playbackStatusCallback?.(null, false);
            sound.unloadAsync().catch(() => {});
            if (currentSound === sound) {
              currentSound = null;
            }
          }
        }
      }
    );

    currentSound = sound;
    return true;
  } catch (error) {
    console.error('[Sounds] Error playing preview:', error);
    currentPlayingSoundId = null;
    playbackStatusCallback?.(null, false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    return false;
  }
}

// Detener sonido de preview
export async function stopPreviewSound(): Promise<void> {
  const wasPlaying = currentPlayingSoundId;
  currentPlayingSoundId = null;

  if (wasPlaying) {
    playbackStatusCallback?.(null, false);
  }

  try {
    if (currentSound) {
      const soundToUnload = currentSound;
      currentSound = null;
      await soundToUnload.stopAsync();
      await soundToUnload.unloadAsync();
    }
  } catch (error) {
    // Ignorar errores al detener
    console.log('[Sounds] Error stopping (ignored):', error);
  }
}

// Reproducir sonido para notificación (más largo)
export async function playNotificationSound(soundId: string): Promise<void> {
  try {
    const soundOption = getSoundById(soundId);
    console.log('[Sounds] Playing notification sound:', soundOption.name, soundOption.soundUrl);

    // Configurar modo de audio para iOS
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: false,
    });

    // Crear y reproducir el sonido
    const { sound } = await Audio.Sound.createAsync(
      { uri: soundOption.soundUrl },
      {
        shouldPlay: true,
        volume: 1.0,
        isLooping: false,
      }
    );

    console.log('[Sounds] Sound created and playing');

    // Vibrar con patrón para notificación
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Auto-limpiar después de que termine
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        console.log('[Sounds] Sound finished, cleaning up');
        sound.unloadAsync();
      }
    });
  } catch (error) {
    console.error('[Sounds] Error playing notification sound:', error);
    // Intentar vibrar aunque falle el sonido
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }
}
