import { Image } from "semantic-ui-react";

const Header = () => {
    return (
        <div className="header">
            <Image src='/tchoup-black.png' size='tiny' />
            <h2>Party Tracker</h2>
        </div>
    );
}

export default Header