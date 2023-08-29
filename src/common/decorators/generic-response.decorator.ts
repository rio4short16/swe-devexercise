import { TransformResponseInterceptor } from '@common/interceptors/transform-reponse.interceptor';
import { UseInterceptors } from '@nestjs/common';

export function GenericResponse() {
  return UseInterceptors(new TransformResponseInterceptor());
}
