import { Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { TrashCanState } from '../atoms';

const None = styled.div`
display: none ;
`;

const TrashCanWrapper = styled.div<IArea>`
  position: absolute;
  bottom: 25px;
  right: 25px;
  width: 33px;
  height: 40px;
  background: ${props => props.isDraggingOver ? "url('./trash.png');":props.draggingFromThis ?"url('./trash2.png');":"url('./trash2.png');"};
                                                /* public 폴더에 이미지를 넣었을경우 ./ */
  background-position: center;
  background-size: cover;
`;

interface IArea {
    isDraggingOver:boolean,
    draggingFromThis:boolean,
  }

const TrashCan = () => {
const trashCan = useRecoilValue(TrashCanState);
  return (
    <Droppable droppableId="trashcan">
      {(magic,info) => (
        
        <TrashCanWrapper 
        ref=
        {magic.innerRef} 
        
        {...magic.droppableProps}
        isDraggingOver={info.isDraggingOver} 
        draggingFromThis={Boolean(info.draggingFromThisWith)}
        >
        <None>
          {magic.placeholder}
        </None>
        
         
        </TrashCanWrapper>
      )}
      
    </Droppable>
  );
};

export default TrashCan;