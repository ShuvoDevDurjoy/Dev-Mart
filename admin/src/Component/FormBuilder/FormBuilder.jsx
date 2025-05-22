import React from "react";
import './FormBuilder.css'

const FormBuilder = ({ form_action, form_content }) => {
  return (
    <div className="form_inner_container">
      <form action={form_action}>
        <div className="form_container_inside">
          {form_content.map((inner_content, index) => {
            return (
              <div className="form_container">
                <div className="input_type_name">{inner_content[0]} : </div>
                <div className="input_fields">
                  {inner_content[1] === "select" ? (
                    <select name={inner_content[2]}>
                      {inner_content[3].map((content, i) => {
                        return <option value={content}>{content}</option>;
                      })}
                    </select>
                  ) : (
                    <input type={inner_content[1]} name={inner_content[2]} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </form>
    </div>
  );
};

export default FormBuilder;
