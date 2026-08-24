# Production-Readiness Refactor Plan

Refactor the Memetropolis frontend architecture to move from "prop-drilling" to a centralized state management system using React Context and Custom Hooks. This will make the app more maintainable, scalable, and easier to test.

## User Review Required

> [!IMPORTANT]
> This refactor will significantly change how data flows through the app. While the UI will remain identical, the component signatures for `Navbar`, `Sidebar`, `MemeCard`, and the Modals will be simplified.

## Proposed Changes

### [Core State Management]

#### [NEW] [StoreContext.jsx](file:///C:/Users/Under/OneDrive/Desktop/Memetropolis/src/context/StoreContext.jsx)
Create a centralized provider that encapsulates:
- User state (from `monetizationService`)
- Feed state (from `feedEngine`)
- Modal visibility state (consolidated into a single `activeModal` state)
- Toast notification logic

#### [NEW] [useStore.js](file:///C:/Users/Under/OneDrive/Desktop/Memetropolis/src/hooks/useStore.js)
A custom hook to provide easy access to the StoreContext.

---

### [Services Layer]

#### [MODIFY] [monetizationService.js](file:///C:/Users/Under/OneDrive/Desktop/Memetropolis/src/services/monetizationService.js)
Add data validation and migration logic to `saveUser` and `constructor` to handle schema changes gracefully.

#### [MODIFY] [feedEngine.js](file:///C:/Users/Under/OneDrive/Desktop/Memetropolis/src/services/feedEngine.js)
Improve filtering logic and add methods for batch updates if needed.

---

### [Component Refactoring]

#### [MODIFY] [App.jsx](file:///C:/Users/Under/OneDrive/Desktop/Memetropolis/src/App.jsx)
- Wrap the app in `StoreProvider`.
- Remove 80% of the local state and handlers.
- Simplify the component to primarily handle layout.

#### [MODIFY] [Navbar.jsx](file:///C:/Users/Under/OneDrive/Desktop/Memetropolis/src/components/Navbar.jsx)
Consume `user` and `modal` actions from `useStore` instead of props.

#### [MODIFY] [Sidebar.jsx](file:///C:/Users/Under/OneDrive/Desktop/Memetropolis/src/components/Sidebar.jsx)
Consume `activeCategory` and `isPro` from `useStore`.

#### [MODIFY] [MemeCard.jsx](file:///C:/Users/Under/OneDrive/Desktop/Memetropolis/src/components/MemeCard.jsx)
Consume `user` and `vote` actions from `useStore`.

---

### [Monetization Components]

#### [MODIFY] [CoinStoreModal.jsx](file:///C:/Users/Under/OneDrive/Desktop/Memetropolis/src/components/monetization/CoinStoreModal.jsx)
#### [MODIFY] [ProUpgradeModal.jsx](file:///C:/Users/Under/OneDrive/Desktop/Memetropolis/src/components/monetization/ProUpgradeModal.jsx)
Simplify props by connecting them to the central store.

## Verification Plan

### Automated Tests
- I will verify that the app still compiles and the dev server runs without errors.

### Manual Verification
1.  **Feed Navigation**: Verify switching categories (Hot, Trending, Fresh) still works and updates posts.
2.  **Monetization Flow**: Buy coins, upgrade to Pro, and verify ads disappear.
3.  **Social Actions**: Upvote/Downvote and comment on memes; verify data persists in LocalStorage.
4.  **Modal Logic**: Ensure only one modal can be open at a time and closing works correctly.
