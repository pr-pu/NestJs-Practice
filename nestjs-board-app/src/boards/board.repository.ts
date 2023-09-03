import { DataSource, EntityRepository, Repository } from "typeorm";
import { Board } from "./board.entity";
import { CreateBoardDto } from "./dto/create-board.dto";
import { BoardStatus } from "./board-status.enum";
import { Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class BoardRepository extends Repository<Board> {
    constructor(dataSource: DataSource) {
        super(Board, dataSource.createEntityManager());
    }

    async getAllBoards(): Promise<Board[]> {
        return await this.find();
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
    
    async getBoardById(id: number): Promise<Board> {
        const found = await this.findOne({
            where: { id: id }
        });

        if (!found)
            throw new NotFoundException(`Cannot find Board with id ${id}`);

        return found;
    }

    async deleteBoard(id: number): Promise<void> {
        const result = await this.delete(id);
        
        if (result.affected === 0)
            throw new NotFoundException(`Cannot find Board with id ${id}`);
    }

    async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
        await this.update(id, {status: status});

        const board = await this.getBoardById(id);
        
        return board; 
    }

}


