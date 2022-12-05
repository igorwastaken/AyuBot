import sql from '../database'
import { Collection } from 'discord.js'


class Guild {
  async get(guildId: string, create: boolean): Promise<void> {
    const data = await sql`
     SELECT * FROM guilds WHERE id = ${guildId}
    `
    if(!data[0] && !create) throw new Error("Servidor não existe na Database");
    if(create) {
      this.create(guildId)
    }
    return data[0];
  }
  async create(guildId: string): Promise<void> {
    const insertData = await sql`
     INSERT INTO guilds ( id ) VALUES ( ${guildId} )
    `
    return insertData;
  }
}

export {
  Guild
};