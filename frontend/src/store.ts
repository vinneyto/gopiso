import { configureStore } from '@reduxjs/toolkit';
import { roomPlanesSlice } from './slices';

export const store = configureStore({
  reducer: {
    roomPlanes: roomPlanesSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
