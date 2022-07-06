import { useState, createContext, useEffect } from 'react';
import firebase from '../services/firebaseConnection';

export const AuthContext = createContext({});

function AuthProvider({ children }){
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{

    function loadStorage(){
      const storageUser = localStorage.getItem('SistemaUser');

      if(storageUser){
        setUser(JSON.parse(storageUser));
        setLoading(false);
      }
  
      setLoading(false);
    }
    
    loadStorage();

  }, [])

  async function signUp(email, password, nome) {
    setLoadingAuth(true); // alguém começou a cadastrar um usuário

    await firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(async (value) => {
        let idUser = value.user.uid;

        await firebase.firestore().collection('users')
          .doc(idUser).set({
            nome: nome, // nome no banco recebe nome passado pelo usuário
            avatarUrl: null // avatarUrl no banco recebe null
          }) // se cadastrar, cai nesse then() a seguir
          .then(() => {
            // monta um objeto usuário pelo setUser para todo mundo da aplicação ter acesso
            let data = {
              uid: idUser,
              nome: nome,
              email: value.user.email,
              avatarUrl: null
            };

            // lança no setUser esse objeto que acabou de ser criado
            setUser(data);

            // lança no localstorage
            storageUser(data);
            setLoadingAuth(false);
          })
      })
      .catch((erro) => {
        alert(erro);
        setLoadingAuth(false);
      })
  }

  // salva o usuário no localstorage
  function storageUser(data) {
    localStorage.setItem('SistemaUser', JSON.stringify(data));
  }

  // faz o logout
  async function signOut() {
    await firebase.auth().signOut(); // faz o logout
    localStorage.removeItem('SistemaUser'); // limpa o localstorage
    setUser(null); // tira o usuário do estado da aplicação
  }

  return( // user é objeto, e '!!user' torna-se boolean
    <AuthContext.Provider value={{ 
        signed: !!user,  
        user, 
        loading, 
        signUp, // disponibiliza para ser acessado em qualquer lugar da aplicação
        signOut
      }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;