import { FC } from 'react'

import logo from './uologo.svg'

const App: FC = ({ children }) => {
  return (
    <div>
      <header className="h-14 border-b border-gray-300">
        <img src={logo} className="w-16" alt="logo" />
      </header>
      {children}
    </div>
  )
}

export default App
