import { Route, Routes } from "react-router";
import LoginPage from "./pages/LoginPage.jsx";
import ChatListPage from "./pages/ChatListPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/chatlist" element={<ChatListPage />} />
    </Routes>
  );
}
