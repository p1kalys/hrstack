import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import ViewBlog from "./pages/Blog"
import Dashboard from "./pages/admin/Dashboard"
import ListofBlogs from "./pages/admin/ListofBlogs"
import AddBlog from "./pages/admin/AddBlog"
import Comments from "./pages/admin/Comments"
import Layout from "./pages/admin/Layout"
import LogIn from "./components/LogIn"
import 'quill/dist/quill.snow.css'
import { Toaster } from "react-hot-toast"
import { useAppContext } from "./context/AppContext"

const App = () => {
  const {token} = useAppContext();
  return (
    <div>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog/:id" element={<ViewBlog />} />
        <Route path="/profile" element={token !== null ? <Layout />: <LogIn />}>
          <Route index element={<Dashboard />} />
          <Route path='addBlog' element={<AddBlog />} />
          <Route path="blogsVault" element={<ListofBlogs />} />
          <Route path="comments" element={<Comments />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App