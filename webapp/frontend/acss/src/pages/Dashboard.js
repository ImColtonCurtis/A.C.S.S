import {AuthChecker} from "../helpers/AuthChecker";
import {useContext} from 'react';
import User from '../pages/User';

function Dashboard() {
  const auth = useContext(AuthChecker);

  
  return (
    <>
      <div>Dashboard</div>
      {auth['auth'] && 
      <User/>
      }   
    </>
    
  )
}

export default Dashboard