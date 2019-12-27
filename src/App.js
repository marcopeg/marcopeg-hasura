import React, { useState, useEffect } from 'react';
import { useAuth0 } from './lib/auth0';

const App = () => {
  const { isAuthenticated, loginWithRedirect, user, token } = useAuth0();
  const [ todos, setTodos ] = useState([]);

  useEffect(() => {
    if (!token) return;

    const loadPosts = async () => {
      const res = await fetch('https://marcopeg-hasura.herokuapp.com/v1/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: '{todos{id completed text}}',
        }),
      });

      const body = await res.json();
      setTodos(body.data.todos)
    }

    loadPosts().catch(err => console.log(err))

  }, [token])

  if (isAuthenticated && user) {
    return (
      <div>
        <img src={user.picture} width={40} />
        Hello <b>{user.nickname}</b>
        <hr />
        {todos.length ? (
          <ul>
          {todos.map(todo => (
            <li key={todo.id}>{todo.text}</li>
          ))}
        </ul>
        ) : (
          <div>loading todos...</div>
        )}
        <hr />
        <pre>{token}</pre>
      </div>
    )
  }

  return (
    <div onClick={loginWithRedirect}>login!</div>
  )
}

export default App;
