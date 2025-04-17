import { Prisma, PrismaClient } from '../../../prisma/generated'
import { BadRequestException, Logger } from '@nestjs/common'
import { hash } from 'argon2'

const prisma = new PrismaClient({
	transactionOptions: {
		maxWait: 5000,
		timeout: 10000,
		isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
	},
})

async function seed() {
	try {
		Logger.log('Начало заполнения базы данных')

		await prisma.$transaction([prisma.user.deleteMany(), prisma.category.deleteMany()])

		const categoriesData = [
			{
				title: 'Dota 2',
				slug: 'dota-2',
				description:
					'Погрузитесь в мир Dota 2, захватывающей стратегии, где команды сражаются за победу. Присоединяйтесь к стримам лучших игроков, изучайте тактики и стратегии, обсуждайте актуальные обновления и создавайте свои команды.',
				thumbnailUrl: '/categories/dota2.webp',
			},
			{
				title: 'Minecraft',
				slug: 'minecraft',
				description:
					'Откройте свои самые смелые мечты в Minecraft, игре, где вы можете строить и исследовать бесконечные миры. Стримы по строительству, выживанию, созданию модов и много другое — присоединяйтесь к креативному сообществу.',
				thumbnailUrl: '/categories/minecraft.webp',
			},
			{
				title: 'Программирование',
				slug: 'programming',
				description:
					'Погружайтесь в мир технологий на стримах по программированию. Учитесь создавать приложения, разрабатывать игры и погружайтесь в алгоритмы с профессиональными программистами и энтузиастами.',
				thumbnailUrl: '/categories/programming.webp',
			},
			{
				title: 'IRL',
				slug: 'irl',
				description:
					'Присоединяйтесь к стримам из реальной жизни — путешествия, события и ежедневные моменты. Открывайте уникальные истории и переживания, общайтесь с ведущими и не забывайте о настоящем.',
				thumbnailUrl: '/categories/irl.webp',
			},
			{
				title: 'Rust',
				slug: 'rust',
				description:
					'Погружайтесь в мир Rust, многопользовательской игры на выживание, где вас ожидают сражения, строительство и социальные взаимодействия. Следите за тем, как игроки борются за выживание в жестоком мире.',
				thumbnailUrl: '/categories/rust.webp',
			},
			{
				title: 'Counter-Strike 2',
				slug: 'cs2',
				description:
					'Участвуйте в захватывающих матчах Counter-Strike 2, где команды сражаются на высоком уровне. Анализируйте стратегические ходы, изучайте тактики и наслаждайтесь играми с такими же фанатами, как и вы.',
				thumbnailUrl: '/categories/cs2.webp',
			},
			{
				title: 'Grand Theft Auto V',
				slug: 'gta-v',
				description:
					'Погружайтесь в грандиозный и открытый мир Grand Theft Auto V, где приключения не имеют границ. Исследуйте истории, миссии, гонки и взаимодействуйте с другими игроками в этом захватывающем мире криминала.',
				thumbnailUrl: '/categories/gta-v.webp',
			},
			{
				title: 'League of Legends',
				slug: 'league-of-legends',
				description:
					'Участвуйте в эпических битвах в League of Legends, стратегической игре, где каждая игра уникальна. Следите за профессиональными матчаем, изучайте роли персонажей и делитесь своими победами с сообществом.',
				thumbnailUrl: '/categories/league-of-legends.webp',
			},
			{
				title: 'Общение',
				slug: 'chatting',
				description:
					'Присоединяйтесь к увлекательным стримам общения, где стримеры и зрители могут обсудить любые темы — от повседневной жизни до глубоких философских размышлений. Погружайтесь в разговоры и создавайте новые связи.',
				thumbnailUrl: '/categories/chatting.webp',
			},
			{
				title: 'Обучение',
				slug: 'learning',
				description:
					'Узнайте что-то новое с образовательными стримами, охватывающими широкий спектр тем — от искусства до науки и технологий. Познавайте мир вместе с опытными преподавателями и вдохновляйтесь к обучению.',
				thumbnailUrl: '/categories/learning.webp',
			},
			{
				title: 'Red Dead Redemption 2',
				slug: 'rdr2',
				description:
					'Погружайтесь в историческую атмосферу Дикого Запада в Red Dead Redemption 2. Исследуйте захватывающий сюжет, охотьтесь и взаимодействуйте с другими персонажами в этом великолепном открытом мире.',
				thumbnailUrl: '/categories/rdr2.webp',
			},
		]

		await prisma.category.createMany({
			data: categoriesData,
		})

		Logger.log('Категории успешно созданы')

		const categories = await prisma.category.findMany()

		const categoriesBySlug = Object.fromEntries(categories.map(category => [category.slug, category]))

		const streamTitles = {
			'dota-2': [
				'Финал Dota 2: Битва за The Aegis',
				'Секреты успешной игры за инвокера',
				'Как сделать команду непобедимой',
				'Лучшие моменты из Dota 2 турнира',
				'Обзор патча: что нового в Dota 2',
			],
			minecraft: [
				'Строительство небоскреба в Minecraft',
				'Исследуем новые биомы в Minecraft',
				'Пережившие зомби-апокалипсис: моды для Minecraft',
				'Как построить секретный дом в Minecraft',
				'Крафт лучших инструментов: пошаговое руководство',
			],
			programming: [
				'Создаем своё первое приложение на JavaScript',
				'Алгоритмы для начинающих: учимся с нуля',
				'Разработка игр на Unity: основы',
				'Оптимизация кода: улучшение производительности',
				'Как стать программистом: советы и лайфхаки',
			],
			irl: [
				'Путешествие по красивым местам: обзор',
				'Встреча с подписчиками в реальной жизни',
				'День из жизни стримера: как все устроено',
				'Обсуждение актуальных тем: стрим в IRL',
				'Кулинарный стрим: готовим вместе!',
			],
			rust: [
				'Выживание в Rust: первые шаги',
				'Создаем мощную базу в Rust',
				'Тактики PvP боев в Rust',
				'Обзор обновлений Rust: что нового?',
				'Необычные случаи в Rust: истории игроков',
			],
			'league-of-legends': [
				'Эпическая битва за барона',
				'Турнир по Лиге Легенд: Finals',
				'Мифы и легенды Лиги Легенд',
				'Лига Легенд: Тактика для победы',
				'Секреты успешного гейминга в ЛОЛ',
			],
			chatting: [
				'Обсуждаем последние новости',
				'Чат с подписчиками: ваши вопросы — наши ответы',
				'День из жизни стримера',
				'Философские размышления о жизни',
				'Как завести новых друзей в интернете',
			],
			learning: [
				'Изучаем основы программирования',
				'Как рисовать: уроки от художника',
				'Научные эксперименты для школьников',
				'Математика без страха: лайфхаки',
				'История искусства: от древности до современности',
			],
			rdr2: [
				'Приключения в Диком Западе: прогулки по миру',
				'Охота на древнего динозавра',
				'Банды Ред Дед Редемпшн 2: стратегии победы',
				'Как стать мастером стрельбы',
				'Загадки и мифы Ред Дед Редемпшн 2',
			],
			'gta-v': [
				'Эпичные ограбления: как заработать миллионы в GTA V',
				'Секреты успешного PvP в GTA Online',
				'Крутые гонки на суперкарах: как стать чемпионом',
				'Исследуем потайные места: загадки и рекомендации в GTA V',
				'Смешные моменты и фэйлы: самые забавные стримы по GTA V',
			],
			cs2: [
				'Стратегии выигрыша: как стать мастером в CS 2',
				'Обзор новых режимов и карт в CS 2',
				'Эпичные дуэли: лучшие перестрелки в CS 2',
				'День из жизни киберспортсмена: тренировки в CS 2',
				'Советы по прокачке скилов: как повысить уровень игры в CS 2',
			],
		}

		const usernames = [
			'Alexey1985',
			'DianaStar',
			'VladChampion',
			'Maria2025',
			'YuriCool',
			'LenaSunny',
			'PavelWriter',
			'OksanaMagic',
			'IgorKing',
			'TatianaMoon',
			'AntonHero',
			'OlgaDream',
			'SergeyRock',
			'AnnaBrave',
			'AndreyArt',
			'NatalieJoy',
			'MishaPenn',
			'SvetlanaLove',
			'DmitryFire',
			'ElenaHeart',
			'RomanLight',
			'VictoriaPeace',
			'NikitaRiver',
			'VeronikaBloom',
			'KirillWave',
			'AlinaSpark',
			'BorisSteel',
			'IrinaDreamer',
			'OlegVision',
			'TamaraSky',
			'MarkHorizon',
			'KseniaStarlet',
			'MaximJourney',
			'EkaterinaSerene',
			'FedorMerry',
			'SofiaWisdom',
			'DenisEagle',
			'ValentinaBliss',
			'KonstantinSage',
			'IrinaElegance',
			'ArtemLegend',
			'GalinaGrace',
			'StanislavJustice',
			'MarinaGenius',
			'NinaLovely',
			'IgorThunder',
			'NataliaDawn',
			'EgorPioneer',
			'LyudmilaJoyful',
			'VladislavSpirit',
			'ZhannaNoble',
			'VadimProtector',
			'JuliaHarmony',
			'NikolayPhoenix',
			'AlyonaGraceful',
		]

		await prisma.$transaction(async tx => {
			for (const username of usernames) {
				const randomCategory =
					categoriesBySlug[
						Object.keys(categoriesBySlug)[Math.floor(Math.random() * Object.keys(categoriesBySlug).length)]
					]

				const randomTitles = streamTitles[randomCategory.slug]

				// const userExists = await tx.user.findUnique({
				//   where: {
				//     username
				//   }
				// })

				// if (userExists) {
				//   continue
				// }

				const createdUser = await tx.user.create({
					data: {
						email: `${username}@proton.me`,
						password: await hash('12345678'),
						username,
						avatar: `/channels/${username}.webp`,
						isEmailVerified: true,
						socialLinks: {
							createMany: {
								data: [
									{
										title: 'Telegram',
										url: `https://t.me/${username}`,
										position: 1,
									},
									{
										title: 'YouTube',
										url: `https://youtube.com/@${username}`,
										position: 2,
									},
								],
							},
						},
						notificationSettings: {
							create: {},
						},
					},
				})

				const randomTitle = randomTitles[Math.floor(Math.random() * randomTitles.length)]

				await tx.stream.create({
					data: {
						title: randomTitle,
						thumbnailUrl: `/streams/${username}.webp`,
						user: {
							connect: {
								id: createdUser.id,
							},
						},
						categories: {
							connect: {
								id: randomCategory.id,
							},
						},
					},
				})

				Logger.log(`Пользователь ${username} и его стрим успешно созданы`)
			}
		})

		Logger.log('Заполнение базы данных прошло успешно')
	} catch (e) {
		Logger.log(e)
		throw new BadRequestException('Ошибка при заполнении базы данных')
	} finally {
		Logger.log('Закрытие соединения с бд....')
		await prisma.$disconnect()
		Logger.log('Соединение с бд успешно закрыто')
	}
}

seed()
