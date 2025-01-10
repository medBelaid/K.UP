import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { EmailEntity } from './email.entity';
import { IEmail, EmailId } from './email.interfaces';

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(EmailEntity)
    private readonly emailRepository: Repository<EmailEntity>,
  ) {}

  /**
   * Récupère un email par rapport à un identifiant
   * @param id Identifiant de l'email à récupérer
   * @returns L'email correspondant à l'identifiant ou undefined
   */
  get(id: EmailId): Promise<IEmail> {
    return this.emailRepository.findOneBy({ id: Equal(id) });
  }
}
