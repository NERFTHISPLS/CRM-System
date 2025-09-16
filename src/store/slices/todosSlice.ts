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
  Todo,
  TodoFilterValue,
  TodoInfo,
  TodoRequest,
} from '@/types/todo';
import { getErrorMessage } from '@/utils/helpers';
import type { RootState } from '@/types/store';

export interface TodosState {
  isLoading: boolean;
  todos: Todo[];
  info: TodoInfo | null;
  filterValue: TodoFilterValue;
  error: string | null;
}

const initialState: TodosState = {
  isLoading: false,
  todos: [],
  info: null,
  filterValue: 'all',
  error: null,
};

export const fetchTodos = createAsyncThunk<
  { data: Todo[]; info: TodoInfo },
  void,
  { state: RootState; rejectValue: string }
>('todos/fetchTodos', async (_: void, { getState, rejectWithValue }) => {
  try {
    const filter = getState().todos.filterValue;
    const res = await getTodosApi(filter);

    return { data: res.data, info: res.info };
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
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.todos = action.payload.data;
        state.info = action.payload.info;
        state.error = null;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Unknown error occurred';
      });
  },
});

export const { setFilterValue } = todosSlice.actions;

export default todosSlice.reducer;
