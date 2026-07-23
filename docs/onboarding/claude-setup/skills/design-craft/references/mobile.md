# Mobile & React Native Design Reference

Loaded on-demand by the design-craft skill when mobile enforcement details are needed.

## React Native Specifics

- **SafeAreaView**: Always import from `react-native-safe-area-context`, not from `react-native`. The built-in `SafeAreaView` only works on iOS and is deprecated. Install: `npm install react-native-safe-area-context` and wrap your app root in `<SafeAreaProvider>`.
- **StatusBar**: Use `barStyle="light-content"` or `barStyle="dark-content"` to control icon color. On Android, set `translucent={true}` to enable edge-to-edge rendering (content flows behind the status bar). Pair with safe area insets to avoid overlap.
- **Platform.select()**: Use for platform-specific style values without branching logic. Example: `Platform.select({ ios: { shadowOffset: { width: 0, height: 2 } }, android: { elevation: 4 } })`. Prefer this over `Platform.OS === 'ios'` ternaries in style objects.
- **KeyboardAvoidingView**: Use `behavior="padding"` on iOS and `behavior="height"` on Android. Wrap forms and input screens. Add `keyboardVerticalOffset` to account for headers/tab bars. Test on both platforms — this is a common source of layout bugs.
- **ScrollView for forms**: Always set `keyboardShouldPersistTaps="handled"` so tapping a button while the keyboard is open fires the button press instead of just dismissing the keyboard. Without this, users have to tap twice — once to dismiss, once to submit.

## Safe Areas

### iOS
- **Top**: Notch (iPhone X–14) or Dynamic Island (iPhone 14 Pro+) — approximately 59px on notched devices, 54px on Dynamic Island devices. The exact value varies; always use insets, never hardcode.
- **Bottom**: Home indicator bar — 34px. Content and interactive elements must clear this area.
- **Landscape**: Sensor housing creates insets on the leading edge. Both left and right insets can be non-zero depending on orientation.

### Android
- **Top**: Status bar height varies by device (24–48dp). Use `StatusBar.currentHeight` or safe area insets.
- **Bottom**: Navigation bar — either gesture nav (thin bar, ~16dp) or 3-button nav (~48dp). Both require clearance.
- **Camera cutouts**: Punch-hole and waterdrop notches create insets. Use `windowInsets` API or safe area context.

### Best Practices
- Use the `useSafeAreaInsets()` hook for granular control: `const insets = useSafeAreaInsets()` gives `{ top, bottom, left, right }`. Apply only the edges you need.
- Apply insets to the **outermost container** of each screen, not to individual components. Nesting safe area views causes double-padding.
- **Common failure**: Interactive content (buttons, inputs) hidden behind the home indicator on iPhone. Always add `paddingBottom: insets.bottom` to the screen container, or more if the bottom element needs breathing room.
- For tab navigators, the tab bar typically handles bottom insets automatically. Don't double-apply.

## Touch & Gestures

### Thumb Zone
- **Bottom 1/3**: Easy reach — place primary actions, navigation, and frequent interactions here.
- **Middle 1/3**: Comfortable stretch — content and secondary actions.
- **Top 1/3**: Hard to reach — place infrequent actions (settings, search, profile). Avoid placing primary CTAs here.

### Design Implications
- Primary navigation belongs at the bottom of the screen (tab bar, bottom sheet triggers).
- FABs and primary action buttons should sit in the lower-right quadrant (right-thumb dominant).
- Destructive actions can go in the hard-to-reach zone intentionally (top, behind a menu).

### Gesture Conventions
- **Swipe left** to delete/archive — iOS standard via `UISwipeActionsConfiguration`, increasingly adopted on Android. Always confirm destructive swipe actions or provide undo.
- **Pull-to-refresh** on scrollable lists — use `RefreshControl` on `ScrollView`/`FlatList`. Provide visual feedback (spinner). Don't use on non-scrollable screens.
- **Long-press** for context menus and secondary actions. Show a preview or action sheet. Use haptic feedback to confirm the long-press registered.
- **Swipe between tabs/pages** — use with care. Horizontal swipe can conflict with the system back gesture on Android (swipe from left edge) and iOS (swipe from left edge to go back). If using horizontal swipe for content, inset the gesture zone away from screen edges.

### Touch Targets
- Minimum touch target: **44x44pt** (iOS) / **48x48dp** (Android). See the accessibility reference for detailed guidance.
- Space interactive elements at least **8px** apart to prevent mis-taps.
- Invisible hit areas are fine — the visual element can be smaller than the touch target. Use `hitSlop` in React Native.

### Haptic Feedback
- Use haptics for: destructive action confirmations, toggle changes, successful submissions, pull-to-refresh threshold, long-press activation.
- iOS: `UIImpactFeedbackGenerator` (light/medium/heavy), `UINotificationFeedbackGenerator` (success/warning/error).
- React Native: Use `expo-haptics` or `react-native-haptic-feedback`. Example: `Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)`.
- Don't overuse — haptics for every tap feels buzzy and annoying. Reserve for meaningful state changes.

## Platform Conventions

### iOS (Human Interface Guidelines)

- **Tab bar** at bottom, max 5 items. The selected tab should be visually distinct (filled icon + tinted label). The tab bar persists across all top-level screens.
- **Navigation** via push/pop stack. Each tab maintains its own navigation stack. The back button appears automatically. Swipe-to-go-back from the left edge is sacred — never override this gesture or place conflicting gesture handlers on the left edge.
- **Action sheets** for contextual choices that emerge from user action (share, delete, change option). Present from the bottom on iPhone, as a popover on iPad.
- **Rounded corners** use continuous corner radius (`cornerCurve: .continuous` in UIKit, `borderCurve: 'continuous'` in RN 0.71+). Standard `borderRadius` looks subtly wrong on iOS.
- **Typography**: SF Pro (system font) is the default. Use Dynamic Type sizes. Don't override the system font unless brand guidelines require it.
- **Modals**: Present as sheets (partial or full). Dismiss via swipe-down gesture. Don't use modals for primary navigation flows.

### Android (Material Design 3)

- **Bottom navigation bar** for top-level destinations, max 5 items. For more items, use a **navigation drawer** (hamburger menu). The bottom nav persists across top-level destinations.
- **Top app bar** with optional large title that collapses on scroll. Use for screen title, navigation icon (back arrow or hamburger), and action icons.
- **FAB** (Floating Action Button) for the single most important action on a screen. Position bottom-right. Use the standard size (56dp) for primary actions, small (40dp) for secondary. Don't use multiple FABs on one screen.
- **Bottom sheets** for contextual content and supplementary actions. Modal bottom sheets for focused tasks, standard (persistent) bottom sheets for reference content.
- **Dialogs** for decisions that require user attention. Keep dialog content short. Provide clear action labels (not just "OK"/"Cancel" — use "Delete"/"Keep" etc.).
- **Typography**: Roboto (system font) is the default. Material Design 3 uses a type scale with 5 roles: Display, Headline, Title, Body, Label.
- **System back**: Always handle `BackHandler` in React Native. The system back button/gesture should navigate back or dismiss the current screen. Never leave it unhandled — users will force-close the app.

### When to Diverge from Platform Conventions

Follow platform conventions by default. Diverge **only** when all three conditions are met:
1. Brand identity genuinely requires it (not just designer preference).
2. The alternative is equally intuitive — users won't need to learn new interaction patterns.
3. The same goal can't be achieved within platform patterns (try platform-native first).

**Never override:**
- System back gesture (iOS swipe-from-left, Android back button/gesture)
- Home gesture / home indicator area
- System notification area interactions
- Accessibility features (Dynamic Type, TalkBack, VoiceOver)

## Responsive Web

### Breakpoints
- Use **content-driven breakpoints** — break when the content breaks, not at arbitrary device widths. Start designing at the smallest size and add breakpoints as the layout demands.
- Common starting points: **~600px** (compact to medium), **~900px** (medium to expanded), **~1200px** (expanded to large). Adjust based on your content.
- Name breakpoints by behavior, not device: "single-column", "two-column", "full-layout" — not "mobile", "tablet", "desktop".

### Layout Strategy
- **Reflow over hide**: Restructure layout rather than hiding content at smaller sizes. Stack columns vertically, collapse navigation into a menu, move sidebar content below main content. If content isn't important enough to show on mobile, question whether it's needed at all.
- **Avoid horizontal scroll**: The only acceptable use is image carousels/galleries, and even those need visible overflow indicators (partial next-item visibility, dots, arrows). Horizontal scroll for text content or data tables should use a scrollable container with a visible scroll indicator.
- **Flexible grids**: Use CSS Grid or Flexbox with relative units (`fr`, `%`, `minmax()`). Avoid fixed pixel widths for layout containers.

### Touch on Web
- **No hover on touch devices**: Replace hover-reveal interactions with tap-to-expand, visible action buttons, or long-press context menus.
- **Tooltips**: Use `title` attribute for basic info, tap-to-show popover for detailed tooltips. Don't rely on hover tooltips for essential information.
- **Touch targets**: Same 44x44px minimum applies. Increase padding on links and buttons for touch-friendly web.

### Viewport
- Always include: `<meta name="viewport" content="width=device-width, initial-scale=1">`
- **Never** set `maximum-scale=1` or `user-scalable=no` — this prevents pinch-to-zoom and is an accessibility violation (WCAG 1.4.4). Users with low vision rely on zoom.
- For web apps that truly need zoom control (e.g., canvas-based tools), implement custom zoom controls instead of disabling native zoom.

## Performance

### Images
- Serve appropriate sizes per screen density: 1x for standard, 2x for retina, 3x for high-density mobile.
- **Web**: Use `srcset` and `sizes` attributes. Use modern formats (WebP, AVIF) with `<picture>` fallbacks.
- **React Native**: Use `@2x` and `@3x` suffixed files for static assets (e.g., `icon.png`, `icon@2x.png`, `icon@3x.png`). RN auto-selects the right one. For remote images, request the appropriate size from your CDN.
- Lazy-load images below the fold. Use `loading="lazy"` on web, or a library like `expo-image` / `react-native-fast-image` on RN.

### Lists
- **Never** render 100+ items in a `ScrollView` — it renders all items at once, consuming memory and causing jank.
- Use `FlatList` for standard lists (renders only visible items + buffer). Set `initialNumToRender`, `maxToRenderPerBatch`, and `windowSize` for fine-tuning.
- Use `FlashList` (from Shopify) for better performance on large lists — it recycles views like native `RecyclerView`/`UICollectionView`. Drop-in replacement for `FlatList`.
- Always provide a `keyExtractor` that returns a stable, unique key. Don't use array index as key for dynamic lists.

### Layout Stability
- Avoid dynamic content that causes layout shifts after initial render. Set explicit `width` and `height` on images and containers.
- Use skeleton screens or placeholder content to reserve space while loading. Don't let content jump when data arrives.
- On web, set `aspect-ratio` on media containers to prevent Cumulative Layout Shift (CLS).

### Animations
- **React Native**: Use `react-native-reanimated` for performant animations — it runs on the UI thread via worklets, avoiding JS thread bottlenecks. Prefer `useAnimatedStyle` and `useSharedValue` over the legacy `Animated` API.
- Never animate layout properties (`width`, `height`, `top`, `left`) with JS-driven animations. Use `transform` (translateX/Y, scale, rotate) and `opacity` — these are GPU-composited.
- On web, prefer CSS transitions and animations over JS-driven animation libraries for simple effects. Use `will-change` sparingly and only on elements that actually animate.
- Target 60fps. If animation frame drops are visible, reduce complexity (fewer animated properties, simpler easing, fewer simultaneous animations).

### Bundle Size
- **Web**: Lazy-load routes/screens with `React.lazy()` and `Suspense`. Split vendor bundles. Tree-shake unused exports.
- **React Native**: Use dynamic imports for heavy screens. Minimize native module bridge calls — batch them where possible. Use Hermes engine (default in modern RN) for faster startup and lower memory.
- Audit bundle size regularly. On web, use `source-map-explorer` or `webpack-bundle-analyzer`. On RN, check the JS bundle size in release builds.
