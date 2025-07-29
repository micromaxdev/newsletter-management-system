import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authService from "./authService";

// Get user from localStorage
const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");

const initialState = {
  user: user ? user : null,
  token: token ? token : null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

// Register user
export const register = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      await authService.register(userData);
      // Immediately login after register
      const loginData = await authService.login({
        email: userData.email,
        password: userData.password,
      });
      return loginData;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// Login user
export const login = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      const data = await authService.login(userData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// Logout user
export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    await authService.logout();
    return;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message
    );
  }
});

// Get current user
export const getMe = createAsyncThunk("auth/getMe", async (_, thunkAPI) => {
  try {
    const data = await authService.getMe();
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message
    );
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("user", JSON.stringify(state.user));
        localStorage.setItem("token", state.token);
        localStorage.setItem("user", JSON.stringify(state.user));
        localStorage.setItem("token", state.token);
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.token = null;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("user", JSON.stringify(state.user));
        localStorage.setItem("token", state.token);
        localStorage.setItem("user", JSON.stringify(state.user));
        localStorage.setItem("token", state.token);
        console.log("User:", state.user);
        console.log("Token:", state.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.token = null;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      })
      // GetMe
      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(state.user));
      })
      .addCase(getMe.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
