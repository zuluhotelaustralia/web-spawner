import { Dispatch, FC, useState, useRef, useMemo } from 'react'
import { Marker, Popup } from 'react-leaflet'

import 'react-leaflet-markercluster/dist/styles.min.css'

interface Props {
  spawn: any
  index: number
  setSelectedSpawn: Dispatch<any>
  setShowEditSpawnData: Dispatch<boolean>
  onDelete: (spawnIndex: number) => void
  onDupe: (spawnIndex: number) => void
  onUpdate: (newSpawnDatum: any, spawnIndex: number) => void
}

const MapMarker: FC<Props> = ({
  spawn,
  index,
  setSelectedSpawn,
  setShowEditSpawnData,
  onDelete,
  onDupe,
  onUpdate,
}) => {
  const [draggable, setDraggable] = useState<boolean>(false)
  const markerRef = useRef<any>(null)

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current
        if (marker != null) {
          const latlng = marker.getLatLng()
          onUpdate(
            {
              ...spawn,
              location: [
                Math.floor(latlng.lng) + 2,
                Math.floor(-1 * latlng.lat) + 1,
                0,
              ],
            },
            index,
          )
        }
      },
    }),
    [index, onUpdate, spawn],
  )

  return (
    <Marker
      ref={markerRef}
      draggable={draggable}
      eventHandlers={eventHandlers}
      position={[-spawn.location[1] - 1, spawn.location[0] - 2]}
    >
      <Popup
        onOpen={() => {
          setSelectedSpawn(spawn)
        }}
        onClose={() => {
          setSelectedSpawn(null)
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
          onClick={() => setDraggable((prev) => !prev)}
          className="mt-2 inline-flex justify-center py-1 px-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Toggle Draggable
        </button>
        <button
          onClick={() => setShowEditSpawnData(true)}
          className="mt-2 ml-1 inline-flex justify-center py-1 px-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(index)}
          className="mt-2 ml-1 inline-flex justify-center py-1 px-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Delete
        </button>
        <button
          onClick={() => onDupe(index)}
          className="mt-2 ml-1 inline-flex justify-center py-1 px-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Dupe
        </button>
      </Popup>
    </Marker>
  )
}

export default MapMarker
