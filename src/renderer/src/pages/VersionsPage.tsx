import ResizablePanel from "@renderer/components/ResizablePanel"
import "./styles/VersionsPage.css"
import Button from "@renderer/components/Button"
import Text from "@renderer/components/Text"
import InputBox from "@renderer/components/InputBox"
import { useEffect, useRef, useState } from "react"
import Checkbox from "@renderer/components/Checkbox"
import { useLauncherState } from "@renderer/states/LauncherState"
import { VersionList } from "@renderer/minecraft/VersionList"
import { Logger } from "@renderer/utils/Logger"
import { useMainTaskQueue } from "@renderer/states/MainTaskQueue"
import { MinecraftVersion, MinecraftVersionType } from "@renderer/minecraft/MinecraftVersion"
import { UUID } from "@renderer/utils/UUID"

interface ParsedVersion { name: string, uuid: string, type: string };
export default function VersionsPage(

): JSX.Element | null {
    const launcherState = useLauncherState();
    const taskQueue = useMainTaskQueue();
    const [showAllFilters, setShowAllFilters] = useState<boolean>(false);
    const [showAllFiltersButtonHeight, setshowAllFiltersButtonHeight] = useState<number>(0);
    const [versions, setVersions] = useState<MinecraftVersion[]>([]);
    const [parsedVersions, setParsedVersions] = useState<ParsedVersion[]>([]);
    const filtersButtonRef = useRef<React.ElementRef<'div'>>(null);
    useEffect(() => {
        setshowAllFiltersButtonHeight(filtersButtonRef.current?.clientHeight ?? 0);
    }, [filtersButtonRef]);

    useEffect(() => {
        Logger.trace("Downloading versions");
        taskQueue.enqueue("Downloading minecraft version list...", "From https://raw.githubusercontent.com/BedrockTesseract/Launcher-Data/refs/heads/main/versions.json.min", async (task) => {
            task.setProgressName("Downloading version list...");
            task.setProgressDescription(`From '${VersionList.SOURCE}'`);
            const versions = await VersionList.getVersions();
            setVersions(versions);
            Logger.trace("Downloaded " + versions.length + " versions");
        }, undefined, false);
    }, []);

    useEffect(() => {
        taskQueue.enqueue("Parsing version elements...", "", async (task) => {
            const parsedAll = versions.sort((a, b) => b.version.compare(a.version)).flatMap((version) => {
                let versionsResult: ParsedVersion[] = [
                    {
                        name: version.version.toString(),
                        uuid: version.uuid,
                        type: version.type === MinecraftVersionType.Release ? "Release" : version.type === MinecraftVersionType.Beta ? "Beta" : "Preview"
                    }
                ];
                if (version.hasServerVersion()) {
                    const newUuid = `${version.uuid}/server`;
                    const newVersion = `${version.version.toString()}-server`;
                    versionsResult.push(
                        {
                            name: newVersion,
                            uuid: newUuid,
                            type: "Server"
                        }
                    );
                }
                return versionsResult;
            });
            setParsedVersions(parsedAll);
            await new Promise((resolve) => setTimeout(resolve, 200));
        }, undefined, false);
    }, [versions]);

    const notDownloadedButtonElements = [
        <Button key={UUID.create()} style={{
            width: "35px", 
            height: "35px", 
            borderRadius: 0, 
            backgroundColor: "var(--true-color)", 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center"
        }}>
            <div className="download-icon"/>
        </Button>
    ];

    const downloadedButtonElements = [
        <Button key={UUID.create()} style={{
            width: "35px", 
            height: "35px", 
            borderRadius: 0, 
            backgroundColor: "var(--charcoal)", 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center"
        }}>
            <div className="folder-icon"/>
        </Button>,
        <Button key={UUID.create()} style={{
            width: "35px", 
            height: "35px", 
            borderRadius: 0, 
            backgroundColor: "var(--false-color)", 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center"
        }}>
            <div className="trash-icon"/>
        </Button>
    ];

    const versionElements = parsedVersions.filter((version) => {
        if (launcherState.showReleases && version.type === "Release") return true;
        if (launcherState.showPreviews && version.type === "Preview") return true;
        if (launcherState.showBetas && version.type === "Beta") return true;
        if (launcherState.showServer && version.type === "Server") return true;
        if (launcherState.showInstalled && false) return true;
        return false;
    }).filter((version) => {
        if (launcherState.versionFilterString === "") return true;
        return version.name.includes(launcherState.versionFilterString);
    }).map((version, i) => {
        return (
            <div key={version.uuid} className="version-card">
                <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                    <div style={{ width: "auto", height: "auto", display: "flex", flexDirection: "column" }}>
                        <Text style={{fontSize: "16px" }}>
                            {`${version.name}`}
                        </Text>
                        <Text style={{fontSize: "12px", filter: "brightness(0.65)" }}>
                            {version.uuid}
                        </Text>
                        <Text style={{fontSize: "12px", filter: "brightness(0.65)" }}>
                            {version.type}
                        </Text>
                    </div>
                    <div className="version-card-buttons">
                        {[...notDownloadedButtonElements, ...downloadedButtonElements]}
                    </div>
                </div>
            </div>
        );
    });

    return (
        <div className="versions-page">
            <ResizablePanel style={{ width: "100%", height: "auto", padding: "10px", boxSizing: "border-box", justifyContent: "space-between" }}>
                <div style={{ width: "auto", height: "auto", display: "flex", alignItems: "top", justifyContent: "left", position: "relative" }}>
                    <Button style={{ 
                        width: "auto", 
                        height: "auto", 
                        borderRadius: "7.5px", 
                        backgroundColor: "var(--charcoal)", 
                        padding: "7.5px",
                        border: `2px solid ${"var(--rich-black)"}`,
                        borderBottomLeftRadius: showAllFilters ? "0px" : "7.5px",
                        borderBottomRightRadius: showAllFilters ? "0px" : "7.5px",
                    }} onClick={() => {
                        setShowAllFilters(!showAllFilters);
                    }} innerRef={filtersButtonRef}>
                        <Text style={{fontSize: "12px"}}>Show all filters</Text>
                    </Button>
                    <ResizablePanel style={{ 
                        display: showAllFilters ? "flex" : "none", 
                        transform: `translateY(${showAllFiltersButtonHeight + 2}px)`, 
                        width: "auto", 
                        height: "auto", 
                        position: "fixed", 
                        flexDirection: "column", 
                        alignItems: "start", 
                        padding: "5px", 
                        gap: "5px",
                        borderRadius: "0px",
                        borderBottomLeftRadius: "10px",
                        borderBottomRightRadius: "10px",
                        borderTopRightRadius: "10px",
                        zIndex: 1,
                    }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <Checkbox value={launcherState.showReleases} onChange={(v) => launcherState.setShowReleases(v)}/>
                            <Text style={{ marginLeft: "10px", fontSize: "14px" }}>
                                Show releases
                            </Text>
                        </div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <Checkbox value={launcherState.showPreviews} onChange={(v) => launcherState.setShowPreviews(v)}/>
                            <Text style={{ marginLeft: "10px", fontSize: "14px" }}>
                                Show previews
                            </Text>
                        </div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <Checkbox value={launcherState.showBetas} onChange={(v) => launcherState.setShowBetas(v)}/>
                            <Text style={{ marginLeft: "10px", fontSize: "14px" }}>
                                Show betas
                            </Text>
                        </div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <Checkbox value={launcherState.showInstalled} onChange={(v) => launcherState.setShowInstalled(v)}/>
                            <Text style={{ marginLeft: "10px", fontSize: "14px" }}>
                                Show installed
                            </Text>
                        </div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <Checkbox value={launcherState.showServer} onChange={(v) => launcherState.setShowServer(v)}/>
                            <Text style={{ marginLeft: "10px", fontSize: "14px" }}>
                                Show server
                            </Text>
                        </div>
                    </ResizablePanel>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <InputBox style={{width: "320px"}} placeholder={"Version filter..."} value={launcherState.versionFilterString} onChange={(input) => 
                        launcherState.setVersionFilterString(input.target.value)
                    }/>
                    <div className="filter-icon"/>
                </div>
            </ResizablePanel>
            <div className="versions-list">
                {versionElements}
            </div>
        </div>
    )
}