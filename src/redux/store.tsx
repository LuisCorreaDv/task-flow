'use client';

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from '@/redux/features/authSlice';
import columnReducer from '@/redux/features/columnSlice';
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
  createTransform
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { encryptToken, decryptToken } from '@/utils/encryption';
import { compress, decompress } from '@/utils/compression';

const rootReducer = combineReducers({
  auth: authReducer,
  columns: columnReducer,
  tasks: taskReducer,
  verification: verificationReducer,
});

type RootReducerType = typeof rootReducer;

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

// Custom transform to compress/decompress the state with a whitelist for tasks
const compressionTransform = createTransform(
  (inboundState) => {
    return typeof inboundState === 'object' ? compress(JSON.stringify(inboundState)) : inboundState;
  },
  (outboundState) => {
    try {
      if (typeof outboundState === 'string') {
        return JSON.parse(decompress(outboundState) as string);
      }
      return outboundState;
    } catch (error) {
      console.error('Error decompressing state:', error);
      return {};
    }
  },
  { whitelist: ['tasks'] }
);

// Make sure that the initial state is set correctly
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'columns', 'tasks'],
  transforms: [encryptTransform, compressionTransform],
  serialize: true,
  deserialize: true,
  initialState: {
    tasks: {},
    columns: {},
    auth: {},
  },
};

// Update the persistConfig to ensure it works with the combined reducer
const persistedReducer = persistReducer<ReturnType<RootReducerType>>(
  persistConfig,
  rootReducer
);

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

// Update the RootState and AppDispatch types to use the persistedReducer
export type RootState = ReturnType<typeof persistedReducer>;
export type AppDispatch = typeof store.dispatch;
