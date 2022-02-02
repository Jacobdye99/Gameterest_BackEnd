import bcrypt from 'bcryptjs'

export const securePassword = async password => {
  const salt = bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};