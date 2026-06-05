/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Section, Text, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "myrental"

interface NewChatMessageProps {
  recipientName?: string
  senderName?: string
  senderRole?: string
  listingTitle?: string
  messageText?: string
  chatUrl?: string
}

const NewChatMessageEmail = ({
  recipientName,
  senderName = 'Someone',
  senderRole = 'tenant',
  listingTitle = 'your listing',
  messageText = '',
  chatUrl = 'https://myrental.space/inbox',
}: NewChatMessageProps) => {
  const preview = `${senderName}: ${messageText.slice(0, 80)}`
  const greeting = recipientName ? `Hi ${recipientName},` : 'Hi there,'
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={logo}>{SITE_NAME}</Heading>
          <Hr style={hr} />
          <Heading style={h1}>New message from {senderName}</Heading>
          <Text style={text}>
            {greeting} You have a new message about <strong>{listingTitle}</strong>.
          </Text>
          <Section style={quoteBox}>
            <Text style={quoteMeta}>
              {senderName} ({senderRole})
            </Text>
            <Text style={quoteText}>{messageText}</Text>
          </Section>
          <Section style={{ textAlign: 'center' as const, margin: '28px 0 8px' }}>
            <Button href={chatUrl} style={button}>
              Reply in chat
            </Button>
          </Section>
          <Text style={footer}>
            You're receiving this because someone messaged you on {SITE_NAME}.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: NewChatMessageEmail,
  subject: (data: Record<string, any>) =>
    `New message from ${data?.senderName || 'someone'}${
      data?.listingTitle ? ` about ${data.listingTitle}` : ''
    }`,
  displayName: 'New chat message notification',
  previewData: {
    recipientName: 'Alex',
    senderName: 'Jordan',
    senderRole: 'tenant',
    listingTitle: 'Sunny 2BR in Mission District',
    messageText: "Hi! Is this place still available? I'd love to schedule a viewing this weekend.",
    chatUrl: 'https://myrental.space/inbox',
  },
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
}
const container = {
  padding: '40px 24px',
  maxWidth: '520px',
  margin: '0 auto',
}
const logo = {
  fontSize: '20px',
  fontWeight: '800' as const,
  color: '#2d9659',
  fontFamily: "'Outfit', Arial, sans-serif",
  margin: '0 0 24px',
}
const hr = { borderColor: '#e8e2d9', margin: '0 0 28px' }
const h1 = {
  fontSize: '22px',
  fontWeight: '700' as const,
  color: '#1c2536',
  margin: '0 0 16px',
  fontFamily: "'Outfit', Arial, sans-serif",
}
const text = {
  fontSize: '15px',
  color: '#636872',
  lineHeight: '1.6',
  margin: '0 0 20px',
}
const quoteBox = {
  backgroundColor: '#f6f4ef',
  borderLeft: '3px solid #2d9659',
  borderRadius: '8px',
  padding: '16px 18px',
  margin: '8px 0 24px',
}
const quoteMeta = {
  fontSize: '12px',
  fontWeight: '600' as const,
  color: '#2d9659',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.04em',
  margin: '0 0 6px',
}
const quoteText = {
  fontSize: '15px',
  color: '#1c2536',
  lineHeight: '1.6',
  margin: 0,
  whiteSpace: 'pre-wrap' as const,
}
const button = {
  backgroundColor: '#2d9659',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: '700' as const,
  padding: '12px 28px',
  borderRadius: '999px',
  textDecoration: 'none',
  display: 'inline-block',
}
const footer = {
  fontSize: '12px',
  color: '#9ca3af',
  margin: '24px 0 0',
  textAlign: 'center' as const,
}
