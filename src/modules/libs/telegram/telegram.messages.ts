import { SponsorshipPlan, User } from '@/prisma/generated'
import { SessionMetadata } from '@/src/shared/types/session-metadata.types'

export const MESSAGES = {
	welcome:
		`<b>Добро пожаловать в FatalStream Bot!</b>\n\n` +
		`Чтобы получать уведомления и улучшить ваш опыт использования платформы, давайте свяжем ваш Telegram аккаунт с FatalStream.` +
		`Нажмите на кнопку ниже и перейдите в раздел <b>Уведомления</b>, чтобы завершить настройку.`,
	authSucces: `Вы успешно авторизовались и Telegram аккаунт связан с FatalStream!\n\n`,
	invalidToken: `Недействительный или просроченный токен.`,
	profile: (user: User, followersCount: number) =>
		`<b>Профиль пользователя:</b>\n\n` +
		`Имя пользователя: <b>${user.username}</b>\n` +
		`Email: <b>${user.email}</b>\n` +
		`Количество подписчиков: <b>${followersCount}</b>\n` +
		`О себе: <b>${user.bio || 'не указано'}</b>\n` +
		`Нажмите на кнопку ниже, чтобы перейти к настройкам профиля.`,
	follows: (following: User) => `<a href="https://fatal-stream.online/${following.username}">${following.username}</a>`,
	noFollows: `<b>У вас нет активных подписок</b>`,
	followsHeader: `<b>Каналы на которые вы подписаны:</b>\n\n`,
	resetPassword: (token: string, metadata: SessionMetadata) =>
		`<b>Сброс пароля</b>\n\n` +
		`Вы запросили сброс пароля для вашей учетной записи на платформе <b>FatalStream</b>.\n\n` +
		`Чтобы создать новый пароль, пожалуйста, перейдите по следующей ссылке:\n\n` +
		`<b><a href="https://fatal-stream.online/account/recovery/${token}">Сбросить пароль</a></b>\n\n` +
		`<b>Дата запроса:</b> ${new Date().toLocaleDateString()} в ${new Date().toLocaleTimeString()}\n\n` +
		`<b>Информация о запросе:</b>\n\n` +
		`<b>Расположение:</b> ${metadata.location.country}, ${metadata.location.city}\n` +
		`<b>Операционная система:</b> ${metadata.device.os}\n` +
		`<b>Браузер:</b> ${metadata.device.browser}\n` +
		`<b>IP-адрес:</b> ${metadata.ip}\n` +
		`Если вы не инициировали сброс пароля, просто проигнорируйте это сообщение.\n\n` +
		`Спасибо за использование <b>FatalStream</b>!`,
	deactivate: (token: string, metadata: SessionMetadata) =>
		`<b>Запрос на деактивацию аккаунта</b>\n\n` +
		`Вы инициировали процесс деактивации вашего аккаунта на платформе <b>FatalStream</b>.\n\n` +
		`Для завершения операции, пожалуйста, подтвердите свой запрос, введя следующий код подтверждения:\n\n` +
		`<b>Код подтверждения: ${token}</b>\n\n` +
		`<b>Дата запроса:</b> ${new Date().toLocaleDateString()} в ${new Date().toLocaleTimeString()}\n\n` +
		`<b>Информация о запросе:</b>\n\n` +
		`<b>Расположение:</b> ${metadata.location.country}, ${metadata.location.city}\n` +
		`<b>Операционная система:</b> ${metadata.device.os}\n` +
		`<b>Браузер:</b> ${metadata.device.browser}\n` +
		`<b>IP-адрес:</b> ${metadata.ip}\n` +
		`<b>Что произойдет после деактивации?</b>\n\n` +
		`1. Вы автоматически выйдете из системы и потеряете доступ к аккаунту.\n` +
		`2. Если вы не отмените деактивацию в течении 7 дней, ваш аккаунт будет <b>безвозвратно удален</b> со всей вашей информацией, данными и подписками.\n\n` +
		`<b>Обратите внимание:</b> Если в течение 7 дней вы передумаете, вы можете обратиться в нашу поддержку для восстановления доступа к вашему аккаунту до момента его полного удаления.\n\n` +
		`После удаления аккаунта восстановить его будет невозможно, и все данные будут потеряны без возможности восстановления.\n\n` +
		`Если вы передумали, просто проигнорируйте это сообщение. Ваш аккаунт останется активным.\n\n` +
		`Спасибо, что пользуетесь <b>FatalStream</b>! Мы всегда будем рады видеть вас на нашей платформе и надеемся, что вы останетесь с нами.\n\n` +
		`С уважением,\n` +
		`Команда FatalStream`,
	accountDeleted:
		`<b>Ваш аккаунт был полностью удалён.</b>\n\n` +
		`Ваш аккаунт был полностью стерт из базы данных FatalStream. Все ваши данные и информация были удалены безвозвратно.\n\n` +
		`Вы больше не будете получать уведомления в Telegram и на почту.\n\n` +
		`Если вы захотите вернуться на платформу, вы можете зарегистрироваться по следующей ссылке:\n` +
		`<b><a href="https://fatal-stream.online/account/create">Зарегистрироваться на FatalStream</a></b>\n\n` +
		`Спасибо что были с нами! Мы всегда будем рады видеть вас на платформе.\n\n` +
		`С уважением,\n` +
		`Команда FatalStream`,
	streamStart: (channel: User) =>
		`<b>На канале ${channel.username} началась трансляция!</b>\n\n` +
		`Смотрите здесь: <a href="https://fatal-stream.online/${channel.username}">Перейти к трансляции</a>`,
	newFollower: (follower: User, followersCount: number) =>
		`<b>У вас новый подписчик!</b>\n\n` +
		`Это пользователь <a href="https://fatal-stream.online/${follower.username}">${follower.username}</a>\n\n` +
		`Итоговое количество подписчиков на вашем канале: ${followersCount}`,
	newSponsorship: (plan: SponsorshipPlan, sponsor: User) =>
		`<b>Новый спонсор!</b>\n\n` +
		`Вы получили новое спонсорство на план <b>${plan.title}</b>\n` +
		`Сумма: <b>${plan.price} ₽</b>\n` +
		`Спонсор: <a href="https://fatal-stream.online/${sponsor.username}">${sponsor.username}</a>\n` +
		`<b>Дата оформления:</b> ${new Date().toLocaleDateString()} в ${new Date().toLocaleTimeString()}\n` +
		`Благодорим вас за вашу работу и поддержку на платформе FatalStream!`,
	verifyChannel:
		`<b>Поздравляем! Ваш канал верифицирован</b>\n\n` +
		`Мы рады сообщить, что ваш канал теперь верифицирован, и вы получили официальный значок.\n\n` +
		`Значок верификации подтверждает подлинность вашего канала и повышает доверие зрителей.\n\n` +
		`Спасибо, что вы с нами и продолжаете развивать свой канал вместе с FatalStream!`,
}
