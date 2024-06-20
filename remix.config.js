/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/.*"],
  serverDependenciesToBundle: [
    /^remix-utils.*/,
    'cache-control-parser'
  ]
};
