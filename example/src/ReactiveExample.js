import React from "react";
import useVueComposition from "react-hook-vue-composition";

function setup({ reactive }) {
  const state = reactive({ count: 0 });

  function increment() {
    state.count++;
  }

  return { state, increment };
}

export default function ReactiveExample() {
  const { state, increment } = useVueComposition(setup);

  return (
    <button
      onClick={increment}
      className="bg-green-500 text-white py-2 px-3 rounded"
    >
      Count is: {state.count}
    </button>
  );
}
