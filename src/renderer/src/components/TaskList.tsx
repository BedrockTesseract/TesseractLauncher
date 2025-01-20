import './styles/TaskList.scss'
import { forwardRef, useCallback, useEffect, useImperativeHandle, useReducer, useRef, useState } from 'react';
import { useLauncherState } from '@renderer/states/LauncherState';
import ProgressBar, { ProgressBarHandle } from './ProgressBar';
import { Task } from '@renderer/core/async/Task';
import { BackgroundRunner } from '@renderer/core/async/BackgroundRunner';
import { TaskStateHandle } from '@renderer/core/async/TaskStateHandle';

interface TaskListProps {
    visible?: boolean
}

export default function TaskList({ 
    visible 
}: TaskListProps
): JSX.Element {
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const handleAnyEvent = useCallback((...args: any[]) => {
        forceUpdate();
    }, []);

    const handleTaskStatePropertyChanged = useCallback((handle: TaskStateHandle, property: string) => {
        handleAnyEvent();
    }, []);

    const handleTaskAdded = useCallback((task: Task<any>) => {
        task.state.on('propertyChanged', handleTaskStatePropertyChanged);
        handleAnyEvent();
    }, []);

    const handleTaskRemoved = useCallback((task: Task<any>) => {
        task.state.off('propertyChanged', handleTaskStatePropertyChanged);
        handleAnyEvent();
    }, []);

    useEffect(() => {
        BackgroundRunner.on('added', handleTaskAdded);
        BackgroundRunner.on('started', handleAnyEvent);
        BackgroundRunner.on('finished', handleAnyEvent);
        BackgroundRunner.on('removed', handleTaskRemoved);
        BackgroundRunner.getTasks().forEach(task => task.state.on('propertyChanged', handleTaskStatePropertyChanged));
        forceUpdate();
        return () => {
            BackgroundRunner.off('added', handleTaskAdded);
            BackgroundRunner.off('started', handleAnyEvent);
            BackgroundRunner.off('finished', handleAnyEvent);
            BackgroundRunner.off('removed', handleTaskRemoved);
            BackgroundRunner.getTasks().forEach(task => task.state.off('propertyChanged', handleTaskStatePropertyChanged));
        };
    }, []);

    const elements = BackgroundRunner.getTasks().map((task, index) => {
        if (task.state.taskState !== 'running')
            return null;

        return (
            <div key={`task-item-${index}`} className='task-item'>
                <div className='task-item-name'>{task.state.progressName}</div>
                <div className='task-item-desc'>{task.state.progressMessage}</div>
                {!task.state.progressMarquee ? <div style={{ width: '100%', display: 'flex', justifyContent: 'right' }}><div className='task-item-percent'>{Math.floor(task.state.progressValue * 100)}%</div></div> : null}
                <ProgressBar value={task.state.progressValue} width={'100%'} height={'5px'} marquee={task.state.progressMarquee} style={{ marginTop: '7.5px', backgroundColor: 'var(--rich-black)' }}/>
            </div>
        );
    }).filter((x) => x !== null);

    return (
        <div className='task-list' style={{display: visible ? 'block' : 'none'}}>
            {elements}
        </div>
    );
};