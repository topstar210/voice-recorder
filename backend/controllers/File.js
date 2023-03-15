import fs from 'fs-extra';
import { v4 as uuidv4 } from "uuid";


export default {
    save: async (req, res) => {
        const file = JSON.parse(JSON.stringify(req.files))
        const old_name = file.audio.name;
        const file_name = uuidv4().replace(/\-/g, "") + "___" + old_name;
        const buffer = new Buffer.from(file.audio.data.data)

        let filePath = 'public';
        filePath = filePath + "/" + req.body.uniqBroswer;
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath);
        }
        fs.writeFile(`${filePath}/${file_name}`, buffer, async (err) => {
            console.log("Successfully Written to File.");
            res.send({
                name: file_name
            })
        });
    },
    
    get: async (req, res) => {
        let filePath = 'public';
        fs.readdir(filePath + "/" + req.params.foldername, (error, files) => {
            if (error) console.log(error)
            res.send(files);
        })
    },

    delete: async (req, res) => {
        let filePath = 'public';
        const fullPath = filePath + "/" + req.params.uniqBroswer + (req.params.file ? "/" + req.params.file : "");
        if(!req.params.file) {
            if (fs.existsSync(fullPath)) {
                fs.rmdirSync(fullPath, {recursive: true})
              }
        } else {
            fs.unlink(`${fullPath}`, () => { })
        }
        res.send("Okay");
    }
}