import { createSlice, type PayloadAction } from "@reduxjs/toolkit";



interface authorizationState {
    isAuthenticated: boolean, 
    role: string | null, 
    email: string | null
}

interface authorizationResponse {
    isAuthenticated: boolean, 
    role: string, 
    email: string, 

}

const initialState: authorizationState = {
    isAuthenticated: false, 
    role: null, 
    email: null, 
}

const authorizationSlice = createSlice({
    name: 'authorization',
    initialState,
    reducers: {
        setAuthorizationLogin: (state, action: PayloadAction<authorizationResponse>) => {
            state.isAuthenticated = true
            state.email = action.payload.email
            state.role = action.payload.role
        },
        setAuthorizationLogout: (state) => {
            state = {
                isAuthenticated: false,
                role: null, 
                email: null, 
            }
        },
    }
});


export const { setAuthorizationLogin, setAuthorizationLogout } = authorizationSlice.actions;
export default authorizationSlice.reducer;