import axios from "axios";
import React, { useEffect, useState } from "react";
import SelectionInput from "../../../Elements/SelectionInput";
import TextInput from "../../../Elements/TextInput";
import SubmitButton from "../../../Elements/SubmitButton";
import SingleFileInput from "../../../Elements/SingleFileInput";
const AddType = () => {
  const [type, setType] = useState({
    type_name: "",
    category_id: "",
    type_image: null,
  });

  const [category, setCategory] = useState([]);

  const onTypeChange = (event) => {
    try {
      setType({
        ...type,
        [event.target.name]: event.target.value,
      });
    } catch (e) {
      window.alert("Error with setting type");
    }
  };

  const onTypeFileChange = (event) => {
    try {
      setType({
        ...type,
        [event.target.name]: event.target.files[0],
      });
    } catch (e) {
      window.alert("Error with uploading the image");
    }
  };

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/product/get_categories_with_id"
        );
        if (response.data.success) {
          console.log(response.data.categories);
          setCategory(response.data.categories);
        }
      } catch (e) {
        window.alert("Error with fetching Category");
      }
    };
    fetchCategory();
  }, []);

  useEffect(() => {
    console.log("Category is : ", category);
    if (category.length > 0) {
      setType({
        ...type,
        category_id: category[0].category_id,
      });
    }
  }, [category]);

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();
      const data = new FormData();
      data.append("type_name", type.type_name);
      data.append("category_id", type.category_id);
      data.append("type_image", type.type_image);

      console.log(type);

      const response = await axios.post(
        "http://localhost:5000/product/add_type",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (!response.data.success) {
        window.alert(response.data.message);
        return -1;
      } else {
        window.alert(response.data.message);
        setType({
            "type_name": "",
            "category_id": category[0].category_id,
            "type_image": null
        });
      }
    } catch (e) {
        window.alert(e.response.data.message);
    }
  };
  return (
    <div>
      <h2 className="top_fixed">Add Type</h2>
      <form onSubmit={onSubmitHandler}>
        <TextInput
          elementLabel={"Type Name"}
          elementName={"type_name"}
          element_id={"type_name_input_field"}
          onChangeHandler={onTypeChange}
          changeValue={type.type_name}
        ></TextInput>
        <SelectionInput
          elementLabel={"Select Category"}
          elementName={"category_id"}
          id={"category_selection_for_type"}
          onChangeHandler={onTypeChange}
          options={category}
          selectedValue={type.category_id}
          option_name={"category_name"}
          option_value={"category_id"}
        ></SelectionInput>
        <SingleFileInput
          elementLabel={"Select Type Image"}
          elementName={"type_image"}
          element_id={"type_image_input_field"}
          onChangeHandler={onTypeFileChange}
        ></SingleFileInput>

        <SubmitButton button_text={"Add Category"}></SubmitButton>
      </form>
    </div>
  );
};

export default AddType;
