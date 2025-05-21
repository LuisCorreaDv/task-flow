"use Client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Define the initial state types
interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
  authenticated: boolean;
}

const initialState: AuthState = {
  token: null,
  loading: false,
  error: null,
  authenticated: false,
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }: { email: string; password: string }, thunkAPI) => {
    // Simulate a delay for the login process
    await new Promise((resolve) =>
      setTimeout(resolve, Math.random() * 2000 + 500)
    );

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY as string,
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    // Check if the response is ok and contains a token
    // If not, reject the thunk with an error message
    if (!response.ok || !data.token) {
      return thunkAPI.rejectWithValue(data.error || "Login failed");
    }

    return data.token;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    //logout action to reset the state
    logout: (state) => {
      state.token = null;
      state.authenticated = false;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  //Extra reducers to handle async actions
  extraReducers: (builder) => {
    builder
    // Pending, fulfilled and rejected cases for loginUser
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
