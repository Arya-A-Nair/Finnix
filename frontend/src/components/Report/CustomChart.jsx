import { Box, Typography, Button, Tooltip } from "@mui/material";
import React from "react";
import { PiShareNetworkBold } from "react-icons/pi";
import { FaBridge, FaMoneyBillTransfer } from "react-icons/fa6";
import { HiMiniUserGroup } from "react-icons/hi2";
import { GiHole } from "react-icons/gi";
import { BiBlock } from "react-icons/bi";
import { BiInfoCircle } from "react-icons/bi";
function CustomChart({
	networks,
	bridges,
	groups,
	holes,
	transactions,
	fAccounts,
	handleClick,
	edges,
}) {
	// Define the icons map with names and JSX elements

	const style = {
		color: "#10316B",
		fontSize: "2rem",
	};

	const iconsMap = [
		{
			name: "Transactions",
			icon: <FaMoneyBillTransfer style={style} />,
			value: transactions || 0,
			impact: `${
				transactions === 0
					? "No"
					: transactions < 5
					? "Low"
					: transactions < 10
					? "Medium"
					: "High"
			}`,
			info: "Get all details of transactions that are seen in the network",
		},
		{
			name: "Networks",
			icon: <PiShareNetworkBold style={style} />,
			value: networks,
			impact: `${
				networks === 0
					? "No"
					: networks < 5
					? "Low"
					: networks < 10
					? "Medium"
					: "High"
			}`,
			info: "Get the longest possible network that is formed in the transaction data",
		},
		{
			name: "Mule Bridges",
			icon: <FaBridge style={style} />,
			value: bridges,
			impact: `${
				bridges === 0
					? "No"
					: bridges < 5
					? "Low"
					: bridges < 10
					? "Medium"
					: "High"
			}`,
			info: "Get shell accounts whose only purpose is to push money",
		},
		{
			name: "Groups",
			icon: <HiMiniUserGroup style={style} />,
			value: groups,
			impact: `${
				groups === 0
					? "No"
					: groups < 5
					? "Low"
					: groups < 10
					? "Medium"
					: "High"
			}`,
			info: "Get groups of accounts that are connected to each other",
		},
		{
			name: "Sink Holes",
			icon: <GiHole style={style} />,
			value: holes,
			impact: `${
				holes === 0 ? "No" : holes < 5 ? "Low" : holes < 10 ? "Medium" : "High"
			}`,
			info: "Get the to know wether the asset has been paid via illicit means",
		},
		{
			name: "Fraud Accounts",
			icon: <BiBlock style={style} />,
			value: fAccounts,
			impact: `${
				fAccounts === 0
					? "No"
					: fAccounts < 5
					? "Low"
					: fAccounts < 10
					? "Medium"
					: "High"
			}`,
			info: "Get accounts which start and end very fast while also transacting heavy amounts",
		},
		// {
		//     name: 'Edge Analysis',
		//     icon: <BiLogoGraphql style={style} />,
		//     value: edges,
		//     impact: `${edges < 5 ? "No" : edges  < 15 ? "Low" : edges < 50 ? "Medium" : "High"}`
		// }
	];

	return (
		<Box
			sx={{
				width: "100%",
				textAlign: "start",
				height: "100%",
			}}
		>
			<Box
				sx={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					flexWrap: "wrap",
					justifyContent: "start",
					marginTop: "1rem",
					gap: "1rem",
				}}
			>
				{iconsMap.map((iconData, i) => (
					<Button
						key={i}
						sx={{
							bgcolor: "#FFF",
							display: "flex",
							flexDirection: "column",
							alignItems: "start",
							justifyContent: "space-evenly",
							padding: "1rem",
							borderRadius: "0.5rem",
							height: "200px",
							width: "250px",
							textTransform: "none",
						}}
						onClick={() => {
							handleClick(iconData.name);
						}}
						endIcon={
							<Tooltip disableFocusListener title={iconData.info}>
								<Button sx={{
                  position:"absolute",
                  top:0,
                  right:0
                }} >
									<BiInfoCircle />
								</Button>
							</Tooltip>
						}
					>
						{iconData.icon}
						<Typography variant="h6" fontWeight="700" color="primary">
							{iconData.name}
						</Typography>
						<Typography variant="h6" fontWeight="400" color="primary">
							{iconData.impact} {" Impact"}
						</Typography>
						<Typography
							variant="h6"
							fontWeight="700"
							color="primary"
							sx={{ paddingLeft: "0.5rem" }}
						>
							{iconData.value}
						</Typography>
					</Button>
				))}
			</Box>
		</Box>
	);
}

export default CustomChart;
