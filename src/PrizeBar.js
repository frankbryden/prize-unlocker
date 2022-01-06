import React from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import Container from '@mui/material/Container';

class PrizeBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Container maxWidth="md">
                <LinearProgress sx={{
                    height:30,
                    borderRadius:15,
                    }} className="prizeBar" variant="determinate" value={this.props.value} />
            </Container>
        )
    }
}

export default PrizeBar;