import { User } from "@data/db/entity/user";
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne } from "typeorm";

@Entity()
export class Dog {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @ManyToOne(() => User, (user: User) => user.dog, { onDelete: 'CASCADE' })
  user!: User;
}
