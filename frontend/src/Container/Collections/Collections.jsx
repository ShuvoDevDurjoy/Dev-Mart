import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import axios from "axios";
import "./Collections.css";
import ProductCard from "../../Component/ProductCard/ProductCard";

const Collections = () => {
  const [product, setProduct] = useState([]);
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelecetedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const categoryRefs = useRef([]);
  const typeRefs = useRef([]);

  const handleCategoryClick = (id)=>{
    console.log(id);
    if(id===selectedCategory){
      setSelecetedCategory("all")
      setSelectedType("all")
    }
    else{
      setSelecetedCategory(id);
      setSelectedType("all");
    }
  }

  const setCategoryRef = (ref) => {
    if (ref && !categoryRefs.current.includes(ref)) {
      categoryRefs.current = [...categoryRefs.current, ref];
    }
  };

  const setTypeRef = (ref) => {
    if (ref && !typeRefs.current.includes(ref)) {
      typeRefs.current = [...typeRefs.current, ref];
    }
  };

  const loadCategory = async () => {
    const result = await axios.get("http://localhost:5000/product/categories");

    if (!result) {
      console.log("Here is an error");
    }

    setCategory(result.data.data);
  };

  const loadProduct = async (page, reset) => {
    try {
      const params = {
        page: page,
        limit: 100,
      };

      if (selectedCategory) params.categroy_id = selectedCategory;
      if (selectedType) params.type_id = selectedType;

      const res = await axios.get(
        "http://localhost:5000/product/products",
        params
      );

      if (!res) {
        return;
      }

      const newProducts = res.data.data;


      if (reset) {
        setProduct(newProducts);
      } else {
        setProduct((prev) => [...new Set([...prev, ...newProducts])]);
      }

      setPage((prev) => prev + 1);
      setHasMore(newProducts.length > 0);
    } catch (e) {
      console.log("There is an error", e.message);
    }
  };

  const filteredProduct = useMemo(() => {
    console.log("Entered filter")
    return product.filter((product) => {
      if (selectedCategory === "all") {
        return true;
      } else if (selectedType === "all") {
        return selectedCategory === product.category_id;
      }
      else {
        return selectedCategory === product.category_id && selectedType === product.product_type_id
      }
    });
  }, [product,selectedCategory, selectedType]);

  useEffect(() => {
    console.log(selectedCategory, selectedType);
  }, [selectedCategory, selectedType]);

  useEffect(() => {
    loadCategory();
    loadProduct(1, true);
  }, []);

  return (
    <div className="collection_main_container">
      <div className="collection_container">
        {category &&
          category.map((cat, index) => {
            return (
              <div
                data-page-index={1}
                className={`category_container ${selectedCategory===cat.category_id?'active':''}`}
                key={`category_index_${index}`}
                ref={setCategoryRef}
                onClick={() => {
                  handleCategoryClick(cat.category_id)
                }}
              >
                <div className="category_image_container">
                  <img
                    className="category_image"
                    src={cat.category_image_link}
                  ></img>
                </div>
                <p>{cat.category_name}</p>
              </div>
            );
          })}
      </div>
      <div className="type_container">
        {category.map((cat, index) => {
          if (cat.category_id === selectedCategory) {
            return cat.product_type.map((type, ind) => {
              return (
                <div
                  className={`type_inner_container ${selectedType===type.type_id?"active":''}`}
                  data-page-index={1}
                  key={`type_index_${ind}`}
                  ref={setTypeRef}
                  onClick={() => {
                    handleCategoryClick(cat.category_id)
                  }}
                >
                  <div className="type_image_container">
                    <img className="type_image" src={type.type_image}></img>
                  </div>
                  <p>{type.type_name}</p>
                </div>
              );
            });
          }
        })}
      </div>

      <div className="product_grid_container">
        <div className="product_grid_inner_container">
          {
            filteredProduct.map((p,index)=>{
              return (
                <ProductCard key={`product_${index}`} product={p} />
              )
            })
          }
        </div>
      </div>
    </div>
  );
};

export default Collections;
