import { useState, createContext, useEffect } from 'react';
import firebase from '../services/firebaseConnection';
import { toast } from 'react-toastify';

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

  // efetua login
  async function signIn(email, password) {
    setLoadingAuth(true); // carregando usuário

    await firebase.auth().signInWithEmailAndPassword(email, password)
      .then(async (value) => {
        let idUser = value.user.uid;

        // busca no banco o usuário que está em idUser
        const userProfile = await firebase.firestore().collection('users')
          .doc(idUser).get();
        
        // monta o objeto
        let data = {
          uid: idUser,
          nome: userProfile.data().nome, // vem do banco de dados
          avatarUrl: userProfile.data().avatarUrl,
          email: value.user.email, // email que foi passado no login
        };

        // lança no setUser esse objeto que acabou de ser criado
        setUser(data);

        // lança no localstorage
        storageUser(data);
        setLoadingAuth(false);
        toast.success('Bem vindo de volta!');
      })
      .catch((erro) => {
        //alert(erro);
        setLoadingAuth(false);
        toast.error('Não foi possível efetuar login.');
      })
  }

  // cadastra usuário
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
            toast.success('Seja bem vindo à plataforma!');
          })
      })
      .catch((erro) => {
        //alert(erro);
        setLoadingAuth(false);
        toast.error('Ocorre um erro inesperado.');
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
        signOut,
        signIn,
        loadingAuth
      }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;