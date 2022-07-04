import { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../contexts/auth';
// importação entre chaves porque não é export default lá na origem

export default function RouteWrapper({
  component: Component,
  isPrivate,
  ...rest
}){

  // agora, signed e loading vêm de AuthContext
  const { signed, loading } = useContext(AuthContext);

  if(loading){
    return(
      <div></div>
    )
  }

  if(!signed && isPrivate){
    return <Redirect to="/" />
  }

  if(signed && !isPrivate){
    return <Redirect to="/dashboard" />
  }

  return(
    <Route
      {...rest}
      render={ props => (
        <Component {...props} />
      )}
    />
  )
}