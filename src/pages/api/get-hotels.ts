// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Hotel } from '@/src/types/hotel'

const hotels: Hotel[] = [
    {name: "American Hotel", id: 0, "stars": 5, address: "", nRooms: 64, phonenumbers: ["613 123 4567"], emails: ["email@example.com"], chainId: 0, photos: ["https://source.unsplash.com/random/?hotel,sunny", "https://source.unsplash.com/random/?hotel,warm", "https://source.unsplash.com/random/?hotel,beach"]},
    {name: "Canadian Hotel", id: 1, "stars": 5, address: "", nRooms: 64, phonenumbers: ["613 123 4567"], emails: ["email@example.com"], chainId: 0,  photos: ["https://source.unsplash.com/random/?hotel,winter", "https://source.unsplash.com/random/?hotel,cold", "https://source.unsplash.com/random/?hotel,dark"]},
    {name: "French Hotel", id: 2, "stars": 5, address: "", nRooms: 64, phonenumbers: ["613 123 4567"], emails: ["email@example.com"], chainId: 0,  photos: ["https://source.unsplash.com/random/?hotel,green", "https://source.unsplash.com/random/?hotel,trees", "https://source.unsplash.com/random/?hotel,plants"]}
]

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Hotel[]>
) {
  res.status(200).json(hotels)
}