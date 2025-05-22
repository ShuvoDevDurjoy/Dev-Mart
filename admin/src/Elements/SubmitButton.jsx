import React from 'react'
import './element.css'

const SubmitButton = ({button_text, button_classes, onSubmitHandler}) => {
  return (
    <div class="submit_button_container">
        <button className={`on_submit_button ${button_classes}`} type="submit" onClick={onSubmitHandler}>{button_text}</button>
    </div>
  )
}

export default SubmitButton
