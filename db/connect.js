import mongoose from 'mongoose';

export const connectDB = async (url) => {
  return mongoose.connect(url, {
    family: 4, // Force IPv4 to prevent DNS errors (ESERVFAIL)
  });
};
