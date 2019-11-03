import React from 'react'
import { useMyHook } from 'react-hook-vue-composition-api'

const App = () => {
  const example = useMyHook()
  return (
    <div>
      {example}
    </div>
  )
}
export default App