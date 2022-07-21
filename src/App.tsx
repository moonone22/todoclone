import { info } from "console";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { SetterOrUpdater, useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { BoardState, toDoState, TrashCanState } from "./atoms";
import Board from "./components/Board";
import TrashCan from "./components/Trash";
import Trash from "./components/Trash";


const Wrapper = styled.div`
  display: flex;
  width: 100%;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 500px;
`;
const BoxForm = styled.div`
width: 100% ;
display:flex ;
justify-content:center ;
`;
const Form = styled.form`
    width: 300px;
    height: 100px;
    
    display: flex;
    flex-direction: column;
    text-align:center ;
    justify-content: space-around;
  h1{
    font-size:30px ;
  }
  input{
    width:100% ;
    height:45px ;
    text-align:center;
  }
`;

const Boards = styled.div`
 
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    gap:10px

`;

const DragContent = styled.div<IArea>`
    width: 300px;
    height: 300px;
    position: fixed;
    border-radius: 10px;
    background-color: gray;
    bottom: 0;
    right: 0;
`;
interface IArea {
  
}


function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const [boards, setBoards] = useRecoilState(BoardState);
  const setTrashCan = useSetRecoilState(TrashCanState);
  const onDragEnd = (info:DropResult) => {
    console.log(info)
    const{destination,source,draggableId} = info;
  

    if(!destination) return;
    setTrashCan(false);
    if (source.droppableId === 'boards') 
    setBoards((prev) => {
      const boardCopy = [...prev];
      const item = boardCopy.splice(source.index, 1)[0];
      boardCopy.splice(destination.index, 0, item);
      return boardCopy;
    });
    
    
    else if(destination.droppableId==="trashcan")
    setToDos((allBoards) => {
     const boardCopy = [...allBoards[source.droppableId]];
     boardCopy.splice(source.index, 1);
     return { ...allBoards, [source.droppableId]: boardCopy };
   });
    else if(destination?.droppableId === source.droppableId)
    setToDos(allBoards => {
          const boardCopy = [...allBoards[source.droppableId]]
          const taskObj = boardCopy[source.index]
          boardCopy.splice(source.index,1)
          boardCopy.splice(destination?.index,0,taskObj)
          
          return {...allBoards,[source.droppableId]:boardCopy}; 
      });
      else if(destination?.droppableId !== source.droppableId)
      setToDos(allBoards => {
        const sourceBoard = [...allBoards[source.droppableId]]
        const taskObj = sourceBoard[source.index]
        const destinationBoard = [...allBoards[destination.droppableId]]
        sourceBoard.splice(source.index,1)  //가져온 board 안에 배열 지우기
        destinationBoard.splice(destination?.index,0,taskObj)
        return {
          ...allBoards,
          [source.droppableId]:sourceBoard,
          [destination.droppableId]:destinationBoard,
        }; 
      });
    
  
  
    }
    
  interface IForm {
      toDo: string;
    }
  const {register, setValue, handleSubmit} = useForm<IForm>();
 

  function onValid ({toDo}:IForm) {
    if (
          Object.keys(toDos).some(
                    (v) => v.toLowerCase() === toDo.toLowerCase(),
                )
            )
    return;

    
      setToDos(allBoards => {
      return {
        ...allBoards,
        [toDo] : []
        // "doing" : [...allBoards["doing"],newToDo]
       
      };
    });
    
    setBoards((prev) => {
      const boardCopy = [...prev];
      boardCopy.push(toDo)
      return boardCopy;
    });
    

    setValue("toDo", "");
  }
  

  return (
   
   
    <DragDropContext onDragEnd={onDragEnd}>
      <BoxForm>
        <Form onSubmit={handleSubmit(onValid)}>
          <h1>Memo</h1>
          <input {...register("toDo",{required: true})} type="text" placeholder={"Add Memo"}/>
        </Form>
      </BoxForm>
      <Wrapper>
      <Droppable droppableId="boards" direction="horizontal" type="board">
          {(magic) => (

        <Boards ref={magic.innerRef} {...magic.droppableProps}>                                       
          {boards.map((boardId, index) =>           //객체['속성명'] 객체 안 속명값 찾기 2번째 방법
          <Board key={index} boardId={boardId} index={index} toDos={toDos[boardId]}/>
          //boardId = 'to_do'  {'to_do'} => 'to_do'
          
          )}
           {magic.placeholder}
          </Boards>
          
          )}
        </Droppable>
        <TrashCan/>

      </Wrapper>
    </DragDropContext>
  );
}

export default App;
