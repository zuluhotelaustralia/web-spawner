import { FC } from 'react'
import Select from 'react-select'
import useUrlQueries from '../hooks/useUrlQueries'
import { getCreatureTypes } from '../utils/spawn'

interface Props {
  spawnData: any[]
}

const Sidebar: FC<Props> = ({ spawnData }) => {
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
