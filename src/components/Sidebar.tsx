import { Dispatch, FC, useRef } from 'react'
import Select from 'react-select'
import { saveAs } from 'file-saver'
import useUrlQueries from '../hooks/useUrlQueries'
import { getCreatureTypes } from '../utils/spawn'

interface Props {
  spawnData: any[]
  setSpawnData: Dispatch<any>
}

const Sidebar: FC<Props> = ({ spawnData, setSpawnData }) => {
  const creatureTypes = getCreatureTypes(spawnData)
  const creatureTypeOptions = Object.entries(creatureTypes).map(
    ([key, value]) => ({
      label: `${key} (${value})`,
      value: key,
    }),
  )
  const numEntriesOptions = Array.from(
    { length: 30 },
    (v, k) => k + 1,
  ).map((value) => ({ label: value.toString(), value: value.toString() }))

  const { updateQueries, params } = useUrlQueries({
    allowedParams: ['creature-type', 'min-num-entries', 'max-num-entries'],
  })
  const defaultSelectedCreatureTypes = params['creature-type']?.split(',') ?? []
  const defaultMinNumEntries = params['min-num-entries'] ?? ''
  const defaultMaxNumEntries = params['max-num-entries'] ?? ''

  return (
    <div>
      <button
        type="button"
        onClick={async () => {
          const [fileHandle] = await (window as any).showOpenFilePicker({
            description: 'Spawn data json file',
            accept: {
              'application/json': ['.json'],
            },
          })
          const file = await fileHandle.getFile()
          const contents = await file.text()
          const jsonContents = JSON.parse(contents)
          setSpawnData(jsonContents)
        }}
        className="inline-flex justify-center mt-2 mb-2 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Import
      </button>
      <button
        type="button"
        onClick={async () => {
          const content = localStorage.getItem('shandalaarSpawns')
          const filename = 'shandalaar.json'

          if (content) {
            const blob = new Blob([content], {
              type: 'application/json;charset=utf-8',
            })

            saveAs(blob, filename)
          }
        }}
        className="inline-flex justify-center ml-2 mt-2 mb-2 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Export
      </button>
      <h2 className="text-base font-medium">Filters</h2>
      <div className="mt-2">
        <Select
          placeholder="Creature Type"
          options={creatureTypeOptions}
          isMulti
          defaultValue={creatureTypeOptions.filter((option) =>
            defaultSelectedCreatureTypes.includes(option.value),
          )}
          onChange={(selectedValues) => {
            updateQueries({
              'creature-type': selectedValues
                .map((selected) => selected.value)
                .join(','),
            })
          }}
        />
      </div>
      <div className="mt-2">
        <Select
          placeholder="Min Entries"
          options={numEntriesOptions.filter(
            (value) =>
              parseInt(value.value, 10) <
              parseInt(defaultMaxNumEntries || '30', 10),
          )}
          defaultValue={
            numEntriesOptions.filter((option) =>
              defaultMinNumEntries.includes(option.value),
            )[0]
          }
          onChange={(selectedValue) => {
            updateQueries({
              'min-num-entries': selectedValue!.value,
            })
          }}
        />
      </div>
      <div className="mt-2">
        <Select
          placeholder="Max Entries"
          options={numEntriesOptions.filter(
            (value) =>
              parseInt(value.value, 10) >
              parseInt(defaultMinNumEntries || '0', 10),
          )}
          defaultValue={
            numEntriesOptions.filter((option) =>
              defaultMaxNumEntries.includes(option.value),
            )[0]
          }
          onChange={(selectedValue) => {
            updateQueries({
              'max-num-entries': selectedValue!.value,
            })
          }}
        />
      </div>
    </div>
  )
}

export default Sidebar
