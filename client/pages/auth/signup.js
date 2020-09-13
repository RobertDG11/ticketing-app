import { useState } from 'react';
import Router from 'next/router';

import useRequest from '../../hooks/use-request';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push('/'),
  });

  const onSubmit = (event) => {
    event.preventDefault();

    doRequest();
  };

  return (
    <div className="container">
      <form
        className="d-flex flex-column align-items-center mt-5"
        onSubmit={onSubmit}
      >
        <h1>Sign Up</h1>
        <div className="form-group w-50 center">
          <label>Email Address</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group w-50">
          <label>Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="form-control"
          />
        </div>
        {errors}
        <button className="btn btn-primary">Sign Up</button>
      </form>
    </div>
  );
};

export default SignupPage;
