
import './BackgroundLogo.css';

export default function BackgroundLogo({logoUrl} : {logoUrl: string}) {
    return (
    <div className="backgroundLogoContainer" >
        <img className="backgroundLogo" src={logoUrl} alt="Background decoration." />
    </div>
    );
}