// this is a private route component that will be used to protect routes that require authentication
export default function PrivateRoute({ component: Component, ...rest }) {

  const { currentUser } = useAuth();
  return (
    <Route
      {...rest}
      render={props => {
        return currentUser ? <Component {...props} /> : <Redirect to="/" />
      }}
    ></Route>
  )
}