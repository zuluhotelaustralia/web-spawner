import { FC } from 'react'
import Map from '../components/Map'
import Sidebar from '../components/Sidebar'
import useSpawnData from '../hooks/useSpawnData'

const Main: FC = () => {
  const { spawnData, setSpawnData, defaultSpawnData } = useSpawnData()

  return (
    <div className="flex">
      <div className="w-72 p-2">
        <Sidebar setSpawnData={setSpawnData} spawnData={defaultSpawnData} />
      </div>
      <div className="flex-1">
        <Map setSpawnData={setSpawnData} spawnData={spawnData} />
      </div>
    </div>
  )
}

export default Main
