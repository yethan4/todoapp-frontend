import { useRef } from "react";
import "./CreateList.css"
import axios from "axios";

export const CreateList = ({onListCreated}) => {
  const inputRef = useRef(null);

  const createSlug = (input) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const inputValue = inputRef.current.value
    const slug = createSlug(inputValue)

    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(
        'http://localhost:8000/api/lists/',
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
      onListCreated();
      console.log('List created:', response.data);
      inputRef.current.value = "";
    } catch (err) {
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
