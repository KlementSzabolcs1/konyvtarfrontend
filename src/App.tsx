
import React, { FormEvent, useEffect, useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.css'

export class Book {
  id: number;

  title: string;

  author: string;

  publish_year: number;

  page_count: number;

}


function App() {

  const [ books, setBooks ] = useState([] as Book[]);
  const [ title, setTitle ] = useState('');
  const [ author, setAuthor ] = useState('');
  const [ publish_year, setPublish_year ] = useState(0);
  const [ page_count, setPage_count ] = useState(0);
  const [ errorMessage, setErrorMessage ] = useState('');

  async function adatlekerdezes() {
    const response = await fetch('http://localhost:3000/api/books');
    const data = await response.json();
    setBooks(data);
  }

  useEffect(() => {
    adatlekerdezes();
  }, [])

  async function ujKonyv(e : FormEvent) {
    e.preventDefault();
    const adatok = {
      title, author, publish_year, page_count
    }
    const response = await fetch('http://localhost:3000/api/books', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(adatok)
    });
    if (response.ok) {
      setTitle('');
      setAuthor('');
      setPage_count(0);
      setPublish_year(0);
      adatlekerdezes();
    } else {
      const hibaObj = await response.json();
      const hibak = hibaObj.message as string[];
      setErrorMessage(hibak.join('; '));
    }
  }

  return <header> <div className='container-fluid'>
    <div className='row'>
    {
      books.map(book => <div className='col-12 col-sm-6 col-md-4 book'>
        <h2>{ book.title }</h2>
        <p>{ book.author }</p>
        <p>Hossz: { book.page_count } oldal</p>
        <p>Kiadási év: { book.publish_year }</p>
        <p><img src={'/kepek/' + book.author + '.jpg'} alt={book.author} /></p>
      </div>)
    }
    </div>

<form onSubmit={ujKonyv}>
    <label>
      Cím: <br />
      <input type="text" value={title} onChange={(e) => setTitle(e.currentTarget.value)}/>
    </label>
    <label>
      Szerző: <br />
      <input type="text" value={author} onChange={(e) => setAuthor(e.currentTarget.value)}/>
    </label>
    <label>
      Kiadási év: <br />
      <input type="number" value={publish_year} onChange={(e) => setPublish_year(parseInt(e.currentTarget.value))}/>
    </label>
    <label>
      Oldalszám: <br />
      <input type="number" value={page_count} onChange={(e) => setPage_count(parseInt(e.currentTarget.value))}/>
    </label>
    <div className='error'>{ errorMessage }</div>
    <button>Új könyv</button>
</form>

<footer>Készítette: Klement Szabolcs</footer>

  </div>;
  </header>
}
export default App
