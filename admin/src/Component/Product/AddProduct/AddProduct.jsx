import React, { useContext, useEffect, useState } from "react";
import TextInput from "../../../Elements/TextInput";
import "./AddProduct.css";
import { Context } from "../../../Context";
import SelectionInput from "../../../Elements/SelectionInput";
import TextArea from "../../../Elements/TextArea";
import MultipleImageFileInput from "../../../Elements/MultipleImageFileInput";
import SubmitButton from "../../../Elements/SubmitButton";
import axios from "axios";

const AddProduct = () => {
  const [product, setProduct] = useState({
    product_name: "",
    product_category_id: "",
    product_type_id: "",
    product_description: "",
    product_price: '',
    product_currency_id: '',
    product_available: ''
  });
  
  const [productImages, setProductImages] = useState([]);


  const {productCategory, productCurrencies} = useContext(Context);

  const [productType, setProductType] = useState([]);



  const onTextChange = (event) => {
    const { name, value } = event.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const onSelectionChange = (event)=>{
    const {name, value} = event.target;
    console.log(value)
    setProduct({
      ...product,
      [name]: value
    })

  }
  const onCategoryChange = (event) => {
    const { name, value } = event.target;
    const selectedCategory = productCategory.find(p => p.category_id === value);
    const firstType = selectedCategory?.product_type[0]?.product_type_id || "";
  
    setProductType(selectedCategory?.product_type || []);
    setProduct(prev => ({
      ...prev,
      [name]: value,
      product_type_id: firstType
    }));
  };

  const onFileChange = (e) => {
    const files = Array.from(e.target.files);
    console.log(files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = function (event) {
        setProductImages(prev => [...prev, { 'file': file, 'preview': event.target.result}]);
      };
      reader.readAsDataURL(file);
    });

    console.log(productImages);

    e.target.value = '';
  };


  const onSubmitHandler = async(event)=>{
    try{

      console.log("Being Submitted");
      event.preventDefault();

      const formdata = new FormData();

      for(const key in product){
        formdata.append(key, product[key])
      }

      productImages.forEach(img => {
        formdata.append('product_images', img.file);
      });
      

      console.log(formdata)

      const response = await axios.post('http://localhost:5000/test/add_product',formdata,{
        headers: {
          "Content-Type": "multipart/formdata"
        }
      })

      if(response.data.success){
        alert("Product Added Successfully");
      }
      else{
        alert(response.data.message|"Failed to Add Product");
      }

    }catch(e){
      console.log("There is an error")
    }
  }
  
  

  useEffect(() => {
    console.log("product category size is : ",productCategory.length)
    if (productCategory.length > 0) {
      const firstCategory = productCategory[0];
      const firstType = firstCategory.product_type[0]?.product_type_id || "";
  
      setProductType(firstCategory.product_type);
      console.log("product type is : ",firstCategory.product_type);
      setProduct(prev => ({
        ...prev,
        product_category_id: firstCategory.category_id,
        product_type: firstType,
      }));
    }
  }, [productCategory]);
  

  useEffect(() => {
  console.log("Updated product:", product);
  }, [product]);
  
  

  return (
    <div className="add_product_container">
      <h2 className="add_product_title top_fixed">Add Product</h2>
      <div className="add_product_form_input_container">
        <TextInput
          value={product.product_name}
          onChangeHandler={onTextChange}
          elementName="product_name"
          elementLabel={"Product Name"}
          element_id={"product_name_1"}
        />
        <TextArea
          elementName={"product_description"}
          elementId={"product_description_textarea_1"}
          elementLabel={"Product Description"}
          elementValue={product.product_description}
          onChangeHandler={onTextChange}
        ></TextArea>
        <div className="el_fl">
          <SelectionInput 
            elementLabel={"Product Category"}
            elementName={"product_category_id"}
            classes={"el_fl cat"}
            options={productCategory}
            onChangeHandler={onCategoryChange}
            selectedValue={product.product_category_id}
            id={"selection_input_1"}
            option_value={'category_id'}
            option_name={'category_name'}
          ></SelectionInput>
          <SelectionInput 
            elementLabel={"Product Type"}
            elementName={"product_type_id"}
            classes={"el_fl type"}
            options={productType}
            onChangeHandler={onSelectionChange}
            selectedValue={product.product_type_id}
            id={"selection_input_1"}
            option_value={"type_id"}
            option_name={"type_name"}
          ></SelectionInput>
          
        </div>
        <div className="el_fl">
          <SelectionInput
            elementLabel={"Select Currency"}
            elementName={"product_currency_id"}
            classes={"el_fl cur"}
            options={productCurrencies}
            onChangeHandler={onSelectionChange}
            selectedValue={product.product_currency_id}
            id={"selection_input_1"}
            option_value={"currency_id"}
            option_name={"currency_code"}
          >

          </SelectionInput>
          <TextInput
            value={product.price}
            classes="el_fl"
            onChangeHandler={onTextChange}
            elementName={"product_price"}
            elementLabel={"Product Price"}
            element_id={"product_price_1"}
          />
          <TextInput
            value={product.offer_price}
            onChangeHandler={onTextChange}
            classes={"el_fl"}
            elementName={"product_offer_price"}
            elementLabel={"Product Offer Price"}
            element_id={"product_offer_price_1"}
          />
        </div>
        <TextInput
          value={product.available}
          onChangeHandler={onTextChange}
          elementName={"product_available"}
          elementLabel={"Product Available"}
          element_id={"product_available_1"}
        />

        <MultipleImageFileInput
          elementName={"product_images"}
          elementLabel={"Product Images"}
          elementId={"product_image_file_input_1"}
          elementValue={productImages}
          setElementValue={setProductImages}
          onChangeHandler={onFileChange}
        />

        <SubmitButton
          button_text={"Submit Product"}
          onSubmitHandler={onSubmitHandler}
        ></SubmitButton>
      </div>
    </div>
  );
};

export default AddProduct;
