<script>
  import axios from "axios";

  import { Router, Route, Link } from "svelte-routing";
  import Home from "./lib/Home.svelte";
  import Some from "./lib/Some.svelte";
  import Join from "./lib/Join.svelte";

  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = import.meta.env.VITE_AXIOS_BASE_URL_DEV;
  //adjust axios baseURL depending on envirionment
  if (import.meta.env.MODE === "production") {
    axios.defaults.baseURL = import.meta.env.VITE_AXIOS_BASE_URL_PROD;
  }

  export let url = "{url}";
</script>

<!-- <Router>
  <Route component={Home} />
  <Route component={Some} />
  <Route path="/join/:id" let:params>
    <Join id={params.id} />
  </Route>
</Router> -->

<Router {url}>
  <nav>
    <Link to="/">Home</Link>
    <Link to="/some">some</Link>
    <Link to="/join">join game link</Link>
  </nav>
  <div>
    <Route path="/"><Home /></Route>
    <Route path="/join/:id" let:params={id}>
      <Join {id} />
    </Route>
    <Route path="/some" component={Some} />
  </div>
</Router>
