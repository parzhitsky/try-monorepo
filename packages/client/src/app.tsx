import { Suspense } from 'react'
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import { useSelector } from './store/store.js'
import { Home } from './modules/home/home.lazy.js'
import { PageNotFound } from './modules/page-not-found/page-not-found.lazy.js'
import { Loader } from './modules/common/loader/loader.js'

export const App: React.FC = () => {
  const isLoading = useSelector((state) => state.app.loading)

  if (isLoading) {
    return <Loader />
  }

  return (
    <BrowserRouter>
      <Container fluid>
        <Container>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path='/home' element={<Navigate to='/' />} />
              <Route path='/' element={<Home />} />
              {/* TODO: <Route path='/users/create-user' element={…} /> */}
              {/* TODO: <Route path={`/users/${user.alias}`} element={…} /> */}
              <Route path='*' element={<PageNotFound />} />
            </Routes>
          </Suspense>
        </Container>
      </Container>
    </BrowserRouter>
  )
}
