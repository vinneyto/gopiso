import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PlaneDescriptor } from '../hooks';
import { Matrix4 } from 'three';

interface RoomPlanesState {
  planes: PlaneDescriptor[];
  originMatrix: number[];
  originMatrixInverse: number[];
}

const initialState: RoomPlanesState = {
  planes: [],
  originMatrix: [],
  originMatrixInverse: [],
};

export const roomPlanesSlice = createSlice({
  name: 'roomPlanes',
  initialState,
  reducers: {
    setPlanes(state, action: PayloadAction<PlaneDescriptor[]>) {
      state.planes = action.payload;
    },

    setOriginMatrix(state, action: PayloadAction<number[]>) {
      state.originMatrix = action.payload;
      state.originMatrixInverse = new Matrix4()
        .fromArray(action.payload)
        .invert()
        .toArray();
    },
  },
});

export const { setPlanes } = roomPlanesSlice.actions;
