import AppDataSource from "../../data-source";
import {Task} from "../../entities/task.entity";
import {AppError} from "../../errors/AppError";

export const deleteTaskService = async (taskId: string) => {
    const taskRepository = AppDataSource.getRepository(Task)
    const task = await taskRepository.findOneBy({
        id: taskId
    })
    
    if(!task){
        throw  new AppError(404, "Task not found")
    }
    
    await taskRepository.delete({
        id: taskId
    })
};