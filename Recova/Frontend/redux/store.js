import {configureStore} from "@reduxjs/toolkit"
import darkmodereducer from "../redux/reducers/ModeSice"

export const store = configureStore({
    reducer: {
        theme: darkmodereducer

    }
});



