import { ReactNode } from 'react'
import { Route } from 'react-router-dom'
import * as R from 'ramda'

export type MenuInfo = {
  title: string
  path: string
  authkey?: string
  page?: ReactNode
  children?: MenuInfo[]
  icon?: ReactNode
  logo?: string
  hidden?: boolean
}

const toMenuRoute = ({ path, page }: MenuInfo) => {
  return page ? <Route key={path} path={path} element={page} /> : <Route key={path} path={path} element='' />
}

export const getMenuRoutes = (menus?: MenuInfo[]): JSX.Element[] => {
  const nestedRoutes =
    menus?.map((menu) => [
      toMenuRoute(menu),
      ...getMenuRoutes(menu.children),
    ]) ?? []

  return R.flatten(nestedRoutes).filter((v): v is JSX.Element => !!v)
}
