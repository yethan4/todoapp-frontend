import { createContext, useContext, useState } from "react";
import { List } from "../types/types";

interface ListContextType {
  lists: List[];
  setLists: React.Dispatch<React.SetStateAction<List[]>>;
}

const contextInitialValues = {
  lists: [],
  setLists: () => {},
}


const ListContext = createContext<ListContextType>(contextInitialValues);

interface Props {
  children: React.ReactNode;
}

export const ListProvider = ({ children }: Props) => {
  const [lists, setLists] = useState<List[]>([]);

  return (
    <ListContext.Provider value={{ lists, setLists }}>
      {children}
    </ListContext.Provider>
  );
};

export const useLists = () => useContext(ListContext);