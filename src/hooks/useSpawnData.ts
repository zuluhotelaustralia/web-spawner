import { useEffect, useState } from 'react'
import usePrevious from '../hooks/usePrevious'
import useUrlQueries from '../hooks/useUrlQueries'

import feluccaSpawns from '../spawns/shalanaar.json'

function filterSpawnData(setSpawnData: any, params: any, spawnData: any[]) {
  const creatureTypes = params['creature-type']?.split(',') ?? []
  const minNumEntries = params['min-num-entries']
  const maxNumEntries = params['max-num-entries']

  if (
    creatureTypes[0]?.length > 0 ||
    minNumEntries?.length > 0 ||
    maxNumEntries?.length > 0
  ) {
    setSpawnData(
      spawnData.filter((spawnDatum) => {
        let spawnEntriesMatch = true
        let minNumEntriesMatch = true
        let maxNumEntriesMatch = true
        if (creatureTypes[0]?.length > 0) {
          spawnEntriesMatch = spawnDatum.entries.some((entry: any) =>
            creatureTypes.includes(entry.name),
          )
        }
        if (minNumEntries?.length > 0) {
          minNumEntriesMatch = spawnDatum.count >= parseInt(minNumEntries, 10)
        }
        if (maxNumEntries?.length > 0) {
          maxNumEntriesMatch = spawnDatum.count <= parseInt(maxNumEntries, 10)
        }
        return spawnEntriesMatch && minNumEntriesMatch && maxNumEntriesMatch
      }),
    )
  } else {
    setSpawnData(feluccaSpawns)
  }
}

export default function useSpawnData() {
  const [spawnData, setSpawnData] = useState<any[]>([])
  const { params } = useUrlQueries({
    allowedParams: ['creature-type', 'min-num-entries', 'max-num-entries'],
  })
  const paramsString = JSON.stringify(params)
  const prevParamsString = usePrevious(paramsString)

  useEffect(() => {
    if (paramsString !== prevParamsString) {
      filterSpawnData(setSpawnData, params, feluccaSpawns)
    }
  }, [params, prevParamsString, paramsString])

  useEffect(() => {
    filterSpawnData(setSpawnData, params, feluccaSpawns)
  }, [])

  return {
    spawnData,
    defaultSpawnData: feluccaSpawns,
  }
}
