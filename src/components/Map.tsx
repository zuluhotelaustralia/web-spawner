import { LatLngTuple } from 'leaflet'
import { Dispatch, FC, useState, useCallback, useMemo } from 'react'
import { MapContainer, TileLayer, Circle, useMapEvents } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-markercluster'

import CrudSpawnData from './CrudSpawnData'
import MapMarker from './MapMarker'

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
          location: [
            Math.floor(latlng.lng) + 2,
            Math.floor(-1 * latlng.lat) + 1,
            0,
          ],
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

  const handleSpawnUpdate = useCallback(
    (newSpawnDatum, spawnIndex) => {
      setSpawnData([
        ...spawnData.slice(0, spawnIndex),
        newSpawnDatum,
        ...spawnData.slice(spawnIndex + 1),
      ])
    },
    [spawnData, setSpawnData],
  )

  const handleSpawnDelete = useCallback(
    (spawnIndex) => {
      setSpawnData([
        ...spawnData.slice(0, spawnIndex),
        ...spawnData.slice(spawnIndex + 1),
      ])
    },
    [spawnData, setSpawnData],
  )

  const handleSpawnDupe = useCallback(
    (spawnIndex) => {
      setSpawnData([
        ...spawnData,
        {
          ...spawnData[spawnIndex],
          location: [
            spawnData[spawnIndex].location[0] + 30,
            spawnData[spawnIndex].location[1],
            spawnData[spawnIndex].location[2],
          ],
        },
      ])
    },
    [spawnData, setSpawnData],
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
            <MapMarker
              key={index}
              index={index}
              spawn={spawn}
              setSelectedSpawn={setSelectedSpawn}
              setShowEditSpawnData={setShowEditSpawnData}
              onDelete={handleSpawnDelete}
              onDupe={handleSpawnDupe}
              onUpdate={handleSpawnUpdate}
            />
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
          selectedSpawnIndex={selectedSpawnIndex}
          updateSpawnData={handleSpawnUpdate}
          selectedSpawn={selectedSpawn}
          onCancel={() => setShowEditSpawnData(false)}
        />
      )}
    </>
  )
}

export default Map
