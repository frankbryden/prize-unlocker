import logo from './logo.svg';
import './App.css';
import React from 'react';
import Button from '@mui/material/Button';
import PrizeBar from './PrizeBar';
import Stack from '@mui/material/Stack';
import { Box, maxHeight } from '@mui/system';
import { Container, Typography } from '@mui/material';

const cols = ["264653","287271","2a9d8f","8ab17d","e9c46a","f4a261","ee8959","e76f51"];

const scoreIncrements = [1, 2, 3, 5];

class App extends React.Component {
	constructor(props) {
		super(props)

		this.loadPrizes = this.loadPrizes.bind(this);
		this.getGainedPrizes = this.getGainedPrizes.bind(this);

		this.state = {
			playing: false,
			game: {
				dest: null,
				prizes: [],
				score: 0,
				maxPrizePoints: 0,
			},
			errorMessage: "",
		}
	}

	loadPrizes(event) {
		this.setState({
			errorMessage: "",
		});
        const f = event.target.files[0];
        const fr = new FileReader();
        fr.onloadend = () => {
            const content = fr.result;
            console.log(content);
            let result = this.parsePrizes(content);
			if (result == undefined) {
				console.error("Failed to load prizes");
			}
            event.target.value = "";
        };
        fr.readAsText(f);
	}

	errorMessage(msg) {
		console.error(msg);
		this.setState({
			errorMessage: msg,
		});
	}

	/**
	 * Takes in a csv-style prize definition file of the following format
	 * Destinataire
	 * Prize,points
	 * Prize,points
	 * Prize,points
	 * Prize,points
	 * @param {csv} rawContent 
	 */
	parsePrizes(rawContent) {
		const lines = rawContent.split("\n");
		const dest = lines[0];
		let maxPrizePoints = 0;
		let prizes = [];
		if (lines.length > cols.length) {
			this.errorMessage("Too many prizes - not enough colors");
			return;
		}
		for (let i = 1; i < lines.length; i++) {
			const parts = lines[i].split(",");
			if (parts.length != 2) {
				this.errorMessage("Invalid line " + parts);
				return;
			}
			const points = parseInt(parts[1]);
			if (isNaN(points)) {
				this.errorMessage("Invalid number of points: " + parts[1]);
				return;
			}
			if (points > maxPrizePoints) {
				maxPrizePoints = points;
			}
			prizes.push({
				name: parts[0],
				points: parseInt(parts[1]),
				
				color: cols[i],
			});
		}
		this.setState({
			playing: true,
			game: {
				dest: dest,
				prizes: prizes,
				score: 0,
			},
		});
	}

	incrementScore(amount) {
		this.setState({
			game: {
				...this.state.game,
				score: this.state.game.score + amount,
			},
		});
	}

	getGainedPrizes() {
		let prizes = this.state.game.prizes.filter(prize => prize.points < this.state.game.score);
		console.log(`Looking for prizes with a score smaller than ${this.state.game.score}`);
		console.log("Gained prizes: ");
		console.log(prizes);
		if (prizes.length == 0) {
			return [{color: cols[0]}];
		}
		console.log(prizes);
		prizes.sort((a, b) => a.score < b.score);
		console.log(prizes);
		// return this.state.game.prizes.find(prize => prize.score < this.state.game.score).sort((a, b) => a.score < b.score);
		return prizes;
	}
	// }

	getCurrentPrize() {
		const gainedPrizes = this.getGainedPrizes();
		console.log(gainedPrizes);
		return gainedPrizes[gainedPrizes.length - 1];
	}

	render() {
		return (
		<Container sx={{
			height: "100vh",
		}} className="App" maxWidth={false} disableGutters >
				{this.state.playing ? 
					<Box sx={{
						backgroundColor: `#${this.getCurrentPrize().color}`,
						height: "100vh",
					}} justifyContent="center" alignItems="center">
						<PrizeBar value={this.state.game.score} /> 
						<Stack direction="row" spacing={2} justifyContent="center">
							{scoreIncrements.map(amount => 
								<Button variant="contained" onClick={() => this.incrementScore(amount)}>+{amount}</Button>
							)}
						</Stack>
						<br />
						<Stack direction="row" spacing={2} justifyContent="center">
							{scoreIncrements.map(amount => 
								<Button variant="contained" onClick={() => this.incrementScore(-amount)}>-{amount}</Button>
							)}
						</Stack>
					</Box> :
					<Box>
						<Typography variant="h2">
							Welcome to Frankie's prize unlocker!
						</Typography>
						<Button variant="contained" component="label">Load prizes
                        	<input id="prizeFile" type="file" hidden onChange={this.loadPrizes} />
                    	</Button>
						{this.state.errorMessage.length > 0 && 
							<Typography color="red">
								{this.state.errorMessage}
							</Typography>
						}
					</Box>
				}
		  </Container>
		);
	}
}

export default App;
