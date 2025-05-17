import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { SQLiteDatabase } from "./database.sqlite";
import { PostgresDatabase } from "./database.postgresql";
import { MySQLDatabase } from "./database.mysql";

export class DatabaseFactory {
    static createDatabaseConnection(dbType: string, configService: ConfigService): TypeOrmModuleOptions {
        switch(dbType) {
            case 'sqlite':
                return new SQLiteDatabase(configService).getConnection()
            case 'postgres':
                return new PostgresDatabase(configService).getConnection()
            case 'mysql':
                return new MySQLDatabase(configService).getConnection()
            default:
                throw new Error('Unsupported database type')
        }
    } 
}