
import {ThreadsProps} from '../../types/Card.type';
import {Link} from 'react-router-dom';

import './roomcard.scss';

interface RoomCardProps {
    data: ThreadsProps;
  }

export function RoomCard({data} : RoomCardProps){
   return (
    <div className="room-card">
        <button className='room-card-button'>
          <img src={data.roomImage} alt={`Imagem da sala ${data.roomName}`} />
        </button>
        <span>{data.roomName}</span>
    </div>
  );
}