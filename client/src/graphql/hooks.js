import { useMutation, useQuery, useSubscription } from '@apollo/client';
import { getAccessToken } from '../auth';
import {
  ADD_MESSAGE_MUTATION,
  MESSAGES_ADDED_SUBSCRITION,
  MESSAGES_QUERY,
} from './queries';

export function useAddMessage() {
  const [mutate] = useMutation(ADD_MESSAGE_MUTATION);
  return {
    addMessage: async (text) => {
      const {
        data: { message },
      } = await mutate({
        variables: { input: { text } },
        context: {
          headers: { Authorization: 'Bearer ' + getAccessToken() },
        },
        update: (cache, { data: { message } }) => {
          cache.updateQuery({ query: MESSAGES_QUERY }, ({ messages }) => {
            const newdata = {
              messages: [...messages, message],
            };
            return newdata;
          });
        },
      });
      return message;
    },
  };
}

export function useMessages() {
  const { data } = useQuery(MESSAGES_QUERY, {
    context: {
      headers: { Authorization: 'Bearer ' + getAccessToken() },
    },
  });

  useSubscription(MESSAGES_ADDED_SUBSCRITION, {
    onSubscriptionData: ({ subscriptionData }) => {
      console.log(subscriptionData);
    },
  });
  return {
    messages: data?.messages ?? [],
  };
}
