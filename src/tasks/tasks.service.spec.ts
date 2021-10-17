import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatus } from './task.enum';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';

const mockUser = {
    id: 4,
    username: 'fulan',
};

const mockTaskRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn(),
    createTask: jest.fn(),
    delete: jest.fn(),
});

describe('TaskService', () => {
    let tasksService;
    let taskRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                { provide: TaskRepository, useFactory: mockTaskRepository },
            ],
        }).compile();

        tasksService = await module.get(TasksService);
        taskRepository = await module.get(TaskRepository);
    });

    describe('getTasks', () => {
        it('gets all tasks from the repository', async () => {
            taskRepository.getTasks.mockResolvedValue('someValue');

            expect(taskRepository.getTasks).not.toHaveBeenCalled();
            const filters: GetTaskFilterDto = {
                status: TaskStatus.IN_PROGRESS,
                search: 'Some search query',
            };
            const result = await tasksService.getTasks(filters, mockUser);
            expect(taskRepository.getTasks).toHaveBeenCalled();
            expect(result).toEqual('someValue');
        });
    });

    describe('getTaskById', () => {
        it('calls taskRepository.findOne() and successfuly retrieve and return the task', async () => {
            const mockTask = {
                title: 'Test Task',
                description: 'Some Description',
            };
            taskRepository.findOne.mockResolvedValue(mockTask);

            const result = await tasksService.getTaskById(1, mockUser);
            expect(result).toEqual(mockTask);

            expect(taskRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id: 1,
                    userId: mockUser.id,
                },
            });
        });

        it('throws an error as task is not found', () => {
            taskRepository.findOne.mockResolvedValue(null);
            expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    describe('createTask', () => {
        it('calls taskRepository.create() and returns the result', async () => {
            taskRepository.createTask.mockResolvedValue('someTask');

            expect(taskRepository.createTask).not.toHaveBeenCalled();
            const createTaskDto = {
                title: 'Test Task',
                description: 'Some Desc',
            };
            const result = await tasksService.createTask(
                createTaskDto,
                mockUser,
            );
            expect(taskRepository.createTask).toHaveBeenCalledWith(
                createTaskDto,
                mockUser,
            );
            expect(result).toEqual('someTask');
        });
    });

    describe('deleteTask', () => {
        it('calls taskRepository.delete() to delete a task', async () => {
            taskRepository.delete.mockResolvedValue({ affected: 1 });
            expect(taskRepository.delete).not.toHaveBeenCalled();

            await tasksService.deleteTaskById(1, mockUser);
            expect(taskRepository.delete).toHaveBeenCalledWith({
                id: 1,
                userId: mockUser.id,
            });
        });

        it('throws an error as task could no be found', () => {
            taskRepository.delete.mockResolvedValue({ affected: 0 });
            expect(tasksService.deleteTaskById(1, mockUser)).rejects.toThrow(NotFoundException);
        });
    });
});
