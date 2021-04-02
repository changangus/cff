import axios from 'axios';

export const geocode = async (address: string) => {
  const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
    params: {
      address,
      key: process.env.GOOGLE_API
    }
  });

  return response;
}