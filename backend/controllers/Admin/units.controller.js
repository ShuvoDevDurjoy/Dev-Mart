import db from "../../database/models/index.mjs";

const getCurrencyWithId = async(req, res)=>{
    try{
        const currencies = await db.ProductCurrency.findAll({
            attributes: ['currency_id', 'currency_code']
        });
        return res.status(200).json({
            success: true,
            message: "Currency retrieve Successfull",
            currencies:[ ...currencies]
        })
    }catch(e){
        return res.status(500).json({
            success: false,
            message: "Internal server Error"
        })
    }
}


const setCurrencyDB = async (req, res) => {
  try {
    const dup_curr = await db.ProductCurrency.findOne({
      where: {
        currency_code: req.body.currency_code,
      },
    });

    if (dup_curr) {
      return res.status(209).json({
        success: false,
        message: "Duplicate Entry",
      });
    }

    const cur = await db.ProductCurrency.create({
      currency_code: req.body.currency_code,
      exchange_rate: req.body.exchange_rate,
    });

    if (!cur) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }

    return res.status(201).json({
        success: true,
        message: "Currency Added Successfully"
    })
  } catch (e) {
    if (e.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        success: false,
        message: "Category Already Exists",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      e_message: e.message
    });
  }
};

export { setCurrencyDB, getCurrencyWithId };
