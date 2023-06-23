import { store } from "./store.js"

store.dispatch({ type: 'counter/increment' })

console.log(store.getState())

