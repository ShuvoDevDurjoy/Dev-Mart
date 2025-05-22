import React, { useState } from 'react'
import TextInput from '../../../Elements/TextInput'
import axios from 'axios';
import SingleFileInput from '../../../Elements/SingleFileInput';
import SubmitButton from '../../../Elements/SubmitButton';

const AddCategory = () => {

    const [formData, SetformData] = useState({
        category_name: '',
        category_image: null
    })

    const onChangeHandler = (event)=>{
        SetformData({
            ...formData,
            [event.target.name]: event.target.value
        })
    }

    const onFileChange = (event)=>{
        SetformData({
            ...formData,
            [event.target.name]: event.target.files[0]
        })
    }

    const onCategorySubmit = async(event)=>{
        try{
            event.preventDefault();
            const data = new FormData();
            data.append('category_name',formData.category_name)
            data.append('category_image', formData.category_image)
            const response = await axios.post("http://localhost:5000/product/set_category", data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            
            if(response.data.success){
                console.log(response.data)
                alert("Category Added Successfully");
            }
            else{
                alert("Failed to Add Category");
            }
        }catch(e){
            console.log(e);
        }
    }
  return (
    <div>
      <h2 class="top_fixed">Add Category</h2>
      <div>
        <form onSubmit={onCategorySubmit}>
            <TextInput
                elementLabel={"Category Name"}
                elementName={"category_name"}
                element_id={"category_name_input_field"}
                onChangeHandler={onChangeHandler}
                changeValue={formData.category_name}
            ></TextInput>
            <SingleFileInput
                elementLabel={"Select Category Image"}
                elementName={"category_image"}
                element_id={"category_image_input_field"}
                onChangeHandler={onFileChange}
            ></SingleFileInput>
            
            <SubmitButton button_text={"Add Category"}></SubmitButton>
        </form>
      </div>
    </div>
  )
}

export default AddCategory
