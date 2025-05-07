const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function authHash(argu) {
  const salt = await bcrypt.genSalt(10);
  const hashpassword = await bcrypt.hash(argu.password, salt);
  console.log("hashPassword!:", hashpassword);
  return hashpassword;
}

async function compareHash(Pass) {
  try {
    const result = await bcrypt.compare(Pass.userPass, Pass.dbPass);
    return result;
  } catch (error) {
    console.error("Password comparison error:", error);
    return false;
  }
}

async function createToken(argu) {
  console.log("MYARGU:", argu);
  const token = await jwt.sign(argu, "mysecretkeyofcreatingtoken", {
    expiresIn: 604800,
  });
  console.log("TOKEN FROM AUTH!", token);
  return token;
}

module.exports = { authHash, createToken, compareHash };
