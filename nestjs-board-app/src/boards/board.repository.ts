import { DataSource, EntityRepository, Repository } from "typeorm";
import { Board } from "./board.entity";
import { CreateBoardDto } from "./dto/create-board.dto";
import { BoardStatus } from "./board-status.enum";
import { Injectable } from "@nestjs/common";
import { InjectRepository, TypeOrmDataSourceFactory } from "@nestjs/typeorm";

//@EntityRepository(Board)
@Injectable()
export class BoardRepository extends Repository<Board> {
    constructor(dataSource: DataSource) {
        super(Board, dataSource.createEntityManager());
    }

    async createBoard(createBoardDto: CreateBoardDto): Promise<Board> {
        const {title, description} = createBoardDto;

        const board = this.create(
            {
                title,
                description,
                status: BoardStatus.PUBLIC
            })
        
        await this.save(board);

        return board;
    }
}


