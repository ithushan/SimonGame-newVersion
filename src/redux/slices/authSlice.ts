import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    email: string;
    isLoggedIn: boolean;
}

const initialState: { authValue: AuthState } = {
    authValue: {
        email: "",
        isLoggedIn: false,
    }
}

const AuthSlice = createSlice({
    name: "AuthSlice",
    initialState,  
    reducers: {
        updateAuthDetails: (state, action: PayloadAction<AuthState>) => {
            state.authValue = { ...state.authValue, ...action.payload }
        }
    }
});

export default AuthSlice.reducer;
export const { updateAuthDetails } = AuthSlice.actions;