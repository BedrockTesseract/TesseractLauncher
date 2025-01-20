import './styles/AsyncTaskOverlay.scss'
import { useEffect, useReducer, useState } from 'react';
import ProgressBar from '@renderer/components/ProgressBar'
import Text from '@renderer/components/Text'
import { ITask, Task } from '@renderer/core/async/Task';
import TaskQueue from '@renderer/core/async/TaskQueue';
import { TaskStateHandle, TaskStatePropertyNames, TaskStatePropertyType } from '@renderer/core/async/TaskStateHandle';
import { BackgroundRunner } from '@renderer/core/async/BackgroundRunner';

export default function AsyncTaskOverlay() {
    const [taskName, setTaskName] = useState<string>('');
    const [taskDescription, setTaskDescription] = useState<string>('');
    const [isMarquee, setIsMarquee] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [isRunning, setIsRunning] = useState<boolean>(false);

    const handlePropertyChanged = (handle: TaskStateHandle, property: TaskStatePropertyType) => {
        if (handle !== TaskQueue.current?.state)
            return;

        switch (property) {
            case 'progressName':
                setTaskName(handle.progressName);
                break;
            case 'progressMessage':
                setTaskDescription(handle.progressMessage);
                break;
            case 'progressMarquee':
                setIsMarquee(handle.progressMarquee);
                break;
            case 'progressValue':
                setProgress(handle.progressValue);
                break;
        }
    };

    const handleStarting = (task: ITask) => {
        setIsRunning(true);
        task.state.on('propertyChanged', handlePropertyChanged);
        TaskStatePropertyNames.forEach(property => handlePropertyChanged(task.state, property));
    };
    
    const handleFinished = (task: ITask) => {
        setIsRunning(false);
        task.state.off('propertyChanged', handlePropertyChanged);
    };

    useEffect(() => {
        TaskQueue.on('starting', handleStarting);
        TaskQueue.on('finished', handleFinished);
        return () => {
            TaskQueue.off('starting', handleStarting);
            TaskQueue.off('finished', handleFinished);
        };
    }, []);

    useEffect(() => {
        setIsRunning(!!TaskQueue.current);
    }, [TaskQueue.current])

    return isRunning ? 
        (<div className='async-task-overlay'>
            <Text>{taskName}</Text>
            {taskDescription !== '' ? <Text style={{fontSize: '12px', filter: 'brightness(75%)'}}>{taskDescription}</Text> : null}
            <ProgressBar marquee={isMarquee} value={!isMarquee ? progress : 1} width='80%' height='10px'/>
        </div>) : null;
}