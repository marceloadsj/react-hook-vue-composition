# react-hook-vue-composition

> React hook that mimics the [Vue Composition API](https://vue-composition-api-rfc.netlify.com)

### WIP: the api may change a bit

[![NPM](https://img.shields.io/npm/v/react-hook-vue-composition.svg)](https://www.npmjs.com/package/react-hook-vue-composition) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-hook-vue-composition
```

## Usage

```jsx
import React from "react";
import useVueComposition from "react-hook-vue-composition";

function setup({ ref }) {
  const count = ref(0);

  function increment() {
    count.value++;
  }

  return { count, increment };
}

function CountButton() {
  const { count, increment } = useVueComposition(setup);

  return <button onClick={increment}>Count is: {count}</button>;
}
```

Check `./example` folder for more examples!

## License

MIT © [](https://github.com/)

---

This hook is created using [create-react-hook](https://github.com/hermanya/create-react-hook).
