import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface AuthState {
    password: string;
}
  
const initialState: AuthState = {
    password: '',
};
type AuthAction = PayloadAction<{ password: string }>;  
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      loginSuccess: (state, action: AuthAction) => {
        state.password = action.payload.password;
      },
    },
  });
  
  export const { loginSuccess } = authSlice.actions;
  export default authSlice.reducer;
  