const path = require("path");
const express = require("express");

exports.imagePath = ("/images", express.static(path.join(__dirname, "images")));
