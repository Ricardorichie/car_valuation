import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterRemove,
  AfterUpdate,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert()
  logInsert() {
    console.log(' Inserted User', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log(' Removed User', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log(' Updated User', this.id);
  }
}
