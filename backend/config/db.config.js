const productTableQuery = `
    CREATE TABLE IF NOT EXISTS products(
        product_id VARCHAR(100) PRIMARY KEY,
        product_category VARCHAR(50) NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        product_prize INT NOT NULL,
        product_availability INT NOT NULL,
        product_quantity INT NOT NULL,
        product_unit VARCHAR(10) NOT NULL,
        product_filename VARCHAR(50) NOT NULL,
        product_github_image_link VARCHAR(500) NOT NULL,
        product_local_image_link VARCHAR(500) NOT NULL,
        product_description VARCHAR(500),  -- Fixed the typo here
        product_added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        product_update_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        product_ratings FLOAT DEFAULT 0.0
    )
`;

const savingProductQuery = `
    INSERT INTO products(
            product_id,
            product_category,
            product_name,
            product_prize,
            product_availability,
            product_quantity,
            product_unit,
            product_filename,
            product_github_image_link,
            product_local_image_link,
            product_description
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?)
`;

const retrieveProductFromDatabaseQuery = `
        SELECT 
            product_id,
            product_category,
            product_name,
            product_prize,
            product_availability,
            product_quantity,
            product_unit,
            product_github_image_link,
            product_local_image_link
        FROM products
`;

const removeProductFromDatabaseQuery = `
        DELETE FROM products WHERE product_id=?
`

const removeProductFromGithubQuery = `
    SELECT 
    product_github_image_link,
    product_local_image_link FROM 

`

const removeProductImageFromLocalDirectoryQuery = `
    SELECT 
    product_filename
    FROM products WHERE product_id=?
`
const removeAllProductFromDatabaseQuery = `
        DELETE FROM products
`

export { 
    productTableQuery,
    savingProductQuery,
    retrieveProductFromDatabaseQuery,
    removeProductImageFromLocalDirectoryQuery,
    removeAllProductFromDatabaseQuery,
    removeProductFromDatabaseQuery
};
