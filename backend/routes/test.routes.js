import Router from "express";
import { github_upload } from "../config/multer.config.js";
import {
  githubUpload,
} from "../middleware/product.middleware.js";
import path from "path";
import axios from "axios";
import { v4 as uuid } from 'uuid'

const test = Router();


test.get('/get_product',checkProductId, checkProductIdDB, returnProduct);

export { test };
