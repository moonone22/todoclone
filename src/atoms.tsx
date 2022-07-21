import {atom,selector} from "recoil";
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist({ 
    key: "To_Do", 
    storage : localStorage, 
  }
  
  );
// localstorage 저장


export interface ITodo{
    id: number;
    text: string;
}

interface ITODoState {
    [key:string] : ITodo[];
}

export const toDoState = atom<ITODoState>({
    key:"toDo",
    default:{
        "가":[],
        "나":[],
        "다":[],
    },
    effects_UNSTABLE: [persistAtom]
})

export const BoardState = atom<string[]>({
    key: 'boards',
    default: ["가","나","다"],
    effects_UNSTABLE: [persistAtom]
  });

export const TrashCanState = atom<boolean>({
    key: 'trashcan',
    default: false,
  });