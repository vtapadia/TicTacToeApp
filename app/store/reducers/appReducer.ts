import { combineReducers } from 'redux';
import {gameReducer} from "./gameReducers";

const appReducer = combineReducers({gameReducer});

export default appReducer;


export type RootState = ReturnType<typeof appReducer>;
