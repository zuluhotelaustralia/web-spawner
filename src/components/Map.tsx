import { LatLngTuple } from 'leaflet'
import { Dispatch, FC, useState, useMemo } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMapEvents,
} from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-markercluster'

import CrudSpawnData from './CrudSpawnData'

import 'react-leaflet-markercluster/dist/styles.min.css'

interface Props {
  spawnData: any[]
  setSpawnData: Dispatch<any>
}

const MapEvents: FC<Props> = ({ spawnData, setSpawnData }) => {
  const map = useMapEvents({
    dblclick: ({ latlng }) => {
      setSpawnData([
        ...spawnData,
        {
          type: 'Spawner',
          location: [latlng.lng + 2, -1 * latlng.lat + 1, 0],
          map: 'Shandalaar',
          count: 0,
          entries: [],
          homeRange: 1,
          walkingRange: 1,
          maxDelay: '00:00:00',
          minDelay: '00:00:00',
        },
      ])
    },
  })
  return null
}

const Map: FC<Props> = ({ spawnData, setSpawnData }) => {
  const bounds: LatLngTuple[] = [
    [0, 0],
    [-16384, 28512],
  ]

  const [selectedSpawn, setSelectedSpawn] = useState<any>()
  const [showEditSpawnData, setShowEditSpawnData] = useState<boolean>(false)
  const selectedSpawnIndex = useMemo(
    () =>
      spawnData.findIndex(
        (spawnDatum) =>
          JSON.stringify(spawnDatum) === JSON.stringify(selectedSpawn),
      ),
    [spawnData, selectedSpawn],
  )

  return (
    <>
      <MapContainer
        center={[-2722, 1892]}
        zoom={1}
        crs={window.L.CRS.Simple}
        maxBounds={bounds}
        style={{
          width: '100%',
          height: 'calc(100vh - 3.5rem)',
          margin: 0,
          background: '#003a52',
        }}
      >
        <MapEvents spawnData={spawnData} setSpawnData={setSpawnData} />
        <TileLayer
          url="https://s3.eu-central-1.amazonaws.com/staging.taskdropper.com/maps/Shalanaar/{z}/{y}/{x}.jpg"
          minZoom={-3}
          maxNativeZoom={2}
          maxZoom={4}
          tileSize={window.L.point(256, 256)}
          zoomOffset={5}
          noWrap={true}
          bounds={bounds}
        />
        <MarkerClusterGroup>
          {spawnData.map((spawn: any, index: number) => (
            <Marker
              key={index}
              position={[-spawn.location[1] - 1, spawn.location[0] - 2]}
            >
              {console.log('here')}
              <Popup
                onOpen={() => {
                  setSelectedSpawn(spawn)
                  //setSelectedSpawnIndex(index)
                }}
                onClose={() => {
                  setSelectedSpawn(null)
                  //setSelectedSpawnIndex(-1)
                }}
              >
                <p>
                  <b>Num Entries: {spawn.count}</b>
                </p>
                <p>
                  <b>Home Range: {spawn.homeRange}</b>
                </p>
                <p>
                  <b>Walking Range: {spawn.walkingRange}</b>
                </p>
                <table className="table-auto">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Max Count</th>
                      <th>Probability</th>
                    </tr>
                  </thead>
                  <tbody>
                    {spawn.entries.map((entry: any, index: number) => (
                      <tr key={index}>
                        <td>{entry.name}</td>
                        <td>{entry.maxCount}</td>
                        <td>{entry.probability}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button
                  onClick={() => setShowEditSpawnData(true)}
                  className="mt-2 inline-flex justify-center py-1 px-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setSpawnData([
                      ...spawnData.slice(0, selectedSpawnIndex),
                      ...spawnData.slice(selectedSpawnIndex + 1),
                    ])
                  }}
                  className="mt-2 ml-2 inline-flex justify-center py-1 px-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Delete
                </button>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
        {selectedSpawn ? (
          <Circle
            center={[
              -selectedSpawn.location[1] - 1,
              selectedSpawn.location[0] - 2,
            ]}
            pathOptions={{ fillColor: 'blue' }}
            radius={selectedSpawn.homeRange}
          />
        ) : null}
      </MapContainer>
      {showEditSpawnData && (
        <CrudSpawnData
          updateSpawnData={(newSpawnDatum) => {
            setSpawnData([
              ...spawnData.slice(0, selectedSpawnIndex),
              newSpawnDatum,
              ...spawnData.slice(selectedSpawnIndex + 1),
            ])
          }}
          spawnData={selectedSpawn}
          onCancel={() => setShowEditSpawnData(false)}
        />
      )}
    </>
  )
}

export default Map
