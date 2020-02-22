import { Field, InputType, ObjectType } from 'type-graphql';
import { User } from './UserModel';

@InputType()
export class UserSignInInput {
  @Field()
  public phone: string;

  @Field()
  public password: string;
}

@InputType()
export class InitiateSignUpInput {
  @Field()
  public phone: string;
}

@InputType()
export class VerificationInput {
  @Field()
  public code: string;

  @Field()
  public verificationToken: string;
}

@InputType()
export class SignUpInput {
  @Field()
  public firstName: string;

  @Field()
  public lastName: string;

  @Field()
  public password: string;

  @Field()
  public signUpToken: string;
}

@InputType()
export class InitiateResetPasswordWithPhoneDataInput {
  @Field()
  public phone: string;
}

@InputType()
export class ResetPasswordWithPhoneDataInput {
  @Field()
  public password: string;

  @Field()
  public resetPasswordToken: string;
}

@ObjectType()
export class ResetPasswordData {
  @Field(type => User)
  public user: User;

  @Field()
  public resetPasswordToken: string;
}
