import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path = [] } = req.query;
  const targetPath = Array.isArray(path) ? path.join('/') : path;

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/${targetPath}${req.url?.includes('?') ? '?' + req.url.split('?')[1] : ''}`;

  try {
    const response = await axios.request({
      url,
      method: req.method,
      headers: req.headers,
      data: ['POST', 'PUT', 'PATCH'].includes(req.method || '') ? req.body : undefined,
    });

    res.status(response.status).send(response.data);
  } catch (error: any) {
    console.error('Proxy error:', error?.response?.data || error);
    res.status(error?.response?.status || 500).json(error?.response?.data || { error: 'Proxy failed' });
  }
}
