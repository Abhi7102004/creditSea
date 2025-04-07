import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loans: [],
    loading: false,
    error: null,
};

const loanSlice = createSlice({
    name: 'loans',
    initialState,
    reducers: {
        setLoans(state, action) {
            state.loans = action.payload;
        },
        addLoan(state, action) {
            state.loans.push(action.payload);
        },
        removeLoan(state, action) {
            state.loans = state.loans.filter(loan => loan.id !== action.payload);
        },
        clearLoans(state) {
            state.loans = [];
        }
    },
});

export const { setLoans, addLoan, removeLoan, clearLoans } = loanSlice.actions;

export default loanSlice.reducer;