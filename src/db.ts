import mongoose, { Schema, model } from "mongoose";

export const linkSchema = new Schema({
  link: String,
  name: String,
  passwordProtected: { type: Boolean, default: false },
  visitCount: { type: Number, default: 0 },
});

export const linkModel = model("link", linkSchema);

export async function connectToDatabase(DATABASE_URL: string) {
  return await mongoose.connect(DATABASE_URL);
}
export async function getLink(name: string) {
  return await linkModel.findOne({ name: name.toLowerCase() });
}
export async function getAllLinks() {
  const links = await linkModel.find();
  return links.map((link) => ({
    name: link.name,
    link: link.link,
  }));
}
export async function addLink(link: {
  link: string;
  name: string;
  passwordProtected?: boolean;
}) {
  return await linkModel.create({
    ...link,
    name: link.name.toLowerCase(),
  });
}
