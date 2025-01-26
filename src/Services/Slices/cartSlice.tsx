import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from '@reduxjs/toolkit'


export interface CartState{
    cartItems: Object[]
}

const initialState:CartState = {
    cartItems:[]
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers:{
        add:(state, action: PayloadAction<Object>)=>{
            state.cartItems.push(action.payload)
        },
        delete:(state, action:PayloadAction<string>)=>{
            state.cartItems.filter(item=>item!==action.payload)
        },
        update(){}
    }
})

export const { add } = cartSlice.actions

export default cartSlice.reducer

