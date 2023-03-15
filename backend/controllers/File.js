import fs from 'fs-extra';

export default {
    save: async (req, res) => {
        const file = JSON.parse(JSON.stringify(req.files))
        const old_name = file.picture.name;
        const file_name = req.body.filename +"-"+ old_name;
        //if you want just the buffer format you can use it
        const buffer = new Buffer.from(file.picture.data.data)

        const filePath = process.env.FILE_PATH;
        /*await*/
        fs.writeFile(`${filePath}/${file_name}`, buffer, async (err) => {
            console.log("Successfully Written to File.");
            fs.unlink(`${filePath}/${file_name}`, () => { })
            res.send({
                filename: file_name
            })
        });
    }
}