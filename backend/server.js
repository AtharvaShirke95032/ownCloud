require("dotenv").config();
const express = require("express")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const cors = require("cors")

const app = express();
const PORT = process.env.PORT || 4000

app.use(cors({origin: "http://localhost:3000", credentials: true }))

const uploadDir = path.join(__dirname,"uploads");
if(!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
    destination:(req,file,cb) => cb(null,uploadDir),
    filename:(req,file,cb) => cb(null,`${Date.now()}-${file.originalname}`),

});

const upload = multer({storage});


app.post("/upload",upload.single("file"),(req,res)=>{
    const{password} = req.headers["x-password"]
    if(password !== process.env.ADMIN_PASSWORD) { 
        return res.status(401).json({ message: "Unauthorized" });
    }

    res.json({message: "File uploaded!", file: req.file})
})

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}`);
});