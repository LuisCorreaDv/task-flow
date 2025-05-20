'use client';

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from '@/redux/features/authSlice';
import columnReducer from '@/redux/features/columnSlice'
import taskReducer from '@/redux/features/taskSlice';
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

//
const rootReducer = combineReducers({ 
  auth: authReducer,
  columns: columnReducer,
  tasks: taskReducer,
});


const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'columns', 'tasks'],
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
