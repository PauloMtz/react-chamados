import { useContext } from 'react';
import { AuthContext } from '../../contexts/auth';

import Header from '../../components/Header';
import Title from '../../components/Title';

import { FiHome } from 'react-icons/fi';

export default function Dashboard(){
  const { signOut } = useContext(AuthContext);

  return(
    <div>
      <Header />
      <div className='content'>
        <Title name="Dashboard">
            <FiHome size={25} />
        </Title>
      </div>
    </div>
  )
}