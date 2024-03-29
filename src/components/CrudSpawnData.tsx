import { FC } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import Select from 'react-select'

import creatureTypes from '../data/creatureTypes.json'
import Modal from './Modal'

interface Props {
  selectedSpawn: any
  selectedSpawnIndex: number
  updateSpawnData: (selectedSpawn: any, spawnIndex: number) => void
  onCancel: () => void
}

interface Entry {
  name: { label: string; value: string }
  maxCount: number
  probability: number
}

interface Inputs {
  spawnType: { label: string; value: string }
  locationX: number
  locationY: number
  locationZ: number
  homeRange: number
  walkingRange: number
  minDelay: string
  maxDelay: string
  entries: Entry[]
}

const CrudselectedSpawn: FC<Props> = ({
  selectedSpawn,
  selectedSpawnIndex,
  updateSpawnData,
  onCancel,
}) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    ...(selectedSpawn
      ? {
          defaultValues: {
            spawnType: { label: selectedSpawn.type, value: selectedSpawn.type },
            locationX: selectedSpawn.location[0],
            locationY: selectedSpawn.location[1],
            locationZ: selectedSpawn.location[2],
            homeRange: selectedSpawn.homeRange,
            walkingRange: selectedSpawn.walkingRange,
            minDelay: selectedSpawn.minDelay,
            maxDelay: selectedSpawn.maxDelay,
            entries: selectedSpawn.entries.map((entry: any) => ({
              ...entry,
              name: { label: entry.name, value: entry.name },
            })),
          },
        }
      : {}),
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'entries',
  })

  const onSubmit = (data: any) => {
    updateSpawnData(
      {
        ...selectedSpawn,
        count: data.entries.reduce(
          (acc: any, curr: any) => acc + parseInt(curr.maxCount, 10),
          0,
        ),
        type: data.spawnType.value,
        location: [
          parseInt(data.locationX, 10),
          parseInt(data.locationY, 10),
          parseInt(data.locationZ, 10),
        ],
        homeRange: parseInt(data.homeRange, 10),
        walkingRange: parseInt(data.walkingRange, 10),
        minDelay:
          data.minDelay.length === 5 ? `${data.minDelay}:00` : data.minDelay,
        maxDelay:
          data.maxDelay.length === 5 ? `${data.maxDelay}:00` : data.maxDelay,
        entries: data.entries.map((entry: any) => ({
          maxCount: parseInt(entry.maxCount, 10),
          probability: parseInt(entry.probability, 10),
          name: entry.name.value,
        })),
      },
      selectedSpawnIndex,
    )
    onCancel()
  }

  return (
    <Modal onCancel={onCancel} proceedForm="crud-spawn-data">
      <form id="crud-spawn-data" onSubmit={handleSubmit(onSubmit)}>
        <div className="overflow-hidden">
          <div className="px-4 py-5 bg-white sm:p-6">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700"
                >
                  Type
                </label>
                <Controller
                  name="spawnType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="Type"
                      options={[{ label: 'Spawner', value: 'Spawner' }]}
                    />
                  )}
                />
              </div>

              <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                <label
                  htmlFor="locationX"
                  className="block text-sm font-medium text-gray-700"
                >
                  Location X
                </label>
                <input
                  type="number"
                  id="locationX"
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  {...register('locationX')}
                />
              </div>

              <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                <label
                  htmlFor="locationY"
                  className="block text-sm font-medium text-gray-700"
                >
                  Location Y
                </label>
                <input
                  type="number"
                  id="locationY"
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  {...register('locationY')}
                />
              </div>

              <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                <label
                  htmlFor="locationZ"
                  className="block text-sm font-medium text-gray-700"
                >
                  Location Z
                </label>
                <input
                  type="number"
                  id="locationZ"
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  {...register('locationZ')}
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="homeRange"
                  className="block text-sm font-medium text-gray-700"
                >
                  Home Range
                </label>
                <input
                  type="number"
                  id="homeRange"
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  {...register('homeRange')}
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="walkingRange"
                  className="block text-sm font-medium text-gray-700"
                >
                  Walking Range
                </label>
                <input
                  type="number"
                  id="walkingRange"
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  {...register('walkingRange')}
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="minDelay"
                  className="block text-sm font-medium text-gray-700"
                >
                  Min Delay
                </label>
                <input
                  type="time"
                  step="1"
                  id="minDelay"
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  {...register('minDelay')}
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="maxDelay"
                  className="block text-sm font-medium text-gray-700"
                >
                  Max Delay
                </label>
                <input
                  type="time"
                  step="1"
                  id="maxDelay"
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  {...register('maxDelay')}
                />
              </div>

              <h3 className="col-span-6 text-lg font-medium leading-6 text-gray-900">
                Entries
              </h3>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-6 gap-3 col-span-6"
                >
                  <div className="col-span-3">
                    <label
                      htmlFor={`entries.${index}.name`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Name
                    </label>
                    <Controller
                      name={`entries.${index}.name` as const}
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          placeholder="Name"
                          options={creatureTypes}
                        />
                      )}
                    />
                  </div>
                  <div className="col-span-1">
                    <label
                      htmlFor={`entries.${index}.maxCount`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Count
                    </label>
                    <input
                      type="number"
                      id={`entries.${index}.maxCount`}
                      defaultValue={field.maxCount}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      {...register(`entries.${index}.maxCount` as const)}
                    />
                  </div>

                  <div className="col-span-1">
                    <label
                      htmlFor={`entries.${index}.probability`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Probability
                    </label>
                    <input
                      type="number"
                      id={`entries.${index}.probability`}
                      defaultValue={field.probability}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      {...register(`entries.${index}.probability` as const)}
                    />
                  </div>

                  <div className="col-span-1">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="inline-flex justify-center mt-6 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              <div className="col-span-6">
                <button
                  type="button"
                  onClick={() => append({})}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add another
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  )
}

export default CrudselectedSpawn
