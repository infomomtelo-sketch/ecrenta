/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
}

import { template as contactConfirmation } from './contact-confirmation.tsx'
import { template as formSignRequest } from './form-sign-request.tsx'
import { template as formSignedCopy } from './form-signed-copy.tsx'
import { template as invoiceReminder } from './invoice-reminder.tsx'
import { template as newChatMessage } from './new-chat-message.tsx'
import { template as internalNotification } from './internal-notification.tsx'
import { template as tenantInvite } from './tenant-invite.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'contact-confirmation': contactConfirmation,
  'form-sign-request': formSignRequest,
  'form-signed-copy': formSignedCopy,
  'invoice-reminder': invoiceReminder,
  'new-chat-message': newChatMessage,
  'internal-notification': internalNotification,
  'tenant-invite': tenantInvite,
}
