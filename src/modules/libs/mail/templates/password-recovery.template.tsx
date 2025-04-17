import { Body, Head, Heading, Link, Preview, Section, Tailwind, Text } from '@react-email/components'
import { Html } from '@react-email/html'
import { SessionMetadata } from '@/src/shared/types/session-metadata.types'
import * as React from 'react'

interface PasswordRecoveryTemplateProps {
  domain: string
  token: string
  metadata: SessionMetadata
}

export function PasswordRecoveryTemplate({ domain, token, metadata }: PasswordRecoveryTemplateProps) {
  const resetLink = `${domain}/account/recovery${token}`

  return (
    <Html>
    <Head/>
    <Preview>Сброс Пароля</Preview>
    <Tailwind>
      <Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
        <Section className='text-center mb-8'>
          <Heading className='text-3xl text-black font-bold'>Сброс пароля</Heading>
          <Text className='text-base text-black'>
            Вы запросили сброс пароля для вашей учетной записи.
            Чтобы создать новый пароль, перейдите по ссылке ниже:
          </Text>
          <Link href={resetLink} className='inline-flex justify-center items-center rounded-full text-sm font-medium text-white bg-[#18b9ae] px-5 py-2'>Сбросить пароль</Link>
        </Section>
        <Section className='bg-gray-100 rounded-lg p-6 mb-6'>
          <Heading className='text-xl font-semibold text-[#18b9ae]'>Информация о запросе:</Heading>
          <ul className='list-disc list-inside mt-2 text-black'>
            <li>Расположение: {metadata.location.country}, {metadata.location.city}</li>
            <li>Операционная система: {metadata.device.os}</li>
            <li>Браузер: {metadata.device.browser}</li>
            <li>IP-адрес: {metadata.ip}</li>
          </ul>
          <Text className='text-gray-600 mt-2'>Если вы не инициировали этот запрос, пожалуйста игнорируйте это сообщение.</Text>
        </Section>
        <Section className='text-center mt-8'>
          <Text className='text-gray-600'>
            Если у вас есть вопросы или вы столкнулись с трудностями, не стесняйтесь обращаться в нашу поддержку по адресу {' '} <Link href='mailto:nothing@proton.me' className='text-[#18b9ae] underline'>ee@net.com</Link>
          </Text>
        </Section>
      </Body>
    </Tailwind>
  </Html>
  )
}