import * as React from "react";
import heroImg from "./assets/hero.png";
import { ODATA_SERVICE } from "./app-constant";

function App() {
  const [count, setCount] = React.useState(0);
  const [data, setData] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch(`${ODATA_SERVICE.ATTACHMENT}/Attachments`)
      .then((res) => res.json())
      .then((data) => setData(JSON.stringify(data, null, 2)))
      .catch((err) => setData(`Error: ${err.message}`));
  }, []);

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
          <p>
            Cho anh em nào thắc mắc thì đây là React và được... deploy lên hệ
            thống SAP của trường :)))
          </p>
        </div>
        <button
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <h2 className="text-red-500">Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
      <p>{data}</p>
    </>
  );
}

export default App;
