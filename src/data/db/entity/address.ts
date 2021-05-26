import { User } from "@data/db/entity/user";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  cep!: string;

  @Column()
  street!: string;

  @Column()
  streetNumber!: number;

  @Column({ nullable: true })
  complement!: string;

  @Column()
  neighborhood!: string;

  @Column()
  city!: string;

  @Column()
  state!: string;

  @ManyToOne(() => User, user => user.address, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  userId!: number;
}
