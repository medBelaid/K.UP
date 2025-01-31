import { ArgsType, Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsOptional,
  IsUUID,
  MaxDate,
  MaxLength,
} from 'class-validator';
import { Maybe } from 'graphql/jsutils/Maybe';
import { IUser, IAddUser, Status } from './user.interfaces';
import { UserEmail, CreateEmailUser } from '../email/email.types';

/**
 * Type de sortie GraphQL d'un utilisateur pour les récupérations
 */
@ObjectType()
export class User implements IUser {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @MaxLength(8)
  @Field(() => String)
  status: Status;

  @Field(() => [UserEmail], { nullable: true })
  emails?: UserEmail[];

  @Field(() => Date, { nullable: true })
  birthdate?: Maybe<Date>;
}

/**
 * Type d'entrée GraphQL d'un utilisateur à ajouter
 */
@InputType()
@ArgsType()
export class AddUser implements IAddUser {
  @MaxLength(50)
  @IsNotEmpty({ message: `Le nom de l'utilisateur n'est pas défini` })
  @Field(() => String)
  name: string;

  @MaxLength(8)
  @Field(() => String)
  status: Status;

  @Field(() => [CreateEmailUser], { nullable: true })
  emails?: UserEmail[];

  @IsOptional()
  @MaxDate(new Date(), {
    message: 'La date de naissance ne peut pas être définie dans le future',
  })
  @Field(() => Date, { nullable: true })
  birthdate?: Date;
}

/**
 * Type Argument GraphQL pour les queries / mutations ayant uniquement
 * besoin d'un identifiant utilisateur
 */
@ArgsType()
export class UserIdArgs {
  @IsUUID('all', {
    message: `L'identifiant de l'utilisateur doit être un UUID`,
  })
  @IsNotEmpty({ message: `L'identifiant de l'utilisateur doit être défini` })
  @Field(() => String)
  userId: string;
}
