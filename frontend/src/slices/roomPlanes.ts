import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PlaneDescriptor } from '../hooks';

interface RoomPlanesState {
  planes: PlaneDescriptor[];
}

const initialState: RoomPlanesState = {
  planes: [],
};

export const roomPlanesSlice = createSlice({
  name: 'roomPlanes',
  initialState,
  reducers: {
    setPlanes(state, action: PayloadAction<PlaneDescriptor[]>) {
      state.planes = action.payload;
    },
  },
});

export const { setPlanes } = roomPlanesSlice.actions;
