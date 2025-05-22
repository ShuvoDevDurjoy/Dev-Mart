import React, { useEffect } from 'react'

const SelectionInput = ({elementLabel, elementName, options, onChangeHandler, selectedValue, classes, id, option_name, option_value}) => {
  useEffect(()=>{
  console.log(classes)
  console.log(options);
  },[])
  return (
    <div className={`selection_input_main_container ${classes}`}>
        <elementLabel className='element_input_label' htmlFor={id}>{elementLabel}</elementLabel>
        <select class="selection_input_container" id={id} value={selectedValue} name={elementName} onChange={onChangeHandler}>
            {
                options.map((option,index)=>{
                    return <option value={option[option_value]}>{option[option_name]}</option>
                })
            }
        </select>
    </div>
  )
}

export default SelectionInput
