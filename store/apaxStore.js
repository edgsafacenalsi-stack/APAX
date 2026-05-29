// store/apaxStore.js
// Estado global de APAX usando React Context

import React, { createContext, useContext, useReducer } from "react";

const initialState = {
  language: "es",
  history: [],       // historial de mensajes
  actionLog: [],     // log visible de acciones en pantalla
  isListening: false,
  isSpeaking: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_LANGUAGE":
      return { ...state, language: action.payload };
    case "ADD_MESSAGE":
      return { ...state, history: [...state.history, action.payload] };
    case "LOG_ACTION":
      return {
        ...state,
        actionLog: [
          { id: Date.now(), text: action.payload, timestamp: new Date().toISOString() },
          ...state.actionLog.slice(0, 49), // máximo 50 entradas
        ],
      };
    case "SET_LISTENING":
      return { ...state, isListening: action.payload };
    case "SET_SPEAKING":
      return { ...state, isSpeaking: action.payload };
    case "CLEAR_HISTORY":
      return { ...state, history: [], actionLog: [] };
    default:
      return state;
  }
}

const ApaxContext = createContext(null);

export function ApaxProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <ApaxContext.Provider value={{ state, dispatch }}>
      {children}
    </ApaxContext.Provider>
  );
}

export function useApax() {
  return useContext(ApaxContext);
}
