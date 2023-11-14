// TODO: Review menambahkan Link untuk ke detail page
import Link from "next/link";

// Membuat definition type untuk data yang akan di-parse
type Joke = {
  id: number;
  setup: string;
  delivery: string;
};

const fetchJokes = async () => {
  const response = await fetch("http://localhost:3001/jokes");
  const responseJson: Joke[] = await response.json();

  if (!response.ok) {
    throw new Error("Waduh Error ...");
  }

  return responseJson;
};

const DashboardJokePage = async () => {
  const jokes = await fetchJokes();

  return (
    <section>
      <h2 className="text-2xl font-semibold">Dashboard Page - Jokes</h2>

      <table className="mt-4">
        <thead>
          <tr>
            <th className="p-4">No</th>
            <th className="p-4">Setup</th>
            <th className="p-4">Delivery</th>
            {/* // TODO: Review menambahkan Link untuk ke detail page */}
            <th className="p-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {jokes.map((todo, idx) => (
            <tr key={todo.id}>
              <td>{idx + 1}</td>
              <td>{todo.setup}</td>
              <td>{todo.delivery}</td>
              {/* // TODO: Review menambahkan Link untuk ke detail page */}
              <td className="p-2">
                <Link
                  href={`/dashboard/jokes/${todo.id}`}
                  className="py-2 px-4 bg-blue-200 hover:bg-blue-400 hover:text-white transition-colors duration-300 rounded"
                >
                  Detail
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default DashboardJokePage;
