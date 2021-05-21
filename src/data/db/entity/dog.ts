import { User } from "@data/db/entity/user";
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";

@Entity()
export class Dog {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @OneToOne(() => Dog, (dog) => dog.user)
  dog!: Dog;
  user!: User;
}
