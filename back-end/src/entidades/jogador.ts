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
import Candidatura from "./candidatura";

@Entity()
export default class Jogador extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  texto_descritivo: string;

  @Column()
  anos_experiência: number;

  @OneToMany(() => Candidatura, (candidatura) => candidatura.jogador)
  candidaturas: Candidatura[];

  @OneToOne(() => Usuário, (usuário) => usuário.jogador, {
    onDelete: "CASCADE",
  })
  
  @JoinColumn()
  usuário: Usuário;
}
