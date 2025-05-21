import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface VerificationState {
  code: string | null;
  loading: boolean;
  error: string | null;
  verificationPassed: boolean;
}

const initialState: VerificationState = {
  code: null,
  loading: false,
  error: null,
  verificationPassed: false,
};

export const generateVerificationCode = createAsyncThunk(
  "verification/generateCode",
  async () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Generated verification code:", code);
    return code;
  }
);

export const verifyCode = createAsyncThunk(
  'verification/verifyCode',
  async (inputCode: string, thunkAPI) => {
    const state = thunkAPI.getState() as { verification: VerificationState };
    const correctCode = state.verification.code;
    
    if (!correctCode) {
      throw new Error("No verification code found");
    }

    if (inputCode === correctCode) {
      return true;
    }
    
    throw new Error("Invalid verification code");
  }
);

const verificationSlice = createSlice({
  name: "verification",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetVerification: (state) => {
      state.verificationPassed = false;
      state.error = null;
      state.code = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateVerificationCode.fulfilled, (state, action) => {
        state.code = action.payload;
        state.error = null;
        state.verificationPassed = false;
      })
      .addCase(verifyCode.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.verificationPassed = false;
      })
      .addCase(verifyCode.fulfilled, (state) => {
        state.loading = false;
        state.verificationPassed = true;
        state.error = null;
      })
      .addCase(verifyCode.rejected, (state, action) => {
        state.loading = false;
        state.verificationPassed = false;
        state.error = action.error.message || "Verification failed";
      });
  },
});

export const { clearError, resetVerification } = verificationSlice.actions;
export default verificationSlice.reducer;
