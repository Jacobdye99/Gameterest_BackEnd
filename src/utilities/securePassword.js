import bcrypt from 'bcryptjs'

export const securePassword = password => {
  const salt = bcrypt.genSalt(10);
  const hashedPassword = bcrypt.hash(password, salt);
  return hashedPassword;
};