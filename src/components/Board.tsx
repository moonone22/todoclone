import React, { ButtonHTMLAttributes, useRef } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import { DraggableCard } from "./DragabbleCard";
import {useForm} from "react-hook-form"
import { BoardState, ITodo, toDoState } from "../atoms";
import { useSetRecoilState } from "recoil";

const Wrapper = styled.div`
  width:300px;
  padding-top: 10px ;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 5px;
  min-height: 300px;
  display:flex ;
  flex-direction: column ;
  position: relative ;
button{
position: absolute;
right:0px;
margin-right:10px ;
}
`;
const Title = styled.h2`
 text-align: center;
 font-weight: 600;
 margin-bottom:10px;
 font-size: 18px;
`
const Area = styled.div<IArea>`
background-color: ${props => props.isDraggingOver ? "#dfe6e9":props.draggingFromThis ?"#b3bec3":"transpatent"};
flex-grow:1;
padding:20px;
`;
const Form = styled.form`
   
  input{
    width:100%;
   
  }
`;

interface IBoardProps {
    toDos: ITodo[];
    boardId: string;
    index:number;
}
interface IArea {
  isDraggingOver:boolean,
  draggingFromThis:boolean,
}

interface IForm {
  toDo: string;
}

function Board({toDos, boardId ,index}:IBoardProps){
  const setToDos = useSetRecoilState(toDoState)
  const setBoards = useSetRecoilState(BoardState)
  const {register, setValue, handleSubmit} = useForm<IForm>();
  const onValid = ({toDo}:IForm) => {
    const newToDo = {
      id:Date.now(),
      text: toDo, //input에 입력한 값
    }
    setToDos(allBoards => {
      return {
        ...allBoards,
        [boardId] : [...allBoards[boardId],newToDo]
        // "doing" : [...allBoards["doing"],newToDo]
       
      };
    });
    setValue("toDo", "");
  }


  function handleClick() {

    // setToDos(allBoards => {
    //   const Dt = {...allBoards}
    //   delete Dt[boardId]
    
    //   return {
    //     ...Dt
    //   };
    // });
    //부모 엘리번트만 삭제해주면 자동으로 setToDos는 안해줘도 된다
    setBoards(Board => {
      const Dt = [...Board]
      Dt.splice(index, 1)
      console.log(Dt)
    
      return [
        ...Dt
      ]
    })

   
  }
 
 
 
 
    return(
      <Draggable draggableId={boardId} index={index} key={boardId}>
      {(magic) => (
        <Wrapper
        {...magic.dragHandleProps}
        {...magic.draggableProps}
        ref={magic.innerRef}>

        <Title>{boardId}</Title>
        <button onClick={handleClick}>x</button>
        <Form onSubmit={handleSubmit(onValid)}>
          <input {...register("toDo",{required: true})} type="text" placeholder={`Add task on ${boardId}`}/>
           {/* inputRef를 사용함으로써  input에대한 접근을 할수있따.*/}
           
        </Form>
       
        <Droppable droppableId={boardId}>
        
            {(magic, info) => (
              
              <Area 
              isDraggingOver={info.isDraggingOver} 
              //현재 선택한 Draggable이 특정 Droppable위에 드래깅 되고 있는지 여부 확인
              //현재 Droppable에서 벗어난 드래깅되고 있는 Draggable ID
              draggingFromThis={Boolean(info.draggingFromThisWith)}
                                //string이든 머든 존재하면 true
              ref={magic.innerRef} 
              //ref 자바스크립트로부터 HTML 요소를 가져오고 수정하는 방법
              {...magic.droppableProps}

              >

                {toDos.map((toDo, index) => (
                <DraggableCard 
                key={toDo.id} 
                toDoId={toDo.id} 
                index={index}
                toDoText={toDo.text}/>
                ))}
                
                {magic.placeholder}
              </Area>
            )}


            
          </Droppable>
          </Wrapper>
      )}
          </Draggable>
    )
}

export default React.memo(Board);