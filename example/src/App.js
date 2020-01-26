import React from "react";

import ReactiveExample from "./ReactiveExample";
import RefExample from "./RefExample";
import WatchExample from "./WatchExample";

export default function App() {
  return (
    <div className="p-5">
      <div className="mb-10">
        Reactive Example: <ReactiveExample />
      </div>

      <div className="mb-10">
        Ref Example: <RefExample />
      </div>

      <div className="mb-10">
        Watch Example: <WatchExample />
      </div>
    </div>
  );
}
