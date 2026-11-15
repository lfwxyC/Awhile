import HomePage from "./pages/HomePage.tsx";
import {Route, Routes} from "react-router";
import EditPage from "./pages/EditPage.tsx";
import RecordsPage from "./pages/RecordsPage.tsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/records/new" element={<EditPage />} />
            <Route path="/records" element={<RecordsPage />} />
            <Route path="/records/:id" element={<EditPage />} />
        </Routes>
    )
}

export default App
