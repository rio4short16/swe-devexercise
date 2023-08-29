import {
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    ExceptionFilter,
} from '@nestjs/common'
import { Response } from 'express'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const context = host.switchToHttp()
        const response = context.getResponse<Response>()
        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR

        response.status(status).json({
            status:
                status ||
                exception?.response?.status ||
                HttpStatus.INTERNAL_SERVER_ERROR,
            errorName: exception.name,
            message: exception?.response?.message || exception?.message,
            errorCode: exception?.response?.errorCode,
        })
    }
}
