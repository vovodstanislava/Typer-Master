// Декларируем типы для импортов (чтоб при импорте png не выдавало ошибку)

declare module "*.png" {
  const content: any;
  export default content;
}
declare module "*.svg" {
  const content: any;
  export default content;
}

declare module "*.mp3" {
  const content: any;
  export default content;
}

declare module "*.wav" {
  const content: any;
  export default content;
}

declare module "*.json" {
  const content: any;
  export default content;
}

