import { useState, useEffect, useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import firebase from '../../services/firebaseConnection';

import Header from '../../components/Header';
import Title from '../../components/Title';
import { AuthContext } from '../../contexts/auth';

import './style.css';
import { FiPlusCircle } from 'react-icons/fi'
import { toast } from 'react-toastify';

export default function New() {
  
  const [loadCustomers, setLoadCustomers] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [customerSelected, setCustomerSelected] = useState(0);

  const [assunto, setAssunto] = useState('Suporte');
  const [status, setStatus] = useState('Aberto');
  const [complemento, setComplemento] = useState('');

  const { user } = useContext(AuthContext);
  const history = useHistory();

  // esse id é o que foi declarado na rota '/new/:id'
  const { id } = useParams();
  const [idCustomer, setIdCustomer] = useState(false);

  useEffect(()=> {
    // carrega os clientes no campo 'select' quando inicia a aplicação
    async function loadCustomers() {
      await firebase.firestore().collection('customers')
      .get()
      .then((snapshot)=>{
        let lista = [];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            nomeFantasia: doc.data().nomeFantasia
          })
        })

        if (lista.length === 0) {
          console.log('Nenhum registro encontrado.');
          setCustomers([ { id: '1', nomeFantasia: '' } ]);
          setLoadCustomers(false);
          return;
        }

        setCustomers(lista);
        setLoadCustomers(false);

        // se tiver id, é edição
        if (id) {
          loadId(lista);
        }

      })
      .catch((error)=>{
        console.log('Ocorreu um erro inesperado.', error);
        setLoadCustomers(false);
        setCustomers([ { id: '1', nomeFantasia: '' } ]);
      })

    }

    loadCustomers();

  }, []);

  // cadastra cliente
  async function handleRegister(e){
    e.preventDefault();

    // se tiver id, é edição
    if(idCustomer){
      await firebase.firestore().collection('chamados')
      .doc(id)
      .update({
        cliente: customers[customerSelected].nomeFantasia,
        clienteId: customers[customerSelected].id,
        assunto: assunto,
        status: status,
        complemento: complemento,
        userId: user.uid
      })
      .then(()=>{
        toast.success('Chamado Editado com sucesso!');
        setCustomerSelected(0);
        setComplemento('');
        history.push('/dashboard');
      })
      .catch((err)=>{
        toast.error('Ocorreu um erro ao registrar, tente mais tarde.')
        console.log(err);
      })

      return;
    }

    await firebase.firestore().collection('chamados')
    .add({
      created: new Date(),
      cliente: customers[customerSelected].nomeFantasia,
      clienteId: customers[customerSelected].id,
      assunto: assunto,
      status: status,
      complemento: complemento,
      userId: user.uid
    })
    .then(()=> {
      toast.success('Chamado criado com sucesso!');
      setComplemento('');
      setCustomerSelected(0);
      history.push('/'); // volta para página inicial
    })
    .catch((err)=> {
      toast.error('Ocorreu um erro, tente mais tarde.')
      console.log(err);
    })
  }

  // carrega os dados no formulário de edição
  async function loadId(lista){
    await firebase.firestore().collection('chamados').doc(id)
    .get()
    .then((snapshot) => {
      setAssunto(snapshot.data().assunto);
      setStatus(snapshot.data().status);
      setComplemento(snapshot.data().complemento)

      // encontra o índice do item clicado no select
      let index = lista.findIndex(item => item.id === snapshot.data().clienteId );
      setCustomerSelected(index);
      setIdCustomer(true);
    })
    .catch((err)=>{
      console.log('ERRO NO ID PASSADO: ', err);
      setIdCustomer(false);
    })
  }

  // quando muda o assunto
  function handleChangeSelect(e){
    setAssunto(e.target.value);
  }

  // quando muda o status
  function handleOptionChange(e){
    setStatus(e.target.value);
  }

  //Chamado quando troca de cliente
  function handleChangeCustomers(e){
    //console.log('INDEX DO CLIENTE SELECIONADO: ', e.target.value);
    //console.log('Cliente selecionado ', customers[e.target.value])
    setCustomerSelected(e.target.value);
  }

  return(
    <div>
      <Header/>

      <div className="content">
        <Title name="Novo chamado">
          <FiPlusCircle size={25} />
        </Title>

        <div className="container">

          <form className="form-profile"  onSubmit={handleRegister} >
            
            <label>Cliente</label>

            {loadCustomers ? (
              <input type="text" disabled={true} value="Carregando clientes..." />
            ) : (
                <select value={customerSelected} onChange={handleChangeCustomers} >
                {customers.map((item, index) => {
                  return(
                    <option key={item.id} value={index} >
                      {item.nomeFantasia}
                    </option>
                  )
                })}
              </select>
            )}

            <label>Assunto</label>
            <select value={assunto} onChange={handleChangeSelect}>
              <option value="Suporte">Suporte</option>
              <option value="Visita Tecnica">Visita Tecnica</option>
              <option value="Financeiro">Financeiro</option>
            </select>

            <label>Status</label>
            <div className="status">
              <input 
              type="radio"
              name="radio"
              value="Aberto"
              onChange={handleOptionChange}
              checked={ status === 'Aberto' }
              />
              <span>Em Aberto</span>

              <input 
              type="radio"
              name="radio"
              value="Progresso"
              onChange={handleOptionChange}
              checked={ status === 'Progresso' }
              />
              <span>Progresso</span>

              <input 
              type="radio"
              name="radio"
              value="Atendido"
              onChange={handleOptionChange}
              checked={ status === 'Atendido' }
              />
              <span>Atendido</span>
            </div>

            <label>Complemento</label>
            <textarea
              type="text"
              placeholder="Descreva seu problema (opcional)."
              value={complemento}
              onChange={ (e) => setComplemento(e.target.value) }
            />
            
            <button type="submit">Registrar</button>

          </form>

        </div>
      </div>
    </div>
  )
}