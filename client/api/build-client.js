import axios from 'axios';

export const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    // server side
    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    });
  } else {
    // client side (browser)
    return axios.create({
      baseURL: '/',
    });
  }
};
