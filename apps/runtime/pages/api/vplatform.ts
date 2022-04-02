import type { NextApiRequest, NextApiResponse } from 'next'
import Request from './request'
const BASEURL = 'http://10.1.28.71:8080/api/vplatform/module-operation!executeOperation'
let request = new Request(BASEURL)

export default function (req: NextApiRequest, res: NextApiResponse) {
  let params = Object.assign(req.query, req.body)
  request
    .get(params)
    .then((data) => {
      res.status(200).json(data)
    })
    .catch((error) => {
      res.status(500).json(error)
    })
}
