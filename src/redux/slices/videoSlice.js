 import { createSlice } from '@reduxjs/toolkit';

const videoSlice = createSlice({
  name: 'video',
  initialState: {
    videos: [],
    currentVideo: null,
    loading: false,
  },
  reducers: {
    setVideos: (state, action) => {
      state.videos = action.payload;
    },
    setCurrentVideo: (state, action) => {
      state.currentVideo = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setVideos, setCurrentVideo, setLoading } = videoSlice.actions;
export default videoSlice.reducer;
