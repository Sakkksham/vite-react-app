import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../api";

export default function UserList() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data.map((user: { _id: string; name: string }) => (
        <li key={user._id}>{user.name}</li>
      ))}
    </ul>
  );
}
