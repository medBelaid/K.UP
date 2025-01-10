import { Mutation } from '@nestjs/graphql';
import { EmailService } from './email.service';
import {
  Args,
  ID,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { EmailFiltersArgs, UserEmail } from './email.types';
import { User } from '../user/user.types';
import { Equal, FindOptionsWhere, In, Repository } from 'typeorm';
import { EmailEntity } from './email.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';

@Resolver(() => UserEmail)
export class EmailResolver {
  constructor(
    private readonly _service: EmailService,
    @InjectRepository(EmailEntity)
    private readonly emailRepository: Repository<EmailEntity>,
    private usersService: UserService,
  ) {}
  @Query(() => UserEmail, { name: 'email' })
  getEmail(@Args({ name: 'emailId', type: () => ID }) emailId: string) {
    // TODO IMPLEMENTATION
    // Récupérer une adresse email par rapport à son identifiant
    return this._service.get(emailId);
  }

  @Query(() => [UserEmail], { name: 'emailsList' })
  async getEmails(@Args() filters: EmailFiltersArgs): Promise<UserEmail[]> {
    // TODO IMPLEMENTATION
    // Récupérer une liste d'e-mails correspondants à des filtres
    // Je pense qu'on pourrait essayer de refactoriser pour réutiliser
    // la même chose que dans UserResolver pour récupérer les emails
    const where: FindOptionsWhere<EmailEntity>[] = [];

    if (filters.address) {
      if (filters.address.equal) {
        where.push({
          address: Equal(filters.address.equal),
        });
      }

      if (filters.address.in?.length > 0) {
        where.push({
          address: In(filters.address.in),
        });
      }
    }

    return this.emailRepository.find({ where });
  }

  @ResolveField(() => User, { name: 'user' })
  async getUser(@Parent() parent: UserEmail): Promise<User> {
    // TODO IMPLEMENTATION
    // Récupérer l'utilisateur à qui appartient l'email
    return this.usersService.get(parent.userId);
  }
}
