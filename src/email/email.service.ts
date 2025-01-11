import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { EmailEntity } from './email.entity';
import { IEmail, EmailId } from './email.interfaces';
import { UserEmail } from './email.types';
import { isEmail } from 'class-validator';
import { UserService } from '../user/user.service';
import { Status } from '../user/user.interfaces';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(EmailEntity)
    private readonly emailRepository: Repository<EmailEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private usersService: UserService,
  ) {}

  /**
   * Récupère un email par rapport à un identifiant
   * @param id Identifiant de l'email à récupérer
   * @returns L'email correspondant à l'identifiant ou undefined
   */
  get(id: EmailId): Promise<IEmail> {
    return this.emailRepository.findOneBy({ id: Equal(id) });
  }

  /**
   * Ajoute un email à l'utlisateur
   * @param email email à ajouter à l'utlisateur
   * @returns L'emailId correspondant à l'email ajouté
   */

  async addEmailToUser(email: UserEmail): Promise<EmailId> {
    // Format email validation
    const error = await !isEmail(email.address);
    if (error) {
      throw new BadRequestException(
        'Une adresse e-mail doit être validée comme étant une adresse e-mail valide',
      );
    }

    const user = await this.usersService.get(email.userId);
    if (!user) {
      throw new NotFoundException("l'utilisateur n'est pas défini");
    }
    if (user?.status === Status.INACTIVE) {
      throw new BadRequestException(
        "L'utilisateur est inactif et ne peut pas être modifié.",
      );
    }
    // Vérifier si l'email existe déjà dans la liste des emails de l'utilisateur
    if (user.emails?.some((e) => e.id === email.id)) {
      throw new BadRequestException(
        "l'email existe déjà dans la liste des emails de l'utilisateur.",
      );
    }
    user.emails?.push(email);

    // save updated user
    await this.userRepository.save(user);
    return email.id;
  }

  /**
   * Supprime un email de l'utlisateur
   * @param emailId Identifiant de l'email à supprimer
   * @param userId Identifiant de l'utilisateur concerné de la supprission de l'email
   * @returns L'emailId correspondant à l'email supprimé
   */

  async deleteEmailFromUser(emailId: string, userId: string): Promise<EmailId> {
    const user = await this.usersService.get(userId);
    const savedEmail = await this.get(emailId);

    if (!user || !savedEmail) {
      throw new NotFoundException("l'utilisateur ou l'email n'est pas défini");
    }

    if (user?.status === Status.INACTIVE) {
      throw new BadRequestException(
        "L'utilisateur est inactif et ne peut pas être modifié.",
      );
    }

    const userEmails = await this.emailRepository.findBy({
      userId: Equal(userId),
    });

    // Trouver l'index de l'email à supprimer
    const index = userEmails?.findIndex((email) => email.id === emailId);

    // Si l'email n'est pas trouvé retourne une erreur
    if (index === -1) {
      throw new BadRequestException(
        "l'email n'existe pas dans la liste des emails de l'utilisateur.",
      );
    } else {
      user.emails?.splice(index, 1);
    }

    // save updated user
    await this.userRepository.save(user);
    return savedEmail.id;
  }
}
