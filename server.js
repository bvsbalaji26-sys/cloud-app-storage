const express = require("express");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`
    <html>
    <head>
      <title>Cloud Storage Project</title>
      <style>
        body{
          font-family: Arial, sans-serif;
          background:#f4f4f4;
          text-align:center;
          padding-top:50px;
        }
        .box{
          background:white;
          width:400px;
          margin:auto;
          padding:20px;
          border-radius:10px;
          box-shadow:0 0 10px gray;
        }
        input{
          width:90%;
          padding:10px;
          margin:10px;
        }
        button{
          padding:10px 20px;
          background:green;
          color:white;
          border:none;
          cursor:pointer;
        }
      </style>
    </head>
    <body>
      <div class="box">
        <h1>Cloud Storage Project</h1>

        <form action="/upload" method="POST">
          <input type="text" name="filename" placeholder="File Name" required>
          <input type="text" name="filedata" placeholder="File Data" required>
          <br>
          <button type="submit">Upload File</button>
        </form>
      </div>
    </body>
    </html>
  `);
});

app.post("/upload", (req, res) => {
  const { filename, filedata } = req.body;

  res.send(`
    <html>
    <body style="font-family:Arial;text-align:center;padding-top:50px;">
      <h1>File Uploaded Successfully ✅</h1>
      <p><b>File Name:</b> ${filename}</p>
      <p><b>File Data:</b> ${filedata}</p>
      <a href="/">Go Back</a>
    </body>
    </html>
  `);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
