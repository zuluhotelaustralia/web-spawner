import { FC } from 'react'

import logo from './muologo.svg'

const App: FC = ({ children }) => {
  return (
    <div>
      <header className="h-14 border-b border-gray-300 flex flex-center">
        <img src={logo} className="w-10 ml-2" alt="logo" />
      </header>
      {children}
    </div>
  )
}

export default App
