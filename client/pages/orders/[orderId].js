import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { useRouter } from 'next/router';

import useRequest from '../../hooks/use-request';

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const router = useRouter();
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: { orderId: order.id },
    onSuccess: () => router.push('/orders'),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft(); // Alttaki interval ilk çalışmaya 1sn sonra başlayacağı için bu satırı ekliyoruz.
    const timerId = setInterval(findTimeLeft, 1000);

    // Yukarıdaki interval sonsuza kadar çalışmasın diye..
    return () => {
      clearInterval(timerId);
    };
  }, []);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  return (
    <div>
      Timeleft to pay {timeLeft} seconds.
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51HRH9TJPKxGnaeCkJp5i9YzfZG1JMDeli8d0r3JRm4xgsXbIcxzwwFw5tkKCQxAOo4C1fhMFnVDYGNmLocZB1kuB007jOs3gak"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;

  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
