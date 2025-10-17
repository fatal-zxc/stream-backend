import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

@Injectable()
export class CryptoService {
	private readonly algorithm = 'aes-256-gcm';
  private readonly key: Buffer;

  constructor(private configService: ConfigService) {
    this.key = Buffer.from(configService.get<string>('ENCRYPTION_KEY'), 'hex');
  }

  async encrypt(plaintext: string): Promise<string> {
    const iv = randomBytes(12)
    const cipher = createCipheriv(this.algorithm, this.key, iv)
    const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
    const authTag = cipher.getAuthTag()
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`
  }

  async decrypt(ciphertext: string): Promise<string> {
    const [ivHex, authTagHex, encryptedHex] = ciphertext.split(':')
    const iv = Buffer.from(ivHex, 'hex')
    const authTag = Buffer.from(authTagHex, 'hex')
    const encrypted = Buffer.from(encryptedHex, 'hex')
    const decipher = createDecipheriv(this.algorithm, this.key, iv)
    decipher.setAuthTag(authTag)
    return decipher.update(encrypted, null, 'utf8') + decipher.final('utf8')
  }
}
