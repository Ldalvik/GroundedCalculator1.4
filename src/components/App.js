import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './HomePage'

const App = () => {
  return (
    <HomePage />
    // <BrowserRouter>
    //   <Routes>
    //     <Route exact path="/" element={<HomePage />} />
    //     <Route exact path="*" element={<UnknownPage />} />
    //   </Routes>
    // </BrowserRouter>
  )
}

export default App