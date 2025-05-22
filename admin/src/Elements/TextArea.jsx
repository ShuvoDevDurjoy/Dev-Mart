import React from 'react'
import './element.css'
const TextArea = ({elementName, elementId, elementLabel, elementValue, classes, onChangeHandler}) => {
  return (
    <div class="textarea_input_main_container">
        <label className='element_input_label' for={elementId}>{elementLabel}</label>
        <textarea 
            name={elementName}
            id={elementId}
            value={elementValue}
            className={`text_area_input_container ${classes}`}
            onChange={onChangeHandler}
        />
    </div>
  )
}

export default TextArea
