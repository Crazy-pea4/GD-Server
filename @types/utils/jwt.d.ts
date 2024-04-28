export default interface JWT {
  sign: (value: string) => string;
  verify: (token: string) => any;
}
