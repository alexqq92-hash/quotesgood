import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Switch, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useCurrentTheme } from '@/lib/theme-store';
import { useUserStore } from '@/lib/user-store';
import {
  ChevronLeft,
  Bell,
  Clock,
  FileText,
  Shield,
  Crown,
  User,
  X,
} from 'lucide-react-native';

interface SettingsRowProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  hasSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  onPress?: () => void;
  isLast?: boolean;
  accentColor: string;
  textColor: string;
}

function SettingsRow({
  icon,
  label,
  value,
  hasSwitch = false,
  switchValue = false,
  onSwitchChange,
  onPress,
  isLast = false,
  accentColor,
  textColor,
}: SettingsRowProps) {
  const content = (
    <View
      className="flex-row items-center justify-between"
      style={{
        minHeight: 56,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
      }}
    >
      <View className="flex-row items-center flex-1 mr-3">
        <View className="w-6 items-center mr-3">
          {icon}
        </View>
        <Text
          className="text-base font-medium"
          style={{ color: textColor }}
        >
          {label}
        </Text>
      </View>
      {value && (
        <Text
          className="text-sm"
          style={{ color: textColor, opacity: 0.6 }}
        >
          {value}
        </Text>
      )}
      {hasSwitch && (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: 'rgba(0,0,0,0.1)', true: accentColor }}
          thumbColor="#fff"
        />
      )}
    </View>
  );

  if (hasSwitch) {
    return content;
  }

  return (
    <Pressable onPress={onPress}>
      {content}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const theme = useCurrentTheme();
  const router = useRouter();

  // User name from store
  const userName = useUserStore((s) => s.userName);
  const setUserName = useUserStore((s) => s.setUserName);

  // Modal state
  const [showNameModal, setShowNameModal] = useState(false);
  const [tempName, setTempName] = useState(userName);

  // Switch states
  const [pushNotification, setPushNotification] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(true);

  const accentColor = theme.accentColor;
  const cardTextColor = '#1a1a2e';

  useEffect(() => {
    setTempName(userName);
  }, [userName]);

  const handleSaveName = () => {
    setUserName(tempName.trim());
    setShowNameModal(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.gradientColors[0] }}>
      <LinearGradient
        colors={[...theme.gradientColors]}
        style={{ flex: 1, paddingTop: insets.top }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
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
            style={{
              padding: 8,
              marginLeft: -8,
            }}
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
            Ajustes
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: insets.bottom + 100,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Premium Section */}
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: theme.textColor,
              marginBottom: 12,
              marginTop: 10,
            }}
          >
            Premium
          </Text>

          <View
            style={{
              backgroundColor: 'rgba(255,255,255,0.75)',
              borderRadius: 10,
              overflow: 'hidden',
              marginBottom: 24,
            }}
          >
            <SettingsRow
              icon={<Crown size={22} color="#FFD700" />}
              label="Gestionar suscripción"
              onPress={() => {}}
              isLast={true}
              accentColor={accentColor}
              textColor={cardTextColor}
            />
          </View>

          {/* Personalization Section */}
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: theme.textColor,
              marginBottom: 12,
            }}
          >
            Personalización
          </Text>

          <View
            style={{
              backgroundColor: 'rgba(255,255,255,0.75)',
              borderRadius: 10,
              overflow: 'hidden',
              marginBottom: 24,
            }}
          >
            <SettingsRow
              icon={<User size={22} color={accentColor} />}
              label="Nombre"
              value={userName || 'No name'}
              onPress={() => setShowNameModal(true)}
              isLast={true}
              accentColor={accentColor}
              textColor={cardTextColor}
            />
          </View>

          {/* Notifications Section */}
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: theme.textColor,
              marginBottom: 12,
            }}
          >
            Notificaciones
          </Text>

          <View
            style={{
              backgroundColor: 'rgba(255,255,255,0.75)',
              borderRadius: 10,
              overflow: 'hidden',
              marginBottom: 24,
            }}
          >
            <SettingsRow
              icon={<Bell size={22} color={accentColor} />}
              label="Notificaciones Push"
              hasSwitch
              switchValue={pushNotification}
              onSwitchChange={setPushNotification}
              accentColor={accentColor}
              textColor={cardTextColor}
            />
            <SettingsRow
              icon={<Clock size={22} color={accentColor} />}
              label="Recordatorio diario"
              hasSwitch
              switchValue={dailyReminder}
              onSwitchChange={setDailyReminder}
              isLast
              accentColor={accentColor}
              textColor={cardTextColor}
            />
          </View>

          {/* Other Settings Section */}
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: theme.textColor,
              marginBottom: 12,
            }}
          >
            Otros ajustes
          </Text>

          <View
            style={{
              backgroundColor: 'rgba(255,255,255,0.75)',
              borderRadius: 10,
              overflow: 'hidden',
              marginBottom: 24,
            }}
          >
            <SettingsRow
              icon={<FileText size={22} color={accentColor} />}
              label="Términos y condiciones"
              onPress={() => {}}
              accentColor={accentColor}
              textColor={cardTextColor}
            />
            <SettingsRow
              icon={<Shield size={22} color={accentColor} />}
              label="Privacidad"
              onPress={() => {}}
              isLast
              accentColor={accentColor}
              textColor={cardTextColor}
            />
          </View>

          {/* Save Button */}
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => ({
              backgroundColor: pressed ? accentColor + 'dd' : accentColor,
              paddingVertical: 16,
              borderRadius: 30,
              alignItems: 'center',
              marginTop: 10,
            })}
          >
            <Text
              style={{
                color: '#fff',
                fontSize: 16,
                fontWeight: '600',
              }}
            >
              Guardar cambios
            </Text>
          </Pressable>
        </ScrollView>
      </LinearGradient>

      {/* Name Modal */}
      <Modal
        visible={showNameModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNameModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <Pressable
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 20,
            }}
            onPress={() => setShowNameModal(false)}
          >
            <Pressable
              style={{
                backgroundColor: '#fff',
                borderRadius: 16,
                padding: 24,
                width: '100%',
                maxWidth: 340,
              }}
              onPress={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <View className="flex-row items-center justify-between mb-4">
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: '600',
                    color: cardTextColor,
                  }}
                >
                  Your name
                </Text>
                <Pressable onPress={() => setShowNameModal(false)}>
                  <X size={24} color="#666" />
                </Pressable>
              </View>

              <Text
                style={{
                  fontSize: 14,
                  color: '#666',
                  marginBottom: 16,
                }}
              >
                Your name will be used to personalize the content
              </Text>

              {/* Input */}
              <TextInput
                value={tempName}
                onChangeText={setTempName}
                placeholder="Enter your name..."
                placeholderTextColor="#999"
                style={{
                  backgroundColor: '#f5f5f5',
                  borderRadius: 12,
                  padding: 16,
                  fontSize: 16,
                  color: cardTextColor,
                  marginBottom: 20,
                }}
                autoFocus
              />

              {/* Save Button */}
              <Pressable
                onPress={handleSaveName}
                style={({ pressed }) => ({
                  backgroundColor: pressed ? accentColor + 'dd' : accentColor,
                  paddingVertical: 14,
                  borderRadius: 12,
                  alignItems: 'center',
                })}
              >
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: '600',
                  }}
                >
                  Save
                </Text>
              </Pressable>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
