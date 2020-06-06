import { createStore } from "redux";
import appReducer from "./reducers/appReducer";

const appStore = createStore(appReducer);

export default appStore;
