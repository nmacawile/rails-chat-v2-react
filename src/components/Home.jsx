import SearchForm from "./SearchForm";
import "../stylesheets/Home.css";

export function Home() {
  const chatMessages = [
    {
      message:
        "Quia velit officiis. Eum perferendis porro. Ut delectus assumenda.",
      id: 1,
    },
    {
      message: "Sit accusamus est. Non explicabo voluptate. Cumque qui non.",
      id: 1,
    },
    {
      message: "Blanditiis placeat sed. Eaque et vero. Recusandae vitae ea.",
      id: 1,
    },
    {
      message: "Optio ut molestiae. Ullam eos quo. Eligendi ducimus officia.",
      id: 2,
    },
    {
      message: "Quam maxime suscipit. Est neque illo. Ut nisi enim.",
      id: 1,
    },
    {
      message:
        "Accusamus laboriosam omnis. Consequuntur sunt dolorem. Dolor laborum autem.",
      id: 2,
    },
    {
      message:
        "Mollitia fugiat debitis. Sit vitae voluptates. Laboriosam omnis vel.",
      id: 2,
    },
    {
      message: "Aut non consequuntur. Illum porro est. Ratione dolore est.",
      id: 2,
    },
    {
      message:
        "Quibusdam quasi eos. Voluptatum soluta dicta. Ducimus cumque quos.",
      id: 2,
    },
    {
      message: "Mollitia odit in. Quia rerum error. Quam at soluta.",
      id: 1,
    },
    {
      message:
        "Impedit deleniti deserunt. Debitis blanditiis veritatis. Quis temporibus asperiores.",
      id: 2,
    },
    {
      message:
        "Esse iusto cupiditate. Recusandae est aut. Ullam laudantium vitae.",
      id: 1,
    },
    {
      message:
        "Qui aspernatur repudiandae. Perspiciatis modi perferendis. Inventore ex saepe.",
      id: 1,
    },
    {
      message: "Dolores quod nemo. Et mollitia non. Nulla dolorem repellendus.",
      id: 2,
    },
    {
      message:
        "Rem expedita aspernatur. Reiciendis suscipit quis. Illo nulla qui.",
      id: 2,
    },
    {
      message:
        "Voluptatum quia quia. Quis et error. Occaecati soluta assumenda.",
      id: 1,
    },
    {
      message: "Et omnis distinctio. Ut aut voluptas. Et molestias quam.",
      id: 1,
    },
    {
      message: "Delectus iusto fugit. Praesentium saepe aut. Et ratione est.",
      id: 2,
    },
    {
      message:
        "Laboriosam dolore qui. Ex vero perspiciatis. Laborum repellendus perferendis.",
      id: 1,
    },
    {
      message: "Cum non est. Qui nemo iusto. Iste ea explicabo.",
      id: 2,
    },
  ];

  const userList = () => {
    const list = [];
    for (let i = 0; i < 20; i++) {
      list.push(
        <li key={`k-${i}`} className={["flex", "p-2", "rounded-lg"].join(" ")}>
          <div>
            <div className="bg-purple-400 h-10 w-10 rounded-full"></div>
          </div>
          <span className="ms-2.5 leading-none text-white">
            FirstName LastName
          </span>
        </li>
      );
    }

    return list;
  };

  return (
    <div className="flex gap-4 flex-row w-full h-full">
      <aside className="flex flex-col overflow-hidden w-96 shrink-0 h-full bg-gray-900/[.8] rounded-lg ">
        <header className="p-4 border-b border-gray-400/[.8] space-y-2">
          <h2 className="text-xl font-bold text-white">Chats</h2>
          <SearchForm />
        </header>

        <section className="overflow-auto h-full p-4">
          <ul className="flex flex-col align-center gap-2">{userList()}</ul>
        </section>

        <footer className="flex flex-row p-4 border-t border-gray-400/[.8]">
          <div>
            <div className="bg-purple-400 h-10 w-10 rounded-full"></div>
          </div>
          <span className="ms-2.5 leading-none text-white">
            Authenticated User
          </span>
        </footer>
      </aside>

      <main className="flex flex-col w-full h-full bg-gray-900/[.8] rounded-lg overflow-hidden">
        <header className="flex flex-row gap-4 items-start p-4 border-b border-gray-400/[.8] space-y-2">
          <div>
            <div className="bg-purple-400 h-10 w-10 rounded-full"></div>
          </div>
          <h2 className="text-xl font-bold text-white leading-none">
            Other User
          </h2>
        </header>
        <section className="overflow-auto h-full p-4">
          <ul className="flex flex-col gap-1 justify-start">
            {chatMessages.map((m, i) => {
              return (
                <li
                  key={"chat-message-" + i}
                  className={[
                    `user-${m.id}`,
                    "max-w-[70%]",
                    m.id === 1 ? "message mine" : "message",
                  ].join(" ")}
                >
                  <p
                    className={[
                      "inline-block",
                      "py-2",
                      "px-4",
                      "bg-pink-800",
                      "text-white",
                    ].join(" ")}
                  >
                    {m.message}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>
        <footer className="flex flex-row p-4 border-t border-gray-400/[.8] h-24"></footer>
      </main>
    </div>
  );
}

export default Home;
