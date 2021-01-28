import { FC } from 'react'
import Map from '../components/Map'
import Sidebar from '../components/Sidebar'
import useSpawnData from '../hooks/useSpawnData'

const Main: FC = () => {
  const { spawnData, defaultSpawnData } = useSpawnData()

  return (
    <div className="flex">
      <div className="w-72 p-2">
        <Sidebar spawnData={defaultSpawnData} />
      </div>
      <div className="flex-1">
        <Map spawnData={spawnData} />
      </div>
    </div>
  )
}

export default Main
