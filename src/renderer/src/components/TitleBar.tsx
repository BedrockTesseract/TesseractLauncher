import './styles/TitleBar.scss';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLauncherState } from '@renderer/states/LauncherState';
import { WindowControls } from '@renderer/utils/WindowControls';
import ProgressBar, { ProgressBarHandle } from './ProgressBar';
import { LauncherInfo } from '@renderer/utils/LauncherInfo';
import Button from './Button';
import TaskList from './TaskList';
import Text from './Text';
import { BackgroundRunner } from '@renderer/core/async/BackgroundRunner';
import { Task } from '@renderer/core/async/Task';

export default function TitleBar(): JSX.Element | null {
    const [isTaskRunning, setIsTaskRunning] = useState<boolean>(false);
    const [isTasksVisible, setIsTasksVisible] = useState<boolean>(false);
    const handleAnyRunnerEvent = useCallback((...args: any[]) => {
        setIsTaskRunning(BackgroundRunner.isRunningAny());
    }, []);

    useEffect(() => {
        BackgroundRunner.on('added', handleAnyRunnerEvent);
        BackgroundRunner.on('started', handleAnyRunnerEvent);
        BackgroundRunner.on('finished', handleAnyRunnerEvent);
        BackgroundRunner.on('removed', handleAnyRunnerEvent);
        handleAnyRunnerEvent();
        return () => {
            BackgroundRunner.off('added', handleAnyRunnerEvent);
            BackgroundRunner.off('started', handleAnyRunnerEvent);
            BackgroundRunner.off('finished', handleAnyRunnerEvent);
            BackgroundRunner.off('removed', handleAnyRunnerEvent);
        };
    }, []);

    return (
        <div className='top-bar'>
            <div className='drag-region'>
                <div className='window-info-container '>
                    <div className='window-icon'/>
                    <div className='window-title'>Tesseract</div>
                    <div style={{width: '7px'}}></div>
                    <Text style={{filter: 'brightness(70%)', fontSize: '12px'}}>{LauncherInfo.version}</Text>
                </div>
            </div>
            <div className='task-container' onClick={() => setIsTasksVisible(!isTasksVisible)}>
                <div className='clickable-task-button' style={{display: isTaskRunning ? 'flex' : 'none'}}>
                    {isTaskRunning ? <ProgressBar marquee={true}/> : null}
                    <TaskList visible={isTasksVisible}/>
                </div>
            </div>
            <div className='separator'/>
            <div className='buttons-container'>
                <Button onClick={() => WindowControls.minimize()}>
                    <div className='subtract-icon'/>
                </Button>
                <Button onClick={() => WindowControls.maximize()}>
                    <div className='maximize-icon'/>
                </Button>
                <Button onClick={() => WindowControls.close()} style={{backgroundColor: '#FF0000'}}>
                    <div className='close-icon'/>
                </Button>
            </div>
        </div>
    )
}