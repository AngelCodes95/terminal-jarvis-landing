import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="flex justify-center gap-8 mb-8">
        <a href="https://vite.dev" target="_blank" className="transition-transform hover:scale-110">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" className="transition-transform hover:scale-110">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1 className="text-4xl font-bold mb-8">
        terminal-jarvis-landing: 
        <br /> has created the <span className="screaming-bones">Bones</span> of a <span className="screaming-bones">Screaming</span> Architecture project that uses
        <br />
        Vite + React + TypeScript
      </h1>
      <div className="card bg-gray-50 rounded-lg p-6 shadow-sm">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition-colors" onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p className="mt-4 text-gray-600">
          Within your project files: edit <code className="bg-gray-200 px-2 py-1 rounded text-sm">src/App.tsx</code> and save to test Hot Module Reloading (HMR) on this page!
        </p>
      </div>
      <p className="read-the-docs text-gray-500 mt-8">
        Click on the Vite and React logos to learn more about these technologies.
      </p>
    </>
  )
}

export default App