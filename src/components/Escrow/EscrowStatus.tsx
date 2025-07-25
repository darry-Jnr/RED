import React from "react";
import EscrowClient from "./EscrowClient";
import EscrowFreelancer from "./EscrowFreelancer";

type Props = {
    userId: string;
    jobId: string;
    isClient: boolean;
};

const EscrowStatus: React.FC<Props> = ({
    userId,
    jobId,
    isClient,
}) => {
    if (!jobId) return null;

    return isClient ? (
        <EscrowClient userId={userId} jobId={jobId} />
    ) : (
        <EscrowFreelancer userId={userId} jobId={jobId} />
    );
};

export default EscrowStatus;
