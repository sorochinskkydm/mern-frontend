import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchRegister = createAsyncThunk('auth/fetchRegister', async (parameters) => {
  const { data } = await axios.post('/auth/register', parameters);
  return data;
});

export const fetchAuth = createAsyncThunk('auth/fetchAuth', async (parameters) => {
  const { data } = await axios.post('/auth/login', parameters);
  return data;
});

export const fetchAuthMe = createAsyncThunk('auth/fetchAuthMe', async () => {
  const { data } = await axios.get('/auth/me');
  return data;
});

const initialState = {
  data: null,
  status: 'loading',
};

const authSlice = createSlice({
  name: 'authReducer',
  initialState: initialState,
  reducers: {
    setLogout(state) {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAuth.pending, (state) => {
      state.status = 'loading';
      state.data = null;
    });
    builder.addCase(fetchAuth.fulfilled, (state, action) => {
      state.status = 'loaded';
      state.data = action.payload;
    });
    builder.addCase(fetchAuth.rejected, (state) => {
      state.data = null;
      state.status = 'error';
    });
    builder.addCase(fetchAuthMe.pending, (state) => {
      state.status = 'loading';
      state.data = null;
    });
    builder.addCase(fetchAuthMe.fulfilled, (state, action) => {
      state.status = 'loaded';
      state.data = action.payload;
    });
    builder.addCase(fetchAuthMe.rejected, (state) => {
      state.data = null;
      state.status = 'error';
    });
    builder.addCase(fetchRegister.pending, (state) => {
      state.status = 'loading';
      state.data = null;
    });
    builder.addCase(fetchRegister.fulfilled, (state, action) => {
      state.status = 'loaded';
      state.data = action.payload;
    });
    builder.addCase(fetchRegister.rejected, (state) => {
      state.data = null;
      state.status = 'error';
    });
  },
});

export const selectIsAuth = (state) => Boolean(state.authSlice.data);

export const { setLogout } = authSlice.actions;
export default authSlice.reducer;
