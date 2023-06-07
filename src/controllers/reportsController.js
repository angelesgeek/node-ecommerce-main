const db = require("../database/models");
const fs = require("fs");
const PDFDocument = require("pdfkit");

const renderReports = async (req, res) => {
 
    return res.render("reports", { user: req.session.userLogged });
  };

module.exports = {
  renderReports
};

