import React from "react";
import {Draggable} from "react-beautiful-dnd"
import styled from "styled-components";
import { toDoState } from "../atoms";

const Card = styled.div<{isDragging:boolean}>`
  border-radius: 5px;
  margin-bottom: 5px;
  padding: 10px 10px;
  background-color: ${(props) =>props.isDragging ? "#a5249b94" : props.theme.cardColor};
  box-shadow:${(props) =>props.isDragging ?"0px 2px 5px rgba(0,0,0,0.05)":"nono"} ;
`;

interface IDraggableCardProps {
    toDoId: number;
    toDoText: string;
    index: number;
}

export function DraggableCard({toDoId,toDoText,index} : IDraggableCardProps) {
    
   return(
    <Draggable draggableId={toDoId + ""} index={index}>
    {(magic, snapshot) => (
      <Card
      isDragging={snapshot.isDragging}
        ref={magic.innerRef}
        {...magic.dragHandleProps}
        {...magic.draggableProps}>
        {toDoText}
      </Card>
    )}
  </Draggable>
  
   )
}

export default React.memo(DraggableCard);

//React.memo()는 react에게 props가 변하지 않았다면
//DraggableCard를 다시 렌더링 하지마! 라고 알려준다
//현재 DraggableCard({toDo, index} : IDraggableCardProps) 에서
//{toDo, index} 들어오는 값이 바뀌는 곳만 렌더링 
//card를 드레그 해면 f와e를 바꿀경우  둘의 index가 바뀐다 
//그러므로 f와 e 컴포넌트만 다시 렌더링 한다.