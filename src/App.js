import React from 'react';
// import { Switch, Route } from 'react-router-dom';
// import PrivateRoute from './lib/PrivateRoute'
// import MainMenu from './containers/MainMenu';
// import HomePage from './views/HomePage';
// import Dashboard from './views/Dashboard';
import { useAuth0, withAuth } from './lib/my-auth0';

const Foo = withAuth(({ auth }) => {
  return (
    <div>
      Welcome {auth.user.email}
      <button onClick={auth.logout}>logout</button>
    </div>
  );
});

const App = () => {
  const { isLoading, isAuthenticated } = useAuth0();

  // const { isAuthenticated, loginWithRedirect, logout, user, token } = useAuth0();
  // const [ todos, setTodos ] = useState([]);

  // useEffect(() => {
  //   if (!token) return;

  //   const loadPosts = async () => {
  //     const res = await fetch('https://marcopeg-hasura.herokuapp.com/v1/graphql', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({
  //         query: '{todos{id completed text}}',
  //       }),
  //     });

  //     const body = await res.json();
  //     setTodos(body.data.todos)
  //   }

  //   loadPosts().catch(err => console.log(err))

  // }, [token])

  // if (isAuthenticated && user) {
  //   return (
  //     <div>
  //       <img src={user.picture} width={40} />
  //       <div onClick={logout}>Hello <b>{user.nickname}</b></div>
  //       <hr />
  //       {todos.length ? (
  //         <ul>
  //         {todos.map(todo => (
  //           <li key={todo.id}>{todo.text}</li>
  //         ))}
  //       </ul>
  //       ) : (
  //         <div>loading todos...</div>
  //       )}
  //       <hr />
  //       <pre>{token}</pre>
  //     </div>
  //   )
  // }

  return (
    <div>
      <p>isLoading: {isLoading.toString()}</p>
      <p>isAuthenticated: {isAuthenticated.toString()}</p>

      <Foo />
      <hr />
      <Foo />

      {/* <MainMenu />
      <Switch>
        <Route path="/" exact component={HomePage} />
        <PrivateRoute path="/dashboard" exact component={Dashboard} />
      </Switch> */}
    </div>
  )
}

export default App;
