import { CustomSVGProps } from "@/app/types/svg.types";

const ScrollerSVG = (props: CustomSVGProps) => {
    const { fill } = props;

    return(
            <svg 
                fill={fill} 
                width="45px" 
                height="45px" 
                viewBox="0 0 14 14" 
                role="img" 
                focusable="false" 
                aria-hidden="true" 
                xmlns="http://www.w3.org/2000/svg"
            >

                <g id="SVGRepo_bgCarrier" strokeWidth="0"/>
            
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>
            
                <g id="SVGRepo_iconCarrier">
            
                    <path d="M 1.23379,8.6532848 C 1.02183,8.5506848 1,8.3964848 1,7.0016848 c 0,-1.415 0.0204,-1.5505 0.2495,-1.6548 0.18499,-0.084 11.31601,-0.084 11.501,0 0.22907,0.1043 0.2495,0.2398 0.2495,1.6548 0,1.4149 -0.0204,1.5504 -0.2495,1.6548 -0.17686,0.081 -11.35009,0.078 -11.51671,0 z m 1.79121,-0.6445 c 0.045,-0.045 0.0643,-0.3408 0.0643,-0.9872 0,-0.7676 -0.0142,-0.9371 -0.0842,-1.0072 -0.0463,-0.046 -0.11448,-0.084 -0.1515,-0.084 -0.0748,0 -1.26231,0.8754 -1.32818,0.9791 -0.0876,0.1378 -0.0252,0.2098 0.58619,0.6766 0.61942,0.473 0.78608,0.5501 0.91339,0.4228 z m 8.82831,-0.3737 c 0.62319,-0.4672 0.66245,-0.505 0.66373,-0.6403 7.4e-4,-0.079 -1.12178,-0.9723 -1.31467,-1.0463 -0.0433,-0.017 -0.11459,-6e-4 -0.15841,0.036 -0.0652,0.054 -0.0797,0.2436 -0.0797,1.0417 0,0.5366 0.0161,0.9917 0.0357,1.0113 0.10036,0.1004 0.32272,0 0.85331,-0.4023 z M 10,7.0016848 l 0,-0.8572 -3,0 -3,0 0,0.8572 0,0.8571 3,0 3,0 0,-0.8571 z"/>
            
                </g>
            
            </svg>
        
    )
}

export default ScrollerSVG;
