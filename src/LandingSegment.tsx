import DracoButton from './DracoButton';
import './LandingSegment.css';

function LandingSegment() {
    return (
        <div className="landing-segment">
            <img src="generated/Logo-Long.svg" className="splash-logo" alt="Big Logo of Draco" />
            <h1>
                A new .NET programming language in the making
            </h1>
            <div className="mainButtons">
                <DracoButton buttonSize="large" className="getstarted" url='#'>Getting Started</DracoButton>
                <DracoButton buttonSize="large" className="specs" url='#'>Specifications</DracoButton>
            </div>
        </div>
    );
}

export default LandingSegment;
