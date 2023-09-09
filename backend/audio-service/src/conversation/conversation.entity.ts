import { ModelType } from "src/bot-interaction/bot-interaction.enum";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { MessageSource } from "./conversation.enum";

@Entity()
export class Conversation {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({
        nullable: true
    })
    train: string;
    @Column({
        nullable: true
    })
    model: ModelType;

    @OneToMany(m => Message, m => m.conversation)
    messages: Message[];
}

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;
    @CreateDateColumn()
    time: Date
    @Column()
    source: MessageSource;
    @Column()
    content: string;
    @Column({
        nullable: true
    })
    audio: string;
    @ManyToOne(c => Conversation, c => c.messages)
    conversation: Conversation;
}