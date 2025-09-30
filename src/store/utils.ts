import type { ActionReducerMapBuilder, AsyncThunk } from '@reduxjs/toolkit';
import type { Draft } from 'immer';

interface AsyncDataStatus {
  hasError: boolean;
  isIdle: boolean;
  isLoading: boolean;
}

export interface AsyncParticle<T = unknown> {
  data: T | null;
  error: string | null;
  status: 'idle' | 'pending' | 'fulfilled' | 'rejected';
}

export interface AsyncRequestData<T> {
  data: T | null;
  error: string | null;
  status: AsyncDataStatus;
}

export function initAsyncParticle<T>(data: T | null = null): AsyncParticle<T> {
  return { data, error: null, status: 'idle' };
}

export function addAsyncBuilderCases<State, Returned, ThunkArg>(
  builder: ActionReducerMapBuilder<State>,
  sliceMethod: AsyncThunk<Returned, ThunkArg, { rejectValue: string }>,
  key: keyof State
): void {
  builder
    .addCase(sliceMethod.pending, (state: Draft<State>) => {
      const entry = state as Record<keyof State, AsyncParticle>;
      entry[key].status = 'pending';
      entry[key].error = null;
    })
    .addCase(sliceMethod.fulfilled, (state: Draft<State>, action) => {
      const entry = state as Record<keyof State, AsyncParticle>;
      entry[key].status = 'fulfilled';
      entry[key].data = action.payload;
      entry[key].error = null;
    })
    .addCase(sliceMethod.rejected, (state: Draft<State>, action) => {
      const entry = state as Record<keyof State, AsyncParticle>;
      entry[key].error = action.payload ?? 'Unknown error occurred';
      entry[key].status = 'rejected';
    });
}

export function getAsyncRequestData<T>(
  stateParam: AsyncParticle<T>
): AsyncRequestData<T> {
  return {
    data: stateParam.data,
    error: stateParam.error,
    status: getAsyncDataStatus(stateParam.status),
  };
}

function getAsyncDataStatus(
  dataStatus: AsyncParticle['status']
): AsyncDataStatus {
  return {
    hasError: dataStatus === 'rejected',
    isIdle: dataStatus === 'idle',
    isLoading: dataStatus === 'pending',
  };
}
