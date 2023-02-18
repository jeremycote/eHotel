// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Hotel } from "@/src/types/hotel";
import { hotels } from "@/src/mock-data/hotel-data";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Hotel>
) {
  const { hotelId } = req.query;

  hotels.forEach((hotel) => {
    if (hotel.id.toString() === hotelId) {
      res.status(200).json(hotel);
    }
  });

  res.status(404);
}
