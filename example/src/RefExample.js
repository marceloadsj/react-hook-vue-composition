import React from "react";
import useVueComposition from "react-hook-vue-composition";

function setup({ ref }) {
  const count = ref(0);

  function increment() {
    count.value++;
  }

  return { count, increment };
}

export default function RefExample() {
  const { count, increment } = useVueComposition(setup);

  return (
    <button
      onClick={increment}
      className="bg-blue-500 text-white py-2 px-3 rounded"
    >
      Count is: {count}
    </button>
  );
}
