import { Body, Head, Heading, Link, Preview, Section, Tailwind, Text } from '@react-email/components'
import { Html } from '@react-email/html'
import * as React from 'react'

interface VerifyChannelTemplateTemplateProps {}

export function VerifyChannelTemplate({ }: VerifyChannelTemplateTemplateProps) {
  return (
    <Html>
    <Head/>
    <Preview>Ваш канал верифицирован</Preview>
    <Tailwind>
      <Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
        <Section className='text-center mb-8'>
          <Heading className='text-3xl text-black font-bold'>Поздравляем! Ваш канал верифицирован</Heading>
          <Text className='text-base text-black'>
            Значок верификации подтверждает подлинность вашего аккаунта и повышает доверие зрителей
          </Text>
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