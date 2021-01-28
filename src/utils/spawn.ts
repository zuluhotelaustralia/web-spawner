export function getCreatureTypes(spawnData: any[]) {
  const creatureTypes: {
    [key: string]: string
  } = {}
  for (const spawnDatum of spawnData) {
    for (const entry of spawnDatum.entries) {
      if (creatureTypes.hasOwnProperty(entry.name)) {
        creatureTypes[entry.name] += entry.maxCount
      } else {
        creatureTypes[entry.name] = entry.maxCount
      }
    }
  }

  return creatureTypes
}
