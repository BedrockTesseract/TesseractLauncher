import './styles/SettingsPage.scss'
import ResizablePanel from '@renderer/components/ResizablePanel';
import Switch from '@renderer/components/Switch';
import { useLauncherState } from '@renderer/states/LauncherState';
import Text from '@renderer/components/Text';
import { LauncherInfo } from '@renderer/utils/LauncherInfo';

export default function SettingsPage(): JSX.Element | null {
    const launcherState = useLauncherState();
    return (
        <div className='settings-page-container'>
            <ResizablePanel style={{ width: '100%', height: 'auto' }}>
                <div className='settings-page-buttons-area'>
                    <div className='settings-name-description-area'>
                        <div className='settings-name-text'>Keep Launcher Open</div>
                        <div className='settings-description-text'>Keeps the launcher open when launching the game or server</div>
                    </div>
                    <Switch onChange={(value) => launcherState.setKeepLauncherOpen(value)} checked={launcherState.keepLauncherOpen}/>
                </div>
            </ResizablePanel>
            <ResizablePanel style={{ width: '100%', height: 'auto', flexDirection: 'column', alignItems: 'flex-start', padding: '12px' }}>
                <Text>
                    Launcher Version: <a onClick={() => {window.openExternalLink(`${LauncherInfo.repository}/releases/tag/${LauncherInfo.version}`)}}>{LauncherInfo.version}</a>
                </Text>
                <Text>
                    Launcher Developer: {LauncherInfo.developer}
                </Text>
                <Text>
                    Launcher License: <a onClick={() => {window.openExternalLink('https://www.gnu.org/licenses/gpl-3.0.html')}}>{LauncherInfo.license}</a>
                </Text>
                <Text>
                    Launcher Repository: <a onClick={() => {window.openExternalLink(LauncherInfo.repository)}}>{LauncherInfo.repository}</a>
                </Text>
                <Text>
                    Tesseract Discord: <a onClick={() => {window.openExternalLink('https://discord.gg/eqetvb2zKB')}}>https://discord.gg/eqetvb2zKB</a>
                </Text>
                <Text style={{ display: 'flex', flexDirection: 'column' }}>
                    Launcher Raw Settings:
                    <ResizablePanel style={{filter: 'brightness(80%)'}}>
                        <Text style={{ whiteSpace: 'pre-wrap', padding: '5px' }}>
                            {JSON.stringify(launcherState.getSettings(), null, 4)}
                        </Text>
                    </ResizablePanel>
                </Text>
                <div style={{height: '20px'}}/>
                <Text>
                    Not afiliated with Mojang Studios or Microsoft
                </Text>
            </ResizablePanel>
        </div>
    );
}