import axios from 'axios'

export default class Request {
  public url

  constructor(url) {
    this.url = url
  }

  get(params) {
    let config: any = {
      method: 'GET',
      url: this.url,
      params
    }
    return new Promise((resolve, reject) => {
      axios(config)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
