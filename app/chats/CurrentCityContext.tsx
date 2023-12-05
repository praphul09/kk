'use client'

import { createContext, Dispatch, ReactElement, Reducer, useContext, useReducer } from "react";
import { Contact } from "../../types/contact";


type CityState = {
    tables: [],
    currentCity?: string,
}

type Action = {
    type: string,
    waId?: number,
}

export const UPDATE_CURRENT_CITY = 'UPDATE_CURRENT_CITY'


const reducer: Reducer<CityState, Action> = (state, action) => {
    switch (action.type) {
        case UPDATE_CURRENT_CITY:
            let currentCity;
            state.tables.forEach(table => { 
                if (table == action.waId ) {
                    currentCity = table
                }  
            })
            return { tables : state.tables, currentCity }
        default:
            return state;
    }
}

export const CitiesContext = createContext<CityState | null>(null)
export const CurrentCitiesDispatchContext = createContext<Dispatch<Action> | null>(null)

export function CityContextProvider({ children,  tables }: { children: ReactElement, tables: [] }) {
    const [state, dispatch] = useReducer(reducer, {  tables });
    return (
        <CitiesContext.Provider value={state}>
            <CurrentCitiesDispatchContext.Provider value={dispatch}>
                {children}
            </CurrentCitiesDispatchContext.Provider>
        </CitiesContext.Provider>
    )
}

export function useCities() {
    return useContext(CitiesContext)
}

export function useCurrentCitiesDispatch() {
    return useContext(CurrentCitiesDispatchContext)
}
