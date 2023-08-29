export class GenericResponseDto<T> {
  readonly message?: string;
  readonly data: T;
}
