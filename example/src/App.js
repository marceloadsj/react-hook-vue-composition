import React from "react";
import useVueComposition from "react-hook-vue-composition";

// Reactive Example
function reactiveExampleSetup({ reactive }) {
  const state = reactive({ count: 0 });

  function increment() {
    state.count++;
  }

  return { state, increment };
}

function ReactiveExample() {
  const { state, increment } = useVueComposition(reactiveExampleSetup);

  return (
    <button
      onClick={increment}
      className="bg-green-500 text-white py-2 px-3 rounded"
    >
      Count is: {state.count}
    </button>
  );
}

// Ref Example
function refExampleSetup({ ref }) {
  const count = ref(0);

  function increment() {
    count.value++;
  }

  return { count, increment };
}

function RefExample() {
  const { count, increment } = useVueComposition(refExampleSetup);

  return (
    <button
      onClick={increment}
      className="bg-blue-500 text-white py-2 px-3 rounded"
    >
      Count is: {count}
    </button>
  );
}

// App

export default function App() {
  return (
    <div className="p-5">
      <div className="mb-10">
        Reactive Example: <ReactiveExample />
      </div>

      <div className="mb-10">
        Ref Example: <RefExample />
      </div>
    </div>
  );
}
