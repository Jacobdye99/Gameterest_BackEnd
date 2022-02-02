import bcrypt from 'bcryptjs'

export const securePassword = async password => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  // console.log(hashedPassword)
  return hashedPassword;
};