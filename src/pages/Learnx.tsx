import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import BlockChainBreak from "../components/custom/BlockChainBreak";
import InstallMetaMask from "../components/custom/InstallMetaMask";
import PrivateKeyChaos from "../components/custom/PrivateKeyChaos";
import CheckBalance from "../components/custom/CheckBalance";
import CheckHelaConnection from "../components/custom/CheckHelaConnection";
import SendToSelf from "../components/custom/SendToSelf";
import SendToUs from "../components/custom/SendToUs";
import WalletAddress from "../components/custom/WalledAddress";
import WalletCreateAndConnect from "../components/custom/WalletCreateAndConnect";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const data = [
    [<BlockChainBreak />],
    [<InstallMetaMask />, <CheckBalance />, <CheckHelaConnection />, <WalletAddress />, <WalletCreateAndConnect />],
    [<PrivateKeyChaos />],
    [<SendToSelf />, <SendToUs />],

]

const Learnx = () => {
    const { id } = useParams();
    const [slide, setSlide] = useState<number>(0);

    return (
        <div>
            <div className="py-4 px-8">
                <Link to="/learn">
                    <button className="flex items-center gap-2"><ChevronLeftIcon /> Back</button>
                </Link>
            </div>
            <div className="h-193 flex items-center justify-center">
                {data[Number(id)][slide]}
            </div>
            <div className="flex justify-between py-4 px-8">
                <button className="flex items-center gap-2" onClick={() => setSlide((prev) => prev - 1)} disabled={slide === 0}><ChevronLeftIcon /> Previous</button>
                <button className="flex items-center gap-2" onClick={() => setSlide((prev) => prev + 1)} disabled={slide === data[Number(id)].length - 1}>Next <ChevronRightIcon /></button>
            </div>
        </div>
    )
}

export default Learnx