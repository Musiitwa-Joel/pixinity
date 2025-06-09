// This script generates a proper bcrypt hash for 'password123'
import bcrypt from "bcryptjs";

async function generateHash() {
  const password = "password123";
  const hash = await bcrypt.hash(password, 10);

  console.log("Password:", password);
  console.log("Generated hash:", hash);

  // Test the hash
  const isValid = await bcrypt.compare(password, hash);
  console.log("Hash validation:", isValid);

  // Generate SQL update statement
  console.log("\nSQL Update Statement:");
  console.log(
    `UPDATE users SET password_hash = '${hash}' WHERE email IN ('demo@pixinity.com', 'jane@pixinity.com', 'admin@pixinity.com');`
  );
}

generateHash().catch(console.error);
