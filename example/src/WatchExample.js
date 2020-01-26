import React from "react";
import useVueComposition from "react-hook-vue-composition";

function setup({ ref, watch }) {
  const count = ref(0);

  // simple watch with stop
  const stop = watch(() => console.log("simple watch", count.value));

  function increment() {
    count.value++;

    if (count.value === 5) stop();
  }

  // getter watch
  watch(
    () => count.value,
    (count, prevCount) => {
      console.log("getter watch", count, prevCount);
    }
  );

  // ref watch
  watch(count, (count, prevCount) => {
    console.log("ref watch   ", count, prevCount);
  });

  return {
    count,
    increment
  };
}

export default function WatchExample() {
  const { count, increment } = useVueComposition(setup);

  return (
    <button
      onClick={increment}
      className="bg-red-500 text-white py-2 px-3 rounded"
    >
      Count is: {count}
    </button>
  );
}
