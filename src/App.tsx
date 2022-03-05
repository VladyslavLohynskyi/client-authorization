import React ,{FC, useContext, useEffect, useState}from 'react';
import { Context } from '.';
import LoginForm from './components/LoginForm';
import {observer} from 'mobx-react-lite'
import { IUser } from './models/response/IUser';
import UserService from './services/UserService';



const App: FC = () => {
  const {store} = useContext(Context)
  const [users,setUsers] = useState<IUser[]>([])
  useEffect(()=>{
    if(localStorage.getItem("token")){
      store.checkAuth()
    }

  },[])
  const getUsers= async ()=>{
    try {
      const response = await UserService.fetchUsers();
      setUsers(response.data)
    } catch (error) {
      console.log(error);
      
    }
  }
  if(store.isLoading){
    return<div>.....LOADING</div>
  }
  if(!store.isAuth){
    return<LoginForm/>
  }
  return (
    <div className="App">
      <h1>{store.isAuth ? `User is authorized ${store.user.email}`:"You don't authorized!"}</h1>
      <h1>{store.user.isActivated? `Account Activated`:"Account is not Activated"}</h1>
      <button onClick={()=>store.logout()}>Logout</button>
      <div><button onClick={()=>getUsers()}>Get Users</button></div>
      {users.map(user=>
        <div key={user.id}>{user.email}</div>)}
    
    </div>
  );
}

export default observer(App);
