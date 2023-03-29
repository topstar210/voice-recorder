import fs from 'fs-extra';
import { v4 as uuidv4 } from "uuid";

const dateString = () => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = ('0' + (d.getMonth() + 1)).slice(-2);
    const dd = ('0' + d.getDate()).slice(-2);
    return yyyy + mm + dd;
}

const getDir = (data) => {
    let filePath = process.env.FILE_SAVE_PATH;
    if (!fs.existsSync(filePath)) fs.mkdirSync(filePath);

    filePath = filePath + "/" + data.pinCode;
    if (!fs.existsSync(filePath)) fs.mkdirSync(filePath);

    filePath = filePath + "/" + dateString();
    if (!fs.existsSync(filePath)) fs.mkdirSync(filePath);

    return filePath;
}

export default {
    save: async (req, res) => {
        const file = JSON.parse(JSON.stringify(req.files))
        const old_name = file.audio.name;
        const file_name = uuidv4().replace(/\-/g, "") + "___" + old_name;
        const buffer = new Buffer.from(file.audio.data.data)

        let dir = getDir(req.body);

        fs.writeFile(`${dir}/${file_name}`, buffer, async (err) => {
            console.log("Successfully Written to File.");
            res.send({
                name: file_name
            })
        });
    },

    get: async (req, res) => {
        let dir = getDir(req.params);

        fs.readdir(dir, function (err, files) {
            if (err) console.log(err)

            if(files.length === 0) {
                res.send([]); return;
            };

            files = files.map(function (fileName) {
                return {
                    name: fileName,
                    time: fs.statSync(dir + '/' + fileName).mtime.getTime()
                };
            })
                .sort(function (a, b) {
                    return a.time - b.time;
                })
                .map(function (v) {
                    return dateString() + "/" + v.name;
                });
            res.send(files);
        });
    },

    // // delete files or file
    // delete: async (req, res) => {
    //     let filePath = process.env.FILE_SAVE_PATH;
    //     const fullPath = filePath + "/" + req.params.pinCode + "/" + (req.params.file ? "/" + req.params.file : "");
    //     if (!req.params.file) {
    //         if (fs.existsSync(fullPath)) {
    //             fs.rmdirSync(fullPath, { recursive: true })
    //         }
    //     } else {
    //         fs.unlink(`${fullPath}`, () => { })
    //     }
    //     res.send("Okay");
    // }

    // when delete, move to removed folder
    delete: async (req, res) => {
        let removedPath = process.env.FILE_SAVE_PATH + "/" + req.params.pinCode + "/removed_files";
        if (!fs.existsSync(removedPath)) fs.mkdirSync(removedPath);

        const oldPath = process.env.FILE_SAVE_PATH + "/" + req.params.pinCode + "/" + dateString() + "/" + (req.params.file ? "/" + req.params.file : "");
        const newPath = removedPath + "/" + (req.params.file ? "/" + req.params.file : "");
        fs.rename(oldPath, newPath, function (err) {
            if (err) throw err
            console.log('Successfully renamed - AKA moved!')
        })
        res.send("Okay");
    },

    getRemovedFiles: async (req, res) => {
        fs.readdir(process.env.FILE_SAVE_PATH + "/" + req.params.pinCode + "/removed_files", (error, files) => {
            if (error) console.log(error)

            res.send(files);
        })
    },

}