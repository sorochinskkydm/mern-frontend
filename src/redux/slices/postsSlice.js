import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const { data } = await axios.get('/posts');
  return data;
});

export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
  const { data } = await axios.get('/tags');
  return data;
});

export const removePost = createAsyncThunk('posts/remove', async (id) => {
  const { data } = await axios.delete(`/posts/${id}`);
  return data;
});

const initialState = {
  posts: {
    items: [],
    status: 'loading',
  },
  tags: {
    items: [],
    status: 'loading',
  },
};

const postsSlice = createSlice({
  name: 'posts',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Fetch Posts
    builder.addCase(fetchPosts.pending, (state) => {
      state.posts.status = 'loading';
    });
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.posts.status = 'loaded';
      state.posts.items = action.payload;
    });
    builder.addCase(fetchPosts.rejected, (state, action) => {
      state.posts.status = 'error';
      state.posts.items = [];
    });
    //Fetch Tags
    builder.addCase(fetchTags.pending, (state) => {
      state.tags.status = 'loading';
    });
    builder.addCase(fetchTags.fulfilled, (state, action) => {
      state.tags.status = 'loaded';
      state.tags.items = action.payload;
    });
    builder.addCase(fetchTags.rejected, (state, action) => {
      state.tags.status = 'error';
      state.tags.items = [];
    });
    //Remove post
    builder.addCase(removePost.pending, (state, action) => {
      state.posts.items = state.posts.items.filter((item) => item._id !== action.meta.arg);
    });
  },
});

export default postsSlice.reducer;
