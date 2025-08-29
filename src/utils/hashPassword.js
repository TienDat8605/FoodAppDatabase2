const bcrypt = require("bcrypt");

(async () => {
  const plainPassword = "nguyen12345";
  const saltRounds = 10;

  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  console.log("Hashed password:", hashedPassword);
})();

