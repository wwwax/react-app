import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from './main';

const TODOS = [
  {
    id: 1,
    title: 'red',
  },
  {
    id: 2,
    title: 'green',
  },
];

export const App = () => {
  const queryTodos = useQuery({
    queryKey: ['todos'],
    queryFn: () => wait(2000).then(() => [...TODOS]),
  });

  const mutationQuery = useMutation({
    mutationFn: (text) =>
      wait(1000).then(() => {
        TODOS.push({
          id: Date.now(),
          text,
        });
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['todos']);
    },
  });

  if (queryTodos.isLoading) return <h1>loading...</h1>;

  if (queryTodos.isError)
    return <pre>{JSON.stringify(queryTodos.error.message, null, 2)}</pre>;

  return (
    <div>
      {queryTodos.data.map((todo) => (
        <pre key={todo.id}>{JSON.stringify(todo, null, 2)}</pre>
      ))}
      <button onClick={() => mutationQuery.mutate('orange')}>add todo</button>
    </div>
  );
};

const wait = (duration) => {
  return new Promise((resolve) => setTimeout(resolve, duration));
};
