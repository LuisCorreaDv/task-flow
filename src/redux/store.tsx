'use client';

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from '@/redux/features/authSlice';
import columnReducer from '@/redux/features/columnSlice'
import taskReducer from '@/redux/features/taskSlice';
import verificationReducer from '@/redux/features/verificationSlice';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { encryptToken, decryptToken } from '@/utils/encryption';

const rootReducer = combineReducers({ 
  auth: authReducer,
  columns: columnReducer,
  tasks: taskReducer,
  verification: verificationReducer,
});

// Custom transform to encrypt/decrypt the token
// This transform will encrypt the token when saving to storage and decrypt it when loading from storage
const encryptTransform = {
  in: (state: { token?: string }) => {
    return state?.token ? { ...state, token: encryptToken(state.token) } : state;
  },
  out: (state: { token?: string }) => {
    return state?.token ? { ...state, token: decryptToken(state.token) } : state;
  }
};

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'columns', 'tasks'],
  // Use the custom transform for the auth slice
  transforms: [encryptTransform],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
