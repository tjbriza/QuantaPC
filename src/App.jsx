import { useState } from 'react'
import Navigation from './components/ui/Navigation'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Home</h1>
      <Navigation/>
    </>
  )
}

export default App
