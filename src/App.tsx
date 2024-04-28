import DropZone from "./DropZone";
import Notes from "./Notes";
import { ThemeProvider } from "./components/theme-provider";

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <DropZone />
        <hr />
        <Notes />
      </ThemeProvider>
    </>
  );
}

export default App;
