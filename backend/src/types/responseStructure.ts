export default interface IResponseStructure {
  statusCode: number;
  success: boolean;
  message: string;
  data?: any;
}
