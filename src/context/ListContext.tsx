import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { List } from "../types/types";
import axios from "axios";

interface ListContextType {
  lists: List[];
  setLists: React.Dispatch<React.SetStateAction<List[]>>;
  onListAdd: (newList: List)  => void;
  onListDelete: (slug: string) => void;
}

const contextInitialValues = {
  lists: [],
  setLists: () => {},
  onListAdd: (newList: List) => {},
  onListDelete: (slug: string) => {}
}


const ListContext = createContext<ListContextType>(contextInitialValues);

interface Props {
  children: React.ReactNode;
}

export const ListProvider = ({ children }: Props) => {
  const [lists, setLists] = useState<List[]>([]);

  const fetchLists = useCallback(async () => {
    try {
      const token: string | null = localStorage.getItem('accessToken');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/lists/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setLists(response.data ?? [])
    } catch (error) {
      if(axios.isAxiosError(error))
        console.log(error);
    }
  }, [setLists])

  const onListAdd = useCallback((newList: List) => {
    setLists((prevLists) => [...prevLists, newList])
  }, [setLists])

  const onListDelete = useCallback((slug: string) => {
    setLists(lists.filter((list) => list.slug !== slug))
  }, [lists, setLists])

  useEffect(() => {
    fetchLists();
  }, [fetchLists])

  return (
    <ListContext.Provider value={{ lists, setLists, onListAdd, onListDelete}}>
      {children}
    </ListContext.Provider>
  );
};

export const useLists = () => useContext(ListContext);