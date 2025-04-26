import { useRef } from "react";
import "./CreateList.css"
import axios from "axios";
import { useLists } from "../context/ListContext";

export const CreateList = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { onListAdd } = useLists();

  const createSlug = (input: string) => {
    return input
      .toString()
      .toLowerCase()
      .trim()
      .replace(/ą/g, 'a').replace(/ć/g, 'c').replace(/ę/g, 'e')
      .replace(/ł/g, 'l').replace(/ń/g, 'n').replace(/ó/g, 'o')
      .replace(/ś/g, 's').replace(/ź/g, 'z').replace(/ż/g, 'z')
      .replace(/\s+/g, '-')             
      .replace(/[^\w-]+/g, '')          
      .replace(/--+/g, '-')             
      .replace(/^-+/, '')               
      .replace(/-+$/, '');             
    }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if(!inputRef.current?.value) return

    const inputValue: string = inputRef.current.value
    const slug: string = createSlug(inputValue)

    try {
      const token: string | null = localStorage.getItem('accessToken');
      const response: any = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/lists/`,
        {
          name: inputValue,
          slug: slug
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      onListAdd(response.data);
      inputRef.current.value = "";
    } catch (err) {
      if(axios.isAxiosError(err))
        console.log(err)
    }

    inputRef.current.value = "";
  }

  return (
    <form id="add-new-list">
      <input 
        type="text" 
        placeholder="Create new list"
        ref={inputRef}
      />
      <button onClick={handleSubmit}>+</button>
    </form>
  )
}
