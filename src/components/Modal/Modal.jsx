import { createPortal } from 'react-dom';

const Modal = ({ children, onClose = () => {} }) => {
  const backdropClickHandler = (event) => {
    event.target.classList.contains('modal-backdrop') && onClose();
  }

  return (
    <>
      {
        createPortal((
            <div onClick={backdropClickHandler} className="absolute w-screen h-screen top-0 left-0 flex items-center backdrop-blur-sm justify-center modal-backdrop">
              <div className="relative px-8 pt-4 pb-6 bg-slate-700 border border-gray-500 rounded-md modal-wrapper">
                <div className="absolute right-4 top-4 text-white font-mono text-4xl font-extralight cursor-pointer close leading-4" onClick={onClose}>&times;</div>
                <div className="content">
                  {children}
                </div>
              </div>
            </div>
          ), document.querySelector('#modal'))
      }
    </>
  )
}

export default Modal