export default async function (req) {
  const result = await Promise.resolve('Hello, World!');
  return result;
}
