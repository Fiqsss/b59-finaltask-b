const pool = require("../db");
const path = require("path");
const fs = require("fs");
exports.renderKabupaten = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM kabupaten_tb");
    // console.log(result.rows);

    const data = result.rows.map((kabupaten) => {
      const formatedDate = kabupaten.diresmikan.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      return {
        ...kabupaten,
        diresmikan: formatedDate,
      };
    });
    res.render("kabupaten", {
      kabupatens: data,
      page: "kabupaten",
      user: req.session.user,
    });
  } catch (err) {
    console.error(err);
    res.send("Error .");
  }
};

exports.renderDetailKabupaten = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM kabupaten_tb WHERE id = $1",
      [req.params.id]
    );
    // console.log(result.rows);
    const kabupaten = result.rows[0];
    kabupaten.diresmikanFormatted = new Date(
      kabupaten.diresmikan
    ).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    kabupaten.diresmikanInputFormat = new Date(kabupaten.diresmikan)
      .toISOString()
      .split("T")[0];

    res.render("partials/detailkabupaten", {
      kabupaten: result.rows[0],
      page: "kabupaten",
      user: req.session.user,
    });
  } catch (err) {
    console.error(err);
    res.send("Error .");
  }
};

exports.addKabupaten = async (req, res) => {
  try {
    const { nama, diresmikan, provinsi_id } = req.body;
    let imageFileName = null;
    if (!nama || !diresmikan || !provinsi_id) {
      req.session.flash = {
        message: "All fields are required.",
        type: "error",
      };
      return res.status(400).redirect("/kabupaten");
    }
    if (req.file) {
      imageFileName = req.file.filename;
    }
    const result = await pool.query(
      "INSERT INTO kabupaten_tb (nama, diresmikan, provinsi_id,photo) VALUES ($1, $2, $3,$4)",
      [nama, diresmikan, provinsi_id, imageFileName]
    );
    console.log(result.rows);
    req.session.flash = {
      message: "Kabupaten added successfully.",
      type: "success",
    };
    res.redirect("/kabupaten");
  } catch (err) {
    console.error(err);
    res.send("internal server error");
  }
};

exports.deleteKabupaten = async (req, res) => {
  try {
    const uploadDir = path.resolve(__dirname, "../public/img/kabupaten");
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM kabupaten_tb WHERE id = $1 RETURNING photo",
      [id]
    );

    if (result.rows.length === 0) {
      req.session.flash = {
        message: "Kabupaten not found.",
        type: "error",
      };
      return res.redirect("/kabupaten");
    }

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
      message: "Kabupaten deleted successfully.",
      type: "success",
    };
    res.redirect("/kabupaten");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.editKabupaten = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, diresmikan, provinsi_id } = req.body;
    const uploadDir = path.resolve(__dirname, "../public/img/kabupaten/");
    let imageFileName = null;

    const find = await pool.query("SELECT * FROM kabupaten_tb WHERE id = $1", [
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
      "UPDATE kabupaten_tb SET nama = $1, diresmikan = $2, provinsi_id = $3 , photo = $4 WHERE id = $5 RETURNING photo",
      [nama, diresmikan, provinsi_id, imageFileName ,id]
    );

    req.session.flash = {
      message: "Kabupaten updated successfully.",
      type: "success",
    };
    res.redirect("/kabupaten");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};
