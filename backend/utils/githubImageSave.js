import path from 'path'
import axios from 'axios'

const githubMultipleUpload = async (req, res, next) => {
    try {
      const files = req.files;
      var uploadFiles = [];
  
      for (let index = 0; index < files.length; index++) {
        const file = files[index];
        const fileExtensionName = path.extname(file.originalname);
  
        const fileDirectoryName = `${Date.now()}-${
          Math.random() * 1e6
        }${fileExtensionName}`;
        const gitfilename = `${process.env.GITHUB_IMAGE_PATH_PREFIX}${fileDirectoryName}`;
        const fileBase64 = file.buffer.toString("base64");
  
        const data = {
          message: `Add File ${gitfilename}`,
          content: fileBase64,
          branch: process.env.GIT_BRANCH,
        };
  
        const headers = {
          Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
          "Content-Type": "application/vnd.github+json",
        };
  
        const deployURL = `https://api.github.com/repos/${process.env.GITHUB_USER}/${process.env.GITHUB_IMAGE_REPO}/contents/${gitfilename}`;
  
        const response = await axios.put(deployURL, data, { headers });
  
        uploadFiles.push(`https://raw.githubusercontent.com/${process.env.GITHUB_USER}/${process.env.GITHUB_IMAGE_REPO}/${process.env.GIT_BRANCH}/${gitfilename}`);
      }
  
      req.body.image_files = uploadFiles;
  
      next();
    } catch (e) {
      console.log(e.message);
      return res.send({
        success: false,
        message: "GitHub upload failed",
      });
    }
  };

export {
    githubMultipleUpload
}