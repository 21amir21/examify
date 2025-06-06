declare module "*.css";

declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

// for feature use of SCSS
declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}
