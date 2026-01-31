# Daily Affirmations

A beautiful, minimalist affirmations app inspired by "I am - Daily Affirmations".

## Features

- **Infinite Vertical Feed**: TikTok-style swipe navigation with smooth animations
- **Haptic Feedback**: Subtle vibration when swiping between affirmations
- **8 Beautiful Themes**: Midnight, Sunset, Ocean, Forest, Rose, Aurora, Dawn, Lavender
- **Favorites System**: Save your favorite affirmations with persistent storage
- **Share Functionality**: Share affirmations with friends
- **4 Categories**: Self-Esteem, Anxiety Relief, Personal Growth, Gratitude
- **Reminders System**: Configure daily reminders with customizable time ranges, frequency, and days of the week
- **Widgets Configuration**: Instructions and preview for adding home screen widgets

## Structure

```
src/
├── app/
│   ├── _layout.tsx      # Root navigation layout
│   ├── index.tsx        # Home screen with affirmation feed
│   ├── settings.tsx     # Theme selection screen
│   ├── favorites.tsx    # Saved affirmations screen
│   ├── profile.tsx      # User profile screen
│   ├── reminders.tsx    # Reminders configuration screen
│   └── widgets.tsx      # Widgets configuration screen
├── components/
│   ├── AffirmationCard.tsx  # Individual affirmation card
│   └── AffirmationFeed.tsx  # Vertical scrolling feed
├── data/
│   └── affirmations.ts  # Affirmation data and types
└── lib/
    ├── themes.ts        # Theme definitions
    ├── theme-store.ts   # Zustand store for theme state
    ├── favorites-store.ts # Zustand store for favorites
    ├── reminders-store.ts # Zustand store for reminders configuration
    └── notifications.ts # Notification scheduling logic
```

## Tech Stack

- Expo SDK 53 with Expo Router
- React Native Reanimated for animations
- Expo Haptics for vibration feedback
- Expo Linear Gradient for backgrounds
- Expo Notifications for daily reminders
- Zustand with AsyncStorage for persistence
- Lucide React Native for icons
