import { CustomSVGProps } from "@/app/types/svg.types";

const FunnelAltVG = (props: CustomSVGProps) => {
    const { fill, handleShowFilterRow } = props;

    return(            
        <svg 
            fill={fill} 
            height="25px" 
            width="25px" 
            version="1.1" 
            id="Capa_1" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 485.008 485.008" 
            stroke={fill}
            onClick={ handleShowFilterRow }
        >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"/>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>
            <g id="SVGRepo_iconCarrier"> 
                <g> 
                    <g> 
                        <path d="M171.501,464.698v-237.9l-166.3-192.6c-8.9-10.9-7.9-33.3,15.1-33.3h443.6c21.6,0,26.6,19.8,15.1,33.3l-162.3,187.5v147.2 c0,6-2,11.1-7.1,15.1l-103.8,95.8C193.801,488.698,171.501,483.898,171.501,464.698z M64.701,41.298l142.2,164.3c3,4,5,8.1,5,13.1 v200.6l64.5-58.5v-146.1c0-5,2-9.1,5-13.1l138.1-160.3L64.701,41.298L64.701,41.298z"/> 
                    </g> 
                </g> 
            </g>
        </svg>
        
    )
}

export default FunnelAltVG;