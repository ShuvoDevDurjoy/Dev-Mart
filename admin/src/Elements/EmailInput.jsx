import React from 'react'
import './element.css'

const EmailInput = ({onChangeHandler, changeValue, classes, elementLabel, elementName, element_id}) => {
  return (
    <div className={`email_input_main_container ${classes}`}>
        <label className='element_input_label' htmlFor="">{elementLabel}</label>
        <input id={element_id} class="email_input_container" type="email" name={elementName} value={changeValue} onChange={onChangeHandler}></input>
    </div>
  )
}

export default EmailInput
