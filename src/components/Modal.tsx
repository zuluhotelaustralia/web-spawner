import { FC, useEffect, useMemo } from 'react'
import ReactDOM from 'react-dom'

const modalRoot = document.getElementById('modal-root')
const body = document.getElementsByTagName('body')[0]

interface Props {
  proceedForm: string
  onCancel: () => void
}

const Modal: FC<Props> = ({ children, onCancel, proceedForm }) => {
  const el = useMemo(() => document.createElement('div'), [])

  useEffect(() => {
    body.style.overflow = 'hidden'
    if (modalRoot) {
      modalRoot.appendChild(el)
    }
    return () => {
      body.style.overflow = 'auto'
      if (modalRoot) {
        modalRoot.removeChild(el)
      }
    }
  }, [el])

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 overflow-y-auto"
      style={{ zIndex: 999 }}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">{children}</div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              form={proceedForm}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>,
    el,
  )
}

export default Modal
