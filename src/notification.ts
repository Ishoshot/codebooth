import { writable } from "svelte/store";

// constructor function
const createStore = () => {
  // initialize internal writable store with empty list
  const activities = writable([{}]);

  return {
    set: activities.set,
    update: activities.update,
    subscribe: activities.subscribe,
  };
};

// initialize the store
const notty = createStore();

export { notty };
