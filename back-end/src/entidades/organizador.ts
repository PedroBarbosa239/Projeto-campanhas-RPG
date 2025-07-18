import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import Usuário from "./usuário";
import Campanha from "./campanha";

export enum Experiência {
  NOVATO = "novato",
  VETERANO = "veterano",
}

export enum Sistema {
  DED = "ded",
  ORDEM = "ordem",
}

@Entity()
export default class Organizador extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "enum", enum: Experiência })
  experiência: Experiência;

  @Column()
  avaliação: number;

  @Column({ type: "enum", enum: Sistema })
  sistema: Sistema;

  @OneToMany(() => Campanha, (campanha) => campanha.organizador)
  campanhas: Campanha[];

  @OneToOne(() => Usuário, (usuário) => usuário.organizador, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  usuário: Usuário;
}
