import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import {
  getTodos as getTodosApi,
  createTodo as createTodoApi,
  updateTodo as updateTodoApi,
  removeTodo as removeTodoApi,
} from '@/api/todo';
import type {
  GetTodoResponse,
  Todo,
  TodoFilterValue,
  TodoRequest,
} from '@/types/todo';
import { getErrorMessage } from '@/utils/helpers';
import type { RootState } from '@/types/store';
import {
  addAsyncBuilderCases,
  initAsyncParticle,
  type AsyncParticle,
} from '../utils';

export interface TodosState {
  filterValue: TodoFilterValue;
  fetchTodos: AsyncParticle<GetTodoResponse>;
}

const initialState: TodosState = {
  filterValue: 'all',
  fetchTodos: initAsyncParticle(),
};

export const fetchTodos = createAsyncThunk<
  GetTodoResponse,
  void,
  { state: RootState; rejectValue: string }
>('todos/fetchTodos', async (_: void, { getState, rejectWithValue }) => {
  try {
    const filter = getState().todos.filterValue;
    const res = await getTodosApi(filter);

    return res;
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const createTodo = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>('todos/createTodo', async (title, { rejectWithValue }) => {
  try {
    await createTodoApi(title);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const updateTodo = createAsyncThunk<
  void,
  { id: Todo['id']; fields: TodoRequest },
  { rejectValue: string }
>('todos/updateTodo', async ({ id, fields }, { rejectWithValue }) => {
  try {
    await updateTodoApi(id, fields);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const removeTodo = createAsyncThunk<
  void,
  Todo['id'],
  { rejectValue: string }
>('todos/removeTodo', async (id, { rejectWithValue }) => {
  try {
    await removeTodoApi(id);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setFilterValue(state, action: PayloadAction<TodoFilterValue>) {
      state.filterValue = action.payload;
    },
  },
  extraReducers: (builder) => {
    addAsyncBuilderCases(builder, fetchTodos, 'fetchTodos');
  },
});

export const { setFilterValue } = todosSlice.actions;

export default todosSlice.reducer;
