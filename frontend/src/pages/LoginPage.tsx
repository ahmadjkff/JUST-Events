import Header from "../components/Header"
import Footer from "../components/Footer"
import LoginForm from "../components/LoginForm"
import "../styles/globals.css"


export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <LoginForm />
      <Footer />
    </div>
  )
}
