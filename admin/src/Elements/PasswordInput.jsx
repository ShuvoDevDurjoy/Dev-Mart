import React from 'react'
import './element.css'

const PasswordInput = ({onChangeHandler, changeValue, classes, elementLabel, elementName, element_id}) => {
  return (
    <div className={`password_input_main_container ${classes}`}>
        <label className='element_input_label' htmlFor="">{elementLabel}</label>
        <input id={element_id} class="password_input_container" type="password" name={elementName} value={changeValue} onChange={onChangeHandler}></input>
    </div>
  )
}

export default PasswordInput
