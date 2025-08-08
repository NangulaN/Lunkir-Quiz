import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.scss'
import './components/Quiz/Quiz.scss'
// import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import QuizPage from './pages/QuizPage'
import About from './pages/About'
import Home from './pages/Home'
import LeaderboardPage from './pages/LeaderboardPage'
import AdminPanel from './pages/AdminPanel'
import NotFound from './pages/NotFound'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: 'quiz',
    element: <QuizPage />
  },
  {
    path: '/leaderboard',
    element: <LeaderboardPage />
  },
  {
    path: '/admin',
    element: <AdminPanel />
  },
  {
    path: '*',
    element: <NotFound />
  },
])

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}/>,
)

  // <StrictMode>
    // <RouterProvider router={router}/>,
    {/* //* <App /> */} 
  {/* </StrictMode>,  */}