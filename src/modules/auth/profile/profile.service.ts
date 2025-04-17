import { StorageService } from '../../libs/storage/storage.service'
import { ChangeProfileInfoInput } from './inputs/change-profile-info.input'
import { SocialLinkInput, SocialLinkOrderInput } from './inputs/social-link.input'
import { User } from '@/prisma/generated'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import { BadRequestException, Injectable } from '@nestjs/common'
import * as Upload from 'graphql-upload/Upload.js'
import * as sharp from 'sharp'

@Injectable()
export class ProfileService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly storageService: StorageService
	) {}

	async changeAvatar(user: User, file: Upload) {
		if (user.avatar) {
			await this.storageService.remove(user.avatar)
		}

		const chunks: Buffer[] = []

		for await (const chunk of file.createReadStream()) {
			chunks.push(chunk)
		}

		const buffer = Buffer.concat(chunks)

		const fileName = `/channels/${user.username}.webp`

		if (file.filename && file.filename.endWith('.gif')) {
			const processedBuffer = await sharp(buffer, { animated: true }).resize(512, 512).webp().toBuffer()

			await this.storageService.upload(processedBuffer, fileName, 'image/webp')
		} else {
			const processedBuffer = await sharp(buffer).resize(512, 512).webp().toBuffer()

			await this.storageService.upload(processedBuffer, fileName, 'image/webp')
		}

		await this.prismaService.user.update({
			where: {
				id: user.id,
			},
			data: {
				avatar: fileName,
			},
		})

		return true
	}

	async removeAvatar(user: User) {
		if (!user.avatar) {
			return false
		}

		await this.storageService.remove(user.avatar)

		await this.prismaService.user.update({
			where: {
				id: user.id,
			},
			data: {
				avatar: null,
			},
		})

		return true
	}

	async changeInfo(user: User, input: ChangeProfileInfoInput) {
		const { username, bio } = input

		const usernameExists = await this.prismaService.user.findUnique({
			where: {
				username,
			},
		})

		if (usernameExists && username !== user.username) {
			throw new BadRequestException('Это имя пользователя занято')
		}

		await this.prismaService.user.update({
			where: {
				id: user.id,
			},
			data: {
				username,
				bio,
			},
		})

		return true
	}

	async findSocialLinks(user: User) {
		const socialLinks = await this.prismaService.socialLink.findMany({
			where: {
				userId: user.id,
			},
			orderBy: {
				position: 'asc',
			},
		})

		return socialLinks
	}

	async createSocialLink(user: User, input: SocialLinkInput) {
		const { title, url } = input

		const lastSocialLink = await this.prismaService.socialLink.findFirst({
			where: {
				userId: user.id,
			},
			orderBy: {
				position: 'desc',
			},
		})

		const newPosition = lastSocialLink ? lastSocialLink.position + 1 : 1

		await this.prismaService.socialLink.create({
			data: {
				title,
				url,
				position: newPosition,
				user: {
					connect: {
						id: user.id,
					},
				},
			},
		})

		return true
	}

	async reorderSocialLinks(list: SocialLinkOrderInput[]) {
		if (!list.length) {
			return
		}

		const updatePromises = list.map(socialLink => {
			return this.prismaService.socialLink.update({
				where: {
					id: socialLink.id,
				},
				data: {
					position: socialLink.position,
				},
			})
		})

		await Promise.all(updatePromises)

		return true
	}

	async updateSocialLink(id: string, input: SocialLinkInput) {
		const { title, url } = input

		await this.prismaService.socialLink.update({
			where: {
				id,
			},
			data: {
				title,
				url,
			},
		})

		return true
	}

	async removeSocialLink(id: string) {
		await this.prismaService.socialLink.delete({
			where: {
				id,
			},
		})

		return true
	}
}
