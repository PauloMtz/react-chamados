import { useState } from 'react';
import Title from '../../components/Title';
import Header from '../../components/Header';
import firebase from '../../services/firebaseConnection';

import { FiUser } from 'react-icons/fi';
import { toast } from 'react-toastify';

export default function Customers(){
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [endereco, setEndereco] = useState('');

  // cadastrar cliente
  async function handleAdd(e){
    e.preventDefault();
    
    if (nomeFantasia !== '' && cnpj !== '' && endereco !== '') {
      await firebase.firestore().collection('customers')
        .add({
          nomeFantasia: nomeFantasia,
          cnpj: cnpj,
          endereco: endereco
        })
        .then(() => {
          // se cadastrou, limpa os campos
          setNomeFantasia('');
          setCnpj('');
          setEndereco('');
          toast.info('Cliente cadastrado com sucesso!');
        })
        .catch((erro) => {
          console.log(erro);
          toast.error('Erro ao cadastrar cliente.');
        })
    } else {
      toast.error('Preencha os campos corretamente.');
    }
  }

  return(
    <div>
      <Header/>

    <div className="content">
      <Title name="Clientes">
        <FiUser size={25} />
      </Title>

      <div className="container">
        <form className="form-profile customers" onSubmit={handleAdd}>
          <label>Nome fantasia</label>
          <input type="text" placeholder="Nome da sua empresa" value={nomeFantasia} onChange={ (e) => setNomeFantasia(e.target.value) } />

          <label>CNPJ</label>
          <input type="text" placeholder="Seu CNPJ" value={cnpj} onChange={ (e) => setCnpj(e.target.value) } />

          <label>Endereço</label>
          <input type="text" placeholder="Endereço da empresa" value={endereco} onChange={ (e) => setEndereco(e.target.value) } />

          <button type="submit">Cadastrar</button>

        </form>
      </div>

    </div>

    </div>
  )
}