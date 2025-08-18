import { type RouteConfig, index , route} from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route('/auth', 'routes/auth.tsx'),
    route('/uploads', 'routes/uploads.tsx'),
     route('/resume/:id', 'routes/resume.tsx'),
] satisfies RouteConfig;
