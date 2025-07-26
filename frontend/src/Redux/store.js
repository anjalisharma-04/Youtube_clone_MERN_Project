import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Import slices
import authReducer from './slice/authSlice.js';
import channelReducer from './slice/channelSlice.js';
import videoReducer from './slice/videoSlice.js';
import commentsReducer from './slice/commentsSlice.js';

// Persist configuration for individual slices
const createPersistConfig = (key) => ({
  key,
  storage,
});

const persistedAuth = persistReducer(createPersistConfig('auth'), authReducer);
const persistedChannel = persistReducer(createPersistConfig('channel'), channelReducer);
const persistedVideo = persistReducer(createPersistConfig('video'), videoReducer);
const persistedComments = persistReducer(createPersistConfig('comments'), commentsReducer);

// Create Redux store with persisted reducers
const store = configureStore({
  reducer: {
    auth: persistedAuth,
    channel: persistedChannel,
    video: persistedVideo,
    comments: persistedComments,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Avoid serialization errors due to redux-persist
    }),
});

// Export persistor and store
export const persistor = persistStore(store);
export default store;
