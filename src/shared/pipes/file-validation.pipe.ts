import { validateFileFormat, validateFileSize } from '../utils/file.util'
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { ReadStream } from 'fs'

@Injectable()
export class FileValidationPipe implements PipeTransform {
	async transform(value: any, metadata: ArgumentMetadata) {
		if (!value.filename) {
			throw new BadRequestException('Файл не загружен')
		}

		const { filename, createReadStream } = value

		const fileStream = createReadStream() as ReadStream

		const allowedFormats = ['jpg', 'jpeg', 'pgn', 'webp', 'gif']
		const isFileFormatValid = validateFileFormat(filename, allowedFormats)

		if (!isFileFormatValid) {
			throw new BadRequestException('Неподдерживаемый формат файла')
		}

		const isFileSizeValid = await validateFileSize(fileStream, 10 * 1024 * 1024)

		if (!isFileSizeValid) {
			throw new BadRequestException('Размер файла превышаем 10 МБ')
		}

		return value
	}
}
