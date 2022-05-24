export declare interface IResponse<T> {
  data: T;
  loading: boolean;
  error: Error | null;
}
