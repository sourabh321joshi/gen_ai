import { Chat } from './components/Chat'
import { useViewportHeight } from './hooks/useViewportHeight'

function App() {
  useViewportHeight()

  return (
    <div className="app">
      <Chat />
    </div>
  )
}

export default App
