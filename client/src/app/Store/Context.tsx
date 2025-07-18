'use client'
import { createContext, SetStateAction, Dispatch, useContext, useState, ReactNode } from "react";
import { Quiz } from "../types/type";
interface ContextType{
    quiz: Quiz[] | null
    setQuiz:Dispatch<SetStateAction<Quiz[] | null>>
}
const AppContext =  createContext<ContextType | undefined>(undefined);

export default function ContextProvider({children}:{children:ReactNode}){
    const [quiz, setQuiz] = useState<Quiz[] | null>(null);
    return(
        <AppContext.Provider value={{quiz, setQuiz}}>
            {children}
        </AppContext.Provider>
    )
   
}

export const useAppContext = () =>{
    const context = useContext(AppContext);
    if (!context) {
      throw new Error("useUserContext must be used within a ContextProvider");
    }
    return context;
}


