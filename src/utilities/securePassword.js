import bcrypt from 'bcryptjs'

export const securePassword = async password => {
  console.log(password);
  const salt = bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log(hashedPassword);
  return hashedPassword;
};