import { LatLngTuple } from 'leaflet'
import { FC } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-markercluster'

import 'react-leaflet-markercluster/dist/styles.min.css'

interface Props {
  spawnData: any[]
}

const Map: FC<Props> = ({ spawnData }) => {
  const bounds: LatLngTuple[] = [
    [0, 0],
    [-4096, 6144],
  ]

  return (
    <MapContainer
      center={[-2722, 1892]}
      zoom={0}
      crs={window.L.CRS.Simple}
      maxBounds={bounds}
      style={{
        width: '100%',
        height: 'calc(100vh - 3.5rem)',
        margin: 0,
        background: '#003a52',
      }}
    >
      <TileLayer
        url="https://s3.eu-central-1.amazonaws.com/staging.taskdropper.com/maps/Felucca/{z}/{x}/{y}.png"
        minZoom={-3}
        maxNativeZoom={1}
        maxZoom={3}
        tileSize={window.L.point(256, 256)}
        zoomOffset={0}
        noWrap={true}
        bounds={bounds}
      />
      <MarkerClusterGroup>
        {spawnData.map((spawn: any, index: number) => (
          <Marker
            key={index}
            position={[-spawn.location[1], spawn.location[0]]}
          >
            <Popup>
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
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  )
}

export default Map
