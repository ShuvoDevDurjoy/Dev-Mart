import React from 'react'
import './element.css'

const TextInput = ({onChangeHandler, changeValue, classes, elementLabel, elementName, element_id}) => {
  return (
    <div className={`text_input_main_container ${classes}`}>
        <label className='element_input_label' htmlFor="">{elementLabel}</label>
        <input id={element_id} class="text_input_container" type="text" name={elementName} value={changeValue} onChange={onChangeHandler}></input>
    </div>
  )
}

export default TextInput
