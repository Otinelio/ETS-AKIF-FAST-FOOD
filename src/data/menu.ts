export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
}

export interface RestaurantSettings {
  name: string;
  tagline: string;
  whatsapp: string;
  address: string;
  hours: string;
  instagram: string;
  sunday_note: string;
}

export interface KitchenOrder {
  id: number;
  table_number: string;
  items: { id: string; name: string; price: number; quantity: number }[];
  total: number;
  note?: string;
  status: "pending" | "preparing" | "done";
  created_at: string;
}

import burger from "../assets/img/Capture d’écran du 2026-04-09 10-12-46.png";
import heroShawarma from "../assets/img/Capture d’écran du 2026-04-09 10-12-52.png";
import heroFire from "../assets/img/Capture d’écran du 2026-04-09 10-13-05.png";
import kafta from "../assets/img/Capture d’écran du 2026-04-09 10-13-13.png";
import pouletGrille from "../assets/img/Capture d’écran du 2026-04-09 10-13-18.png";
import brochettes from "../assets/img/Capture d’écran du 2026-04-09 10-13-43.png";
import jusNaturels from "../assets/img/Capture d’écran du 2026-04-09 10-14-10.png";
import glaces from "../assets/img/Capture d’écran du 2026-04-09 10-14-21.png";
import restaurantInterior from "../assets/img/Capture d’écran du 2026-04-09 10-14-30.png";
import galleryJuice from "../assets/img/Capture d’écran du 2026-04-09 10-14-54.png";
import galleryKofta from "../assets/img/Capture d’écran du 2026-04-09 10-15-04.png";
import galleryBurger from "../assets/img/Capture d’écran du 2026-04-09 10-19-10.png";
import galleryIce from "../assets/img/Capture d’écran du 2026-04-09 10-19-15.png";
import ambianceNight from "../assets/img/Capture d’écran du 2026-04-09 10-19-38-1.png";
import akifLogo from "../assets/akif-logo.png";

export {
  burger,
  heroShawarma,
  heroFire,
  kafta,
  pouletGrille,
  brochettes,
  jusNaturels,
  glaces,
  restaurantInterior,
  galleryJuice,
  galleryKofta,
  galleryBurger,
  galleryIce,
  ambianceNight,
  akifLogo,
};
