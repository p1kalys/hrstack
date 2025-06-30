import Navbar from '../components/Navbar'
import Header from '../components/Header'
import BlogList from '../components/BlogList'
import NewsLetter from '../components/NewsLetter'
import Footer from '../components/Footer'
import Feed from '../components/Feed'

const Home = () => {
  return (
    <>
      <Navbar />
      <Header />
      <BlogList />
      <NewsLetter />
      <Feed />
      <Footer />
    </>
  )
}

export default Home