
import React,{useEffect, useState, useRef} from "react";
import FlashcardList from "./FlashcardList";
import './App.css'
import axios from 'axios'


function App() {
  const [flashcards, setFlashcards] = useState([])
  const [categories,setCategories] = useState([])

  const categoryE1 = useRef();
  const amountEl = useRef();


  useEffect(() => {
    axios.get('https://opentdb.com/api_category.php').then(res => {
      setCategories(res.data.trivia_categories)
    })
  })

  useEffect(() => {
    
  }, [])
  

  // this function is used here because while getting data from this api, some of data is html encoded. To make it normal text, we are using this function. we are getting the data and returning the normal text
  function decodeString(str) {
    const textArea = document.createElement('textArea')
    textArea.innerHTML = str
    return textArea.value
  }

  function handleSubmit(e) {
    e.preventDefault()
    axios.get('https://opentdb.com/api.php', {
      params: {
        amount: amountEl.current.value,
        category: categoryE1.current.value
      }
    })
      .then(res => {
        setFlashcards(res.data.results.map((questionItem, index) => {
          const answer = decodeString(questionItem.correct_answer)
          const options = [...questionItem.incorrect_answers.map(a => decodeString(a)), answer]

          return {
            id: `${index}-${Date.now()}`,
            question: decodeString(questionItem.question),
            answer: answer,
            options: options.sort(()=>Math.random() - 0.5)


          }
        }) )
        
      })

  }

  return (
    <>
      <form className="header" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor='category'>Category</label>
          <select id="category" ref={categoryE1}>
            {categories.map(category => {
              return <option value={category.id} key={category.id}>{category.name}</option>
            })}
            
          </select>
        </div>
        <div className="form-group">
          <label htmlFor='amount'>Number Of Questions</label>
          <input type='number' id='amount' min='1' step='1' defaultValue={10} ref={amountEl} />
        </div>

        <div className="form-group">
          <button className="btn">Generate</button>
        </div>

      </form>

      <div className="container">
        <FlashcardList flashcards={flashcards}/>
      </div>


    </>
    

    
  );
}


export default App;
