import React from 'react'

const Step3 = ({ onNext, onBack }) => {
  return (
 <div >
      <h2 >This is Step 3</h2>

      {/* Example content */}
      <p >Add your form fields or content for Step 3 here.</p>

      <div>
        <button  onClick={onBack}>Back</button>
        <button  onClick={onNext}>Next</button>
      </div>
    </div>
  )
}

export default Step3
