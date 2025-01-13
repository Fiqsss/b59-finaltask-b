const pool = require("../db");
const path = require("path");
const fs = require("fs");
exports.renderProvinsi = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM provinsi_tb");
    // console.log(result.rows);
    const data = result.rows.map((provinsi) => {
      const formatedDate = provinsi.diresmikan.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      return {
        ...provinsi,
        diresmikan: formatedDate,
      };
    });
    res.render("index", {
      provinsis: data,
      page: "provinsi",
      user: req.session.user,
    });
  } catch (err) {
    console.error(err);
    res.send("Error .");
  }
};

exports.renderDetailProvinsi = async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM provinsi_tb WHERE id = $1", [
        req.params.id,
      ]);
      
      if (result.rows.length === 0) {
        return res.status(404).send("Provinsi not found");
      }
  
      const provinsi = result.rows[0];
  
      provinsi.diresmikanFormatted = new Date(provinsi.diresmikan)
        .toLocaleDateString("id-ID", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
  
      provinsi.diresmikanInputFormat = new Date(provinsi.diresmikan)
        .toISOString()
        .split("T")[0];
  
      res.render("partials/detailprovinsi", {
        provinsi,
        page: "provinsi",
        user: req.session.user,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  };
  
exports.addProvinsi = async (req, res) => {
  try {
    const { nama, diresmikan, pulau, user_id } = req.body;
    let imageFileName = null;

    console.log("Received data:", { nama, diresmikan, pulau, user_id });

    if (!nama || !diresmikan || !pulau || !user_id) {
      req.session.flash = {
        message: "All fields are required, including the photo.",
        type: "error",
      };
      console.log("Error: Missing fields or photo");
      return res.status(400).redirect("/provinsi");
    }

    if (req.file) {
      imageFileName = req.file.filename;
    }

    console.log("Uploaded image filename:", imageFileName);

    const result = await pool.query(
      "INSERT INTO provinsi_tb (nama, diresmikan, photo, user_id, pulau) VALUES ($1, $2, $3, $4, $5)",
      [nama, diresmikan, imageFileName, user_id, pulau]
    );

    console.log("Query result:", result.rows);

    req.session.flash = {
      message: "Provinsi added successfully.",
      type: "success",
    };
    res.redirect("/provinsi");
  } catch (err) {
    console.error(err);
    res.send("internal server error");
  }
};

exports.deleteProvinsi = async (req, res) => {
  try {
    const uploadDir = path.resolve(__dirname, "../public/img/provinsi");
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM provinsi_tb WHERE id = $1 RETURNING photo",
      [id]
    );
    const imageFileName = result.rows[0].photo;
    console.log(imageFileName);

    if (imageFileName) {
      const imagePath = path.join(uploadDir, imageFileName);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log("Gambar berhasil dihapus.");
      } else {
        console.log("Gambar tidak ditemukan di server.");
      }
    }

    req.session.flash = {
      message: "Provinsi deleted successfully.",
      type: "success",
    };
    res.redirect("/provinsi");
  } catch (err) {
    console.error(err);
    res.send("internal server error");
  }
};

exports.editProvinsi = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, diresmikan, pulau, user_id } = req.body;
    const result = await pool.query(
      "UPDATE provinsi_tb SET nama = $1, diresmikan = $2, user_id = $3, pulau = $4 WHERE id = $5",
      [nama, diresmikan, user_id, pulau, id]
    );
    req.session.flash = {
      message: "Provinsi updated successfully.",
      type: "success",
    };
    res.redirect("/provinsi");
  } catch (err) {
    console.error(err);
    res.send("internal server error");
  }
};

exports.editProvinsi = async (req, res) => {
    try {
      const { id } = req.params;
      const { nama, diresmikan, pulau ,user_id} = req.body;
      const uploadDir = path.resolve(__dirname, "../public/img/provinsi/");
      let imageFileName = null;
  
      const find = await pool.query("SELECT * FROM provinsi_tb WHERE id = $1", [
        id,
      ]);
  
      const oldImage = find.rows[0].photo;
      imageFileName = oldImage;
  
      if (req.file) {
        imageFileName = `${Date.now()}_${req.file.originalname}`;
  
        if (oldImage) {
          const oldImagePath = path.join(uploadDir, oldImage);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
            console.log("Old image deleted successfully.");
          }
        }
  
        const newImagePath = path.join(uploadDir, imageFileName);
        fs.renameSync(req.file.path, newImagePath);
        console.log("New image uploaded successfully.");
      }
  
      const result = await pool.query(
        "UPDATE provinsi_tb SET nama = $1, diresmikan = $2, pulau = $3, user_id = $4 , photo = $5 WHERE id = $6 RETURNING photo",
        [nama, diresmikan, pulau, user_id, imageFileName ,id]
      );
  
      req.session.flash = {
        message: "provinsi updated successfully.",
        type: "success",
      };
      res.redirect("/provinsi");
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  };
  