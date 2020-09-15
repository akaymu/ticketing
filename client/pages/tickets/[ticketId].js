import useRequest from '../../hooks/use-request';
import { useRouter } from 'next/router';

const TicketShow = ({ ticket }) => {
  const router = useRouter();
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) =>
      router.push('/orders/[orderId]', `/orders/${order.id}`),
  });

  return (
    <div>
      <div
        className="card"
        style={{ margin: '2rem', backgroundColor: '#fafafa' }}
      >
        <div className="card-body">
          <h5 className="card-title">{ticket.title}</h5>
          <p className="card-text">
            Price: $ {parseFloat(ticket.price).toFixed(2)}
          </p>
          <button onClick={() => doRequest()} className="btn btn-primary">
            Purchase
          </button>
        </div>
      </div>
      {errors}
    </div>
  );
};

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;

  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket: data };
};

export default TicketShow;
