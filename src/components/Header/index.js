import { useContext } from 'react';
import './style.css';
import { AuthContext } from '../../contexts/auth';
import avatar from '../../assets/avatar.png';

import { Link } from 'react-router-dom'; // npm install react-router-dom
import { FiUser, FiSettings, FiHeadphones } from "react-icons/fi"; // npm install react-icons --save

export default function Header(){
  const { user } = useContext(AuthContext);

  return(
    <div className="sidebar">
      <div>
        <img src={user.avatarUrl === null ? avatar : user.avatarUrl } alt="Foto avatar" />
      </div>

      <Link to="/dashboard">
        <FiHeadphones color="#FFF" size={24} />
        Chamados
      </Link>
      <Link to="/customers">
        <FiUser color="#FFF" size={24} />
        Clientes
      </Link>    
      <Link to="/profile">
        <FiSettings color="#FFF" size={24} />
        Configurações
      </Link>           
    </div>
  )
}