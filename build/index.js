"use strict";
// import { RecordHandler, loader } from "./loader";
function createObserver() {
    let listeners = [];
    return {
        subscribe: (listener) => {
            listeners.push(listener);
            return () => {
                listeners = listeners.filter(l => l !== listener);
            };
        },
        publish: (event) => {
            listeners.forEach((l) => l(event));
        }
    };
}
// FACTORY
function createDatabase() {
    class InMemoryDatabase {
        constructor() {
            this.db = {};
            this.beforeAddListeners = createObserver();
            this.afterAddListeners = createObserver();
        }
        set(newValue) {
            this.beforeAddListeners.publish({
                newValue,
                value: this.db[newValue.id]
            });
            this.db[newValue.id] = newValue;
            this.afterAddListeners.publish({
                value: newValue
            });
        }
        get(id) {
            return this.db[id];
        }
        onBeforeAdd(listener) {
            return this.beforeAddListeners.subscribe(listener);
        }
        onAfterAdd(listener) {
            return this.afterAddListeners.subscribe(listener);
        }
    }
    InMemoryDatabase.instance = new InMemoryDatabase();
    // SINGLETON
    // const db = new InMemoryDatabase();
    // return db;
    return InMemoryDatabase;
}
const PokemonDB = createDatabase(); // gives me a new class
const unsubscribe = PokemonDB.instance.onAfterAdd(({ value }) => {
    console.log("Added:", value);
});
PokemonDB.instance.set({
    id: "Bulbasaur",
    attack: 50,
    defense: 10,
});
unsubscribe();
PokemonDB.instance.set({
    id: "Squirtle",
    attack: 100,
    defense: 20,
});
/* console.log(PokemonDB.instance.get("Bulbasaur")); */
