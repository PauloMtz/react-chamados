import './style.css';
import Header from '../../components/Header';
import Title from '../../components/Title';

import { FiUser } from 'react-icons/fi';

export default function Profile() {

  return(
    <div>
        <Header />
        <div className='content'>
        <Title name="Clientes">
            <FiUser size={25} />
        </Title>
        </div>
    </div>
  )
}