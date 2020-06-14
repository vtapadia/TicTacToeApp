import { createStore } from "redux";
import appReducer from "./reducers/appReducer";

const appStore = createStore(appReducer);

export type StoreType = typeof appStore;
export default appStore;
