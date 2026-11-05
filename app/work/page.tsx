import { redirect } from "next/navigation";
import { categories } from "./catalog";

// The combined index was split into Product Design and Architecture & Spatial Work.
// Keep /work working for existing links by sending visitors to the lead category.
export default function WorkIndex() {
  redirect(categories.product.href);
}
