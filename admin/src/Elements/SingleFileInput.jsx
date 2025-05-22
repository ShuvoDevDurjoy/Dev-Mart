import React from 'react'
import './element.css'

const SingleFileInput = ({onChangeHandler, classes, elementLabel, elementName, element_id}) => {
  return (
    <div className={`text_input_main_container ${classes}`}>
        <label className='element_input_label' htmlFor="">{elementLabel}</label>
        <input id={element_id} class="single_file_input_container" accept="image/*" type="file" name={elementName} onChange={onChangeHandler}></input>
    </div>
  )
}

export default SingleFileInput
