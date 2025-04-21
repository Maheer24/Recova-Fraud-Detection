import { createSlice } from '@reduxjs/toolkit'


const initialState= {
    isDarkmode: localStorage.getItem("isDarkmode")? JSON.parse(localStorage.getItem("isDarkmode")):false
}

export const darkmode = createSlice({
    name: 'darkmode',
    initialState,
    reducers: {
        togglemode:
        (state) => {
            state.isDarkmode = !state.isDarkmode;
            localStorage.setItem("isDarkmode", JSON.stringify(state.isDarkmode))
        }
    }

})

export const {togglemode} = darkmode.actions;
export default darkmode.reducer;