import { VmixSettings } from "./VmixSettings";
import { CamerasTable } from "./CamerasTable";
import { Topbar } from "../MainPanel/Topbar";
import { Container } from "../../components";

export const VmixPage = () => {
    return (
        <div className="relative flex size-full flex-col gap-4 overflow-y-auto">
            <Topbar header="vMix Settings" />
            <Container>
                <div className="flex flex-col gap-6 w-full p-2">
                    <VmixSettings />
                    <CamerasTable />
                </div>
            </Container>
        </div>
    );
};
