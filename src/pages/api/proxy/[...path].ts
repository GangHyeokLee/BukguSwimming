import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path = [] } = req.query;
  const targetPath = Array.isArray(path) ? path.join('/') : path;

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/${targetPath}${req.url?.includes('?') ? '?' + req.url.split('?')[1] : ''}`;
  console.log(`Proxying request to: ${url}`);
  try {
    const response = await axios.request({
      url,
      method: req.method,
      headers: req.headers,
      data: ['POST', 'PUT', 'PATCH'].includes(req.method || '') ? req.body : undefined,
    });
  
    console.log(`Response status: ${response.status}`);
    res.status(response.status).send(response.data);
  } 
  catch (error: unknown) {
    const err = error as { response?: { status: number; data: unknown, config: unknown } };
    res.status(err?.response?.status || 500).json(err?.response?.data || { error: 'Proxy failed' });
  }
}
