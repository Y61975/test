import {
  useParams,
  useSearchParams,
  useLocation,
  useNavigate,
} from "react-router-dom";
function WithRoute(MyComponent) {
  function NewComponent(props) {
    let params = useParams();
    let search = useSearchParams();
    let location = useLocation();
    let navigate = useNavigate();
    let active = 0;
    switch (location.pathname) {
      case "/index/home":
        active = 0;
        break;
      case "/index/catego":
        active = 1;
        break;
      case "/index/car":
        active = 2;
        break;
      case "/index/mine":
        active = 3;
        break;
      default:
        active = 0;
    }
    return (
      <MyComponent
        router={{ params, search, location, navigate }}
        {...props}
        active={active}
      ></MyComponent>
    );
  }
  return NewComponent;
}

export default WithRoute;
