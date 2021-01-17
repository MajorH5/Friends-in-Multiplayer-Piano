// ==UserScript==
// @name         Multiplayer Piano ADD-ON
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  Adds new features to MPP including add friends, do not show again, Direct Messaging etc.
// @author       MajorH
// @match        https://www.multiplayerpiano.com/*
// @grant        none
// ==/UserScript==
// -- //
// INITIALIZE DATABASE:
let version
let db
let messageIdIndex = {

}
let statusM = true

//
// -- //

// -- //
// DECLORATIONS //
let cursorClickerScore = '0'
let inGame = false
let scriptCreatorId = '60d7080bbfbaf5356c6fac89'
let currentInput
let mouseInInput
let newsetup;
let cookies;
let join
let friends = [];
let bgr = []
let savname = [];
let friendsWindow = 'friendsWindow';
let messengerWindow = 'messengerWindow';
let friendsButton = 'friendsButton';
let verifyUserPrompt = 'verifyUserPrompt';
let cancelButton = 'cancelButton';
let settingsButton = 'settingsButton';
let miniGames = 'miniGames';
let cookieFriendLocation;
let addFriend = 'addFriend';
let connectingText
let userVerifyCode
let messagingInfo;
let cookiesFound = false;
let WEBSOCKETLOCATION = 'wss://mppchatclient.info:8080/';
let clickable = true
let iloc;
let jloc;
let gBS;
let messengerSetup = false;
let socketConnection = 'socketConnection';
let ownid;
let ws;
let holderLeft;
let holderTop;
let inputLeft;
let inputTop;
let buttonLeft;
let buttonTop;
let nameLeft;
let nameTop;
let settingsLeft
let settingsTop
let friendRoomId = [];
let roomreq
let allowRoom
let updateName = []
const regWindowWidth = ($(window).width());
const regWindowHeight = ($(window).height());
let draggable = (regWindowHeight + 10);
window.onload = function () {
	holderLeft = (regWindowWidth - 260).toString();
	holderTop = (regWindowHeight - 7).toString();
	inputLeft = (regWindowWidth - 449).toString();
	inputTop = (regWindowHeight - 43).toString();
	buttonLeft = (regWindowWidth - 174).toString();
	buttonTop = (regWindowHeight - 46).toString();
	nameLeft = (regWindowWidth - 453).toString();
	nameTop = (regWindowHeight - 425).toString();
	settingsLeft = (regWindowWidth / 2).toString();
	settingsTop = ((regWindowHeight / 2) - 200).toString();
};
let windowSize = ($(window).width() - 261)
setTimeout(() => {
	ws = new WebSocket(`${WEBSOCKETLOCATION}`);
	ws.addEventListener('open', function (e) {
		addListener()
		sendMessage('update player')
	})
}, 3000);
let stopDots;
let counter = 1;
let msgWindowOpen = false;

let owncolor
setTimeout(function () {
	owncolor = document.getElementsByClassName('name me')[0].style.backgroundColor;
}, 1000)

let deleteCookie = 'Thu, 01 Jan 1970 00:00:01 GMT,';
let keepCookie = 'Thu, 01 Jan 2030 00:00:01 GMT,';
let nameDiv = [];
// -- //

// -- //
// SETS UP COOKIE ARRAY
function updateFriendArray() {
	cookies = document.cookie.split(';').map((cookie => {
		const [key, ...v] = cookie.split('=');
		return [key, v.join('=')];
	}))
};
updateFriendArray();
// -- //

// 	DELETE FRIENDS WINDOW
function deleteFriendWindow(id) {
	let i = document.getElementById(`msgWin_${id}`)
	if (i !== null) {
		i.remove()
	}
};
updateFriendArray();
// -- //


// -- //
// HANDLES ADDING PLAYER ID TO COOKIES AND TO LOCAL ARRAY
function addNewFriend(playerid, p) {
	for (let i = 0; i < friends.length; i++) {
		if (friends[i] === playerid) {
			console.log('Friend, ' + playerid + ' already Added!')
			return;
		}
	}
	// PLAYER ID DOES NOT MATCH ANY EXISTING IDS THEN PUSH TO FRIEND ARRAY
	friends.push(playerid)
	savname.push(playerid)
	savname.push(p.name)
	retrieveMessageNumber(playerid)
	document.cookie = (`*${playerid}=${playerid}; expires=${keepCookie}`)
	document.cookie = (`!${playerid}=${p.nameDiv.style.backgroundColor}; expires=${keepCookie}`)
	document.cookie = (`#${playerid}=${p.name}; expires=${keepCookie}`)
	// PUSHES NAME DIV INTO ARRAY FOR FRIEND WINDOW
	nameDiv.push(playerid)
	nameDiv.push(p.nameDiv)
	addToPanel(playerid, p)
}
// -- //

// -- //
// DELETES PLAYER ID FROM COOKIES AND LOCAL ARRAY
function removeFriend(playerid, p) {
	for (let i = 0; i < friends.length; i++) {
		if (friends[i] === playerid) {
			friends.splice(i, 1)
			document.cookie = (`!${playerid}=${p.nameDiv.style.backgroundColor}; expires=${deleteCookie}`)
			document.cookie = (`*${playerid}=${playerid}; expires=${deleteCookie}`)
			document.cookie = (`#${playerid}=${p.name}; expires=${deleteCookie}`)
			removeFromPanel(playerid)
			for (let j = 0; j < nameDiv.length; j++) {
				if (nameDiv[j] === playerid) {
					nameDiv.splice(j + 1, 1)
					nameDiv.splice(j, 1)
				}
			}
		}
	}
}
// -- //
// DEFINES P FOR LATER USE
let PT
// -- //

// -- //
// OBJECTF IS FRIEND STATUS:
let objectf = document.createElement('div');
// -- //

// -- //
// PREVENTS BUTTON FROM ADDING ID TOO MANY TIMES
let selectedFriend = '';
// -- //

// -- //
// SETS INNER HTML BUTTON TEXT AND PLAYER TEXT COLOR
function checkFriendHTML(playerid, p) {
	if (p._id === scriptCreatorId) {
		p.tempName = p.name
		const cursornorm = p.cursorDiv.childNodes;
		cursornorm[0].innerHTML = `${p.name} (SCRIPT OWNER)`
		p.nameDiv.innerHTML = `${p.name} (SCRIPT OWNER)`
		objectf.innerHTML = 'Add Friend'
		cursornorm[0].setAttribute("style", "color: red;")
		let nameColor = p.nameDiv.style.backgroundColor.toString()
		cursornorm[0].style.backgroundColor = nameColor
		p.nameDiv.style.color = 'red'
		return
	} else {
		p.nameDiv.thatid = playerid
		for (let i = 0; i < friends.length; i++) {
			if (friends[i] === playerid && typeof p.cursorDiv === 'object') {
				const cursor = p.cursorDiv.childNodes;
				p.cursorDiv.thatid = playerid
				cursor[0].innerHTML = `${p.name} (Friend)`
				objectf.innerHTML = 'Remove Friend'
				cursor[0].setAttribute("style", "color: lime;")
				let nameColor = p.nameDiv.style.backgroundColor.toString()
				cursor[0].style.backgroundColor = nameColor
				p.nameDiv.innerHTML = `${p.name} (Friend)`
				p.nameDiv.style.color = 'lime'
				return
			}
		}
		if (typeof p.cursorDiv === 'object') {
			if (p.scriptUser === undefined) {
				const cursornorm = p.cursorDiv.childNodes;
				p.cursorDiv.thatid = playerid
				cursornorm[0].innerHTML = `${p.name}`
				p.nameDiv.innerHTML = `${p.name}`
				objectf.innerHTML = 'Add Friend'
				cursornorm[0].setAttribute("style", "color: white;")
				let nameColor = p.nameDiv.style.backgroundColor.toString()
				cursornorm[0].style.backgroundColor = nameColor
				p.nameDiv.style.color = 'white'
			}
			else {
				if (typeof p.cursorDiv === 'object') {
					const cursornorm = p.cursorDiv.childNodes;
					cursornorm[0].innerHTML = `${p.name} (Script User)`
					p.nameDiv.innerHTML = `${p.name} (Script User)`
					objectf.innerHTML = 'Add Friend'
					cursornorm[0].setAttribute("style", "color: orange;")
					let nameColor = p.nameDiv.style.backgroundColor.toString()
					cursornorm[0].style.backgroundColor = nameColor
					p.nameDiv.style.color = 'orange'
				}
			}
		}
	}
}
// -- //

// -- //
// HANDLES SINGLE PLAYER CROWN CLICKER GAME
function startSinglePlayerCrownClicker() {
	if (!inGame) {
		inGame=true
		document.getElementById('minigamesWindow-window').style.visibility='hidden'
		let a = document.createElement('div')
		a.innerText = 'Starting in 3'
		let sl = (($(window).width() / 2) - 300).toString();
		let st = (($(window).height() / 2) - 90).toString();
		a.style = `top: ${st}px;left: ${sl}px;position: fixed;font-weight: bold;font-size: 100px;color: #ffdd00;`
		document.getElementsByClassName('relative')[0].appendChild(a)
		var start = window.setInterval(function () {
			if (a.innerText === 'Starting in 3') {
				a.innerText = 'Starting in 2'
			} else if (a.innerText === 'Starting in 2') {
				a.innerText = 'Starting in 1'
			} else if (a.innerText === 'Starting in 1') {
				a.innerText = 'Starting in 0'
			} else if (a.innerText === 'Starting in 0') {
				a.remove()
				clearInterval(start)
			}
		}, 1000);
		var full = setTimeout(function () {
			let time = 5
			let done
			let numCrowns = 0
			let score = 0
			let scoreText = document.createElement('div')
			document.getElementsByClassName('relative')[0].appendChild(scoreText)
			scoreText.id = 'crownClickScore'
			scoreText.innerText = `Score: ${score.toString()}`
			function updateStuff() {
				scoreText.innerHTML = `<div id="crownClickScore" style="top: 0px; left: 38%; position: fixed; font-weight: bold; font-size: 100px; color: white;">Score: ${score.toString()}<div id="timeText"><div id="crownClickScore" style="top: 0px;position: absolute;font-weight: bold;font-size: 19px;color: white;left: 38%;">Timer: ${time.toString()}</div></div></div>`
			}
			updateStuff()
			var goTime = window.setInterval(function () {
				if (time > 0) {
					time--
					updateStuff()
				}
				if (time == 0) {
				}
			}, 1000)
			var gameTime = window.setInterval(function () {
				let ranxmax = $(window).width() - 50
				let ranxmin = 50
				let ranymax = $(window).height() - 50
				let ranymin = 50
				if (!done) {
					if (time === 0) {
						scoreText.remove()
						$('.crownClick').remove()
						$('.cursorClick').remove()
						done = true
					}
					let cursorChance = Math.floor(Math.random() * (10 - 1) + 1)
					if(cursorChance===7){
						let curRandomX = Math.floor(Math.random() * (ranxmax - ranxmin) + ranxmin);
						let curRandomY = Math.floor(Math.random() * (ranymax - ranymin) + ranymin);
						let cursor = document.createElement('a')
						cursor.innerHTML = '<img width="100" src="https://www.multiplayerpiano.com/cursor.png" style="-webkit-user-drag: none;">'
						cursor.style = `position: fixed;top: ${curRandomY}px;left: ${curRandomX}px;`
						document.getElementsByClassName('relative')[0].appendChild(cursor)
						cursor.className = 'cursorClick'
						cursor.addEventListener('click', function () {
							cursor.remove()
							score=score+10
							updateStuff()

						})
					}
					if (numCrowns < 8) {
						let crown = document.createElement('a')
						crown.innerHTML = '<img width="50" src="https://www.multiplayerpiano.com/crown.png" style="-webkit-user-drag: none;">'
						let randomX = Math.floor(Math.random() * (ranxmax - ranxmin) + ranxmin);
						let randomY = Math.floor(Math.random() * (ranymax - ranymin) + ranymin);
						crown.style = `position: fixed;top: ${randomY}px;left: ${randomX}px;`
						document.getElementsByClassName('relative')[0].appendChild(crown)
						crown.className = 'crownClick'
						crown.addEventListener('click', function () {
							crown.remove()
							numCrowns--
							score++
							updateStuff()
						})
						numCrowns++
					}
				} else {
					let savedData
					updateFriendArray()
					for (let i = 0; i < cookies.length; i++) {
						if (cookies[i][0].includes('crownClickerHighScore')) {
							savedData = true
							if (Number(cookies[i][1]) < score) {
								document.cookie = `crownClickerHighScore=${score}; expires=${keepCookie}`
								cursorClickerScore=score.toString()
								let newHighScore = document.createElement('div')
								document.getElementsByClassName('relative')[0].appendChild(newHighScore)
								newHighScore.id = 'newHighScore'
								newHighScore.innerText = `NEW HIGH SCORE: ${score.toString()}`
								newHighScore.style = 'top: 67%;left: 28%;position: fixed;color: #3ebdbd;font-size: 73px;font-weight: bolder;opacity: 1;'
								var fade = window.setInterval(function(){
									let opacity = Number(newHighScore.style.opacity)
									if(opacity>0){
										opacity=opacity-0.1
										newHighScore.style.opacity = opacity.toString()
									}else{
										newHighScore.remove()
										clearInterval(fade)
									}
								},500)
								break
							} else {
								let newHighScore = document.createElement('div')
								document.getElementsByClassName('relative')[0].appendChild(newHighScore)
								newHighScore.id = 'newHighScore'
								newHighScore.innerText = `NO NEW HIGH SCORE: ${score.toString()}`
								newHighScore.style = 'top: 67%;left: 23%;position: fixed;color: red;font-size: 73px;font-weight: bolder;opacity: 1;'
								var fade = window.setInterval(function(){
									let opacity = Number(newHighScore.style.opacity)
									if(opacity>0){
										opacity=opacity-0.1
										newHighScore.style.opacity = opacity.toString()
									}else{
										newHighScore.remove()
										clearInterval(fade)
									}
								},500)
							}
						}
					}
					if (!savedData) {
						cursorClickerScore=score.toString()
						document.cookie = `crownClickerHighScore=${score}; expires=${keepCookie}`
					}
					clearInterval(goTime)
					clearInterval(gameTime)
					clearInterval(full)
					inGame=false
					$('.crownClick').remove()
					$('.cursorClick').remove()
				}
			}, 550)
		}, 3500)
	}
}
// -- //

// -- //
// SETS INNER HTML BUTTON TEXT AND PLAYER TEXT COLOR
function scriptUser(playerid) {
	let i = MPP.client.ppl
	if (playerid === scriptCreatorId) { return }
	for (const property in i) {
		let j = Object.getOwnPropertyDescriptor(i[property], '_id')
		if (j) {
			if (j.value === playerid) {
				let p = i[property]
				if (!friends.includes(playerid)) {
					p.scriptUser = true
					if (typeof p.cursorDiv === 'object') {
						p.tempName = p.name
						const cursornorm = p.cursorDiv.childNodes;
						cursornorm[0].innerHTML = `${p.name} (Script User)`
						p.nameDiv.innerHTML = `${p.name} (Script User)`
						objectf.innerHTML = 'Add Friend'
						cursornorm[0].setAttribute("style", "color: orange;")
						let nameColor = p.nameDiv.style.backgroundColor.toString()
						cursornorm[0].style.backgroundColor = nameColor
						p.nameDiv.style.color = 'orange'
					}
				}
			}
		}
	}
}
// -- //

// -- //
// ADD FRIEND MENU ITEM:
MPP.client.on('participant added', (p) => {
	setTimeout(function () {
		owncolor = document.getElementsByClassName('name me')[0].style.backgroundColor
	}, 10000)
	ownid = (MPP.client.getOwnParticipant()._id)
	checkFriendHTML(p._id, p)
	if (ws !== undefined && ws.readyState === WebSocket.OPEN) {
		sendMessage('script user', p._id)
	}
	setTimeout(() => {
		p.nameDiv.addEventListener('mousedown', () => {
			PT = p
			selectedFriend = p._id;
			setTimeout(() => {
				objectf.className = 'menu-item'
				checkFriendHTML(p._id, p)
				if (p._id !== ownid) { // PREVENTS CONSOLE ERROR IF PLAYER LEAVES ROOM
					document.getElementsByClassName('participant-menu')[0].appendChild(objectf);
				}
			}, 24);
		});
	}, 24)
});
// -- //

// -- //
// LISTENS FOR CLICK ADD FRIEND
objectf.addEventListener('click', () => {
	if (objectf.innerHTML === 'Add Friend') {
		addNewFriend(selectedFriend, PT)
		checkFriendHTML(selectedFriend, PT)
		sendMessage('update player')

	} else if (objectf.innerHTML === 'Remove Friend') {
		removeFriend(selectedFriend, PT)
		checkFriendHTML(selectedFriend, PT)
		sendMessage('update player')
		if (PT.scriptUser === true && selectedFriend !== scriptCreatorId) {
			let p = PT
			if (typeof p.cursorDiv === 'object') {
				if (!friends.includes(selectedFriend)) {
					const cursornorm = p.cursorDiv.childNodes;
					cursornorm[0].innerHTML = `${p.name} (Script User)`
					p.nameDiv.innerHTML = `${p.name} (Script User)`
					objectf.innerHTML = 'Add Friend'
					cursornorm[0].setAttribute("style", "color: orange;")
					let nameColor = p.nameDiv.style.backgroundColor.toString()
					cursornorm[0].style.backgroundColor = nameColor
					p.nameDiv.style.color = 'orange'
				}
			}
		}
	}
}, 24);
// -- //



// -- //
// LOOKS FOR PREVIOUS COOKIES BY SEARCHING FOR PREFIX: '*'
for (let k = 0; k < cookies.length; k++) {
	if (cookies[k][0].includes('*')) {
		cookiesFound = true
		newsetup = false
		break
	}
}
if (cookiesFound == false) {
}
// -- //

// -- //
// RESTORES SAVED FRIEND ID'S TO LOCAL ARRAY
if (newsetup === false) {
	for (let i = 0; i < cookies.length; i++) {
		if (cookies[i][0].includes('*')) {
			friends.push(cookies[i][0].substr(2, 24))
		};
	}
}
// -- //
// RESTORES SAVED FRIEND COLOR'S TO LOCAL ARRAY
if (newsetup === false) {
	for (let i = 0; i < cookies.length; i++) {
		if (cookies[i][0].includes('!')) {
			bgr.push(cookies[i][0])
			bgr.push(cookies[i][0 + 1])
		};
	}
}
// -- //

// -- //
// RESTORE CURSORCLICKER SCORE
for (let i = 0; i < cookies.length; i++) {
	if (cookies[i][0].includes('crownClickerHighScore')) {
		cursorClickerScore=cookies[i][1]
	}
}
// -- //

// -- //
// RESTORES SAVED FRIEND NAME
if (newsetup === false) {
	for (let i = 0; i < cookies.length; i++) {
		if (cookies[i][0].includes('#')) {
			savname.push(cookies[i][0])
			savname.push(cookies[i][0 + 1])
		};
	}
}
// -- //

// -- //
let found = false
// RESTORES BUTTON STATUS FOR ALLOW FRIEND JOIN
for (let i = 0; i < cookies.length; i++) {
	if (cookies[i][0].includes('^')) {
		if (cookies[i][1] === 'enabled') {
			allowRoom = true
			found = true
		} else if (cookies[i][1] === 'disabled') {
			allowRoom = false
			found = true
		}
		break
	}
}
if (found === false) {
	document.cookie = (`^allowFriendJoin=enabled; expires=${keepCookie}`)
	allowRoom = true
	console.log('here')
}
// -- //

// -- //
// BUTTON COLOR CHANGE FUNCTION:
function cBC(object) {
	if (object.className === 'ugly-button') {
		object.className = 'ugly-button translate stuck';
		gBS = true
	} else {
		object.className = 'ugly-button';
		gBS = false
	};
};
// -- //

// -- //
// PERFORM BUTTON ACTION:
function buttonClicked(object, num) {
	if (num === 1) { //HIDES OR SHOWS FRIENDS WINDOW
		if (document.getElementById('friendsWindow-window').style.visibility == "visible") {
			// CHECKS BUTTON STATUS TO UPDATE IF INCORRECT:
			document.getElementById('friendsWindow-window').style.visibility = "hidden";
		} else {
			document.getElementById('friendsWindow-window').style.visibility = "visible";
		}
	}
	if (num === 2) {
		if (ws === undefined || ws.readyState === WebSocket.CLOSED) {
			ws = new WebSocket(`${WEBSOCKETLOCATION}`);
			addListener()
			sendMessage('update player')
		} else if (ws.readyState === WebSocket.OPEN) {
			ws.close()
		} else if (ws.readyState === WebSocket.CONNECTING) {
		}
	}
	if (num === 3) {
		let s = document.getElementById('settingsWindow-window')
		if (s === null) {
			s = document.createElement('div')
			s.id = 'settingsWindow-window'
			s.className = 'dialog';
			s.style.visibility = 'visible'
			s.style.height = '400px'
			settingsLeft = ($(window).width() / 2).toString();
			settingsTop = (($(window).height() / 2) - 200).toString();
			s.style.top = `${settingsTop}px`
			s.style.left = `${settingsLeft}px`
			document.getElementsByClassName('relative')[0].appendChild(s)
			s.innerText = 'Settings'
			let a = document.createElement('div')
			a.id = 'allowFriendJoin-btn'
			a.className = 'ugly-button'
			if (allowRoom === true) { a.innerText = 'Enabled', a.style.color = 'lime' } else if (allowRoom === false) { a.innerText = 'Disabled', a.style.color = 'red' } else { a.innerText = '-', a.style.color = 'black' }
			a.addEventListener('click', () => {
				if (allowRoom === true) {
					document.cookie = (`^allowFriendJoin=disabled; expires=${keepCookie}`)
					a.innerText = 'Disabled', a.style.color = 'red'
					allowRoom = false
				} else if (allowRoom === false) {
					document.cookie = (`^allowFriendJoin=enabled; expires=${keepCookie}`)
					a.innerText = 'Enabled', a.style.color = 'lime'
					allowRoom = true
				} else if (allowRoom === undefined) {
					a.innerText = 'Try Again', a.style.color = 'black'
				}
			})
			s.appendChild(a)
			createDiv('This button enables/disables your friends from joining your rooms.', s.id, '15px', 'ALLOW FRIENDS TO JOIN')

			let u = document.createElement('div')
			u.id = 'versionNumber'
			u.style = 'font-size: 16px;color: grey;top: 393px;position: absolute;'
			u.innerText = '>Script By MajorH. v1.3.1'
			s.appendChild(u)
			let z = document.createElement('div')
			z.id = 'manualVerify-btn'
			z.className = 'ugly-button'
			let found
			for (let i = 0; i < cookies.length; i++) {
				if (cookies[i][0].includes('&verificationStatus')) {
					if (cookies[i][1] === 'true') {
						found = true
						z.innerText = 'Verified', z.style.color = 'lime'
					} else {
						found = true
						z.innerText = 'Not verified', z.style.color = 'red'
					}
				}
			}
			if (!found) {
				document.cookie = `&verificationStatus=false; expires=${keepCookie}`
				z.innerText = 'Not verified', z.style.color = 'red'
			}
			s.appendChild(z)
			createDiv('Clicking this button will automatically verify your ID if you are not veriifed.', s.id, '15px', 'VERIFY YOUR ID')
			z.addEventListener('click', () => {
				s.style.visibility = 'hidden';
				cDW(verifyUserPrompt, settingsLeft, settingsTop, '400', 'Verify your player ID', 'visibility: visible;overflow-wrap: anywhere;height: 400px')
				sendMessage('check timeout')
				cancelButton = document.createElement('div');
				cancelButton.id = ("cancelButton-btn");
				cancelButton.className = 'ugly-button';
				cancelButton.style.position = 'absolute';
				cancelButton.style.left = ('147px');
				cancelButton.style.top = ('372px');
				cancelButton.innerHTML = 'Cancel';
				messagingInfo = document.createElement('div');
				messagingInfo.id = ('messagingInfo');
				messagingInfo.style.position = 'absolute';
				messagingInfo.style.left = ('8px');
				messagingInfo.style.fontSize = ('large');
				messagingInfo.style.top = ('61px');
				messagingInfo.innerHTML = 'In order to enable direct messaging in MPP you must connect to an external socket. For security reasons you must verify your id. This is a one time process and will permanently assign your IP address to your ID to ensure that messages sent by your ID is actually you. Please wait for the script to connect to websocket.';
				connectingText = document.createElement('div');
				connectingText.id = ('connectingText');
				connectingText.style.position = 'absolute';
				connectingText.style.left = ('28px');
				connectingText.style.fontSize = ('large');
				connectingText.style.top = ('247px');
				connectingText.innerHTML = `Please wait, connecting to websocket`
				if (document.getElementById('verifyUserPrompt-window') !== null) {
					document.getElementById('verifyUserPrompt-window').appendChild(cancelButton);
					document.getElementById('verifyUserPrompt-window').appendChild(messagingInfo);
					document.getElementById('verifyUserPrompt-window').appendChild(connectingText);
				}
				var dots = window.setInterval(function () {
					if (connectingText.innerHTML.length > 39) {
						if (stopDots === true) { return }
						connectingText.innerHTML = "Please wait, connecting to websocket";
					} else {
						if (stopDots === true) { return }
						connectingText.innerHTML += ".";
					}
				}, 100);
				cancelButton.onclick = () => {
					document.getElementById('verifyUserPrompt-window').remove()
				};
			})
			let e = document.createElement('div')
			e.id = 'clearSiteData-btn'
			e.className = 'ugly-button'
			e.innerText = 'CLEAR DATA'
			e.style.color = 'red'
			s.appendChild(e)
			createDiv('This button will CLEAR ALL SITE DATA. This inclues any friend data, message data, etc.', s.id, '15px', 'CLEAR SITE DATA')
			e.addEventListener('click', function () {
				if (document.getElementById('delete-Site-DataWarning') === null) {
					s.style.visibility = 'hidden'
					console.log('clear data')
					let j = document.createElement('div')
					j.className = 'notification classic';
					j.id = 'delete-Site-DataWarning'
					j.style = `height: 292px;top: ${settingsTop}px;left: ${(settingsLeft) - 240}px;position: fixed;width: 500px;overflow-wrap: anywhere;overflow-y: scroll;background-color: rgb(255, 238, 170);`
					document.getElementsByClassName('relative')[0].appendChild(j)
					let x = document.createElement('div')
					x.innerHTML = 'Ⓧ'
					x.className = 'x'
					x.style.top = '17px'
					j.appendChild(x)
					let k = document.createElement('div')
					k.className = 'title'
					k.innerText = 'WARNING THIS WILL DELETE ALL STORED DATA FOR MULTIPLAYER PIANO:'
					j.appendChild(k)
					let p = document.createElement('div')
					p.className = 'text'
					p.innerText = 'Would you like to proceed?'
					j.appendChild(p)
					x.addEventListener('click', () => {
						j.remove()
					})
					let n = document.createElement('div')
					n.id = 'clearSiteDataFINAL-btn'
					n.className = 'ugly-button'
					n.innerText = 'CLEAR DATA'
					n.style = 'top: 246px;left: 182px;position: absolute;'
					j.appendChild(n)
					let clickedOnce = false
					n.addEventListener('click', () => {
						if (!clickedOnce) {
							for (let i = 0; i < friends.length; i++) {
								document.cookie = (`!${friends[i]}=''; expires=${deleteCookie}`)
								document.cookie = (`*${friends[i]}=''; expires=${deleteCookie}`)
								document.cookie = (`#${friends[i]}=''; expires=${deleteCookie}`)
								removeFromPanel(friends[i])
								let id = friends[i]
								let f = MPP.client.ppl
								for (const property in f) {
									let j = Object.getOwnPropertyDescriptor(f[property], '_id')
									if (j) {
										if (j.value === id) {
											let p = f[property]
											if (p.scriptUser === undefined) {
												const cursornorm = p.cursorDiv.childNodes;
												cursornorm[0].innerHTML = `${p.name}`
												p.nameDiv.innerHTML = `${p.name}`
												objectf.innerHTML = 'Add Friend'
												cursornorm[0].setAttribute("style", "color: white;")
												let nameColor = p.nameDiv.style.backgroundColor.toString()
												cursornorm[0].style.backgroundColor = nameColor
												p.nameDiv.style.color = 'white'
											}
											else {
												const cursornorm = p.cursorDiv.childNodes;
												cursornorm[0].innerHTML = `${p.name} (Script User)`
												p.nameDiv.innerHTML = `${p.name} (Script User)`
												objectf.innerHTML = 'Add Friend'
												cursornorm[0].setAttribute("style", "color: orange;")
												let nameColor = p.nameDiv.style.backgroundColor.toString()
												cursornorm[0].style.backgroundColor = nameColor
												p.nameDiv.style.color = 'orange'
											}
										}
									}
								}
								setTimeout(function () {
									var req = indexedDB.deleteDatabase(friends[i]);
									req.onsuccess = function (e) {
										console.log("Deleted database successfully");
										console.log(e)
									};
									req.onerror = function (e) {
										console.log("Couldn't delete database");
										console.log(e)
									};
									req.onblocked = function (e) {
										console.log("Couldn't delete database due to the operation being blocked");
										console.log(e)
									};
								}, 10000)
							}
							document.cookie = (`^allowFriendJoin=true; expires=${keepCookie}`)
							allowRoom = true
							friends = []

							x.style = ''
							p.innerText = 'Site Data Cleared!'
							p.style.color = 'lime'
							k.innerText = 'Data Cleared Successfully.'
							clickedOnce = true
							n.innerText = 'Close'
						} else {
							j.remove()
						}
					})
				}
			})
		} else {
			let a = document.getElementById('allowFriendJoin-btn')
			if (s.style.visibility === 'hidden' && (document.getElementById('verifyUserPrompt-window') === null && document.getElementById('delete-Site-DataWarning') === null)) {
				if (allowRoom === true) { a.innerText = 'Enabled', a.style.color = 'lime' } else if (allowRoom === false) { a.innerText = 'Disabled', a.style.color = 'red' } else { a.innerText = '-', a.style.color = 'black' }
				s.style.visibility = 'visible';
			} else {
				s.style.visibility = 'hidden';
			}
		}
	}
	if (num === 4) {
		if (document.getElementById('minigamesWindow-window') === null && inGame===false) {
			let a = document.createElement('div')
			a.id = 'minigamesWindow-window'
			a.className = 'dialog';
			a.style.visibility = 'visible'
			a.style.height = '400px'
			settingsLeft = ($(window).width() / 2).toString();
			settingsTop = (($(window).height() / 2) - 200).toString();
			a.style.top = `${settingsTop}px`
			a.style.left = `${settingsLeft}px`
			document.getElementsByClassName('relative')[0].appendChild(a)
			a.innerText = 'Minigames'
			let b = document.createElement('a')
			b.id = 'crownClickerGame'
			b.style = 'background-color: rgb(172, 33, 62);color: white;display: block;font-size: 12px;padding-bottom: 10px;padding-left: 10px;padding-right: 10px;'
			a.appendChild(b)
			let c = document.createElement('div')
			b.appendChild(c)
			c.innerHTML = '<img  width="100" src="https://www.multiplayerpiano.com/crown.png">'
			let d = document.createElement('div')
			d.innerText = 'Crown Clicker'
			d.style = 'position: absolute;top: 73px;left: 122px;font-size: 32px;'
			b.appendChild(d)
			updateFriendArray()
			createDiv('Click the crowns and increase your score. Can this game be any easier?', b.id, '15px', `HIGHSCORE: ${cursorClickerScore}`)
			b.addEventListener('click', function () {
				if (document.getElementById('singlePlayer-crownClicker') === null && document.getElementById('multiPlayer-crownClicker') === null) {
					let e = document.createElement('div')
					e.className = 'ugly-button'
					e.innerText = 'Singleplayer'
					e.id = 'singlePlayer-crownClicker'
					e.style='margin-top: 10px;margin-bottom: 10px;'
					b.appendChild(e)
					e.addEventListener('click', function () {
						if(!inGame){
							startSinglePlayerCrownClicker()
						}else{
							if(document.getElementById('inGameAlready')===null){
							let j = document.createElement('div')
							j.className = 'notification classic';
							j.id='inGameAlready'
							j.style = 'height: 292px;top: 33%;right: 36%;position: fixed;width: 500px;overflow-wrap: anywhere;overflow-y: scroll;background-color: rgb(255, 238, 170);'
							document.getElementsByClassName('relative')[0].appendChild(j)
							let x = document.createElement('div')
							x.innerHTML = 'Ⓧ'
							x.className = 'x'
							j.appendChild(x)
							let k = document.createElement('div')
							k.className = 'title'
							k.innerText = 'FINISH OR END CURRENT GAME FIRST'
							j.appendChild(k)
							let p = document.createElement('div')
							p.className = 'text'
							p.innerText = 'Finish or end the game you are in right now before attempting to start a new one.'
							j.appendChild(p)
							x.addEventListener('click', () => {
								j.remove()
							})
						}
					}
					})
					let f = document.createElement('div')
					f.className = 'ugly-button'
					f.innerText = 'Multiplayer'
					f.id = 'multiPlayer-crownClicker'
					b.appendChild(f)
					f.style='margin-top: 10px;margin-bottom: 10px;'
					f.addEventListener('click', function () {

					})
				} else {
					document.getElementById('singlePlayer-crownClicker').remove()
					document.getElementById('multiPlayer-crownClicker').remove()
				}
			})
		} else {
			let i = document.getElementById('minigamesWindow-window')
			if (i.style.visibility === 'visible') {
				i.style.visibility = 'hidden'
			} else if (i.style.visibility === 'hidden' && inGame===false){
				i.style.visibility = 'visible'
				$('a').find('legend').text(`HIGHSCORE: ${cursorClickerScore}`)
			}
		}
	}
};
// -- //

// -- //
// CREATE DIV
function createDiv(inner, append, font, legend) {
	let tempObject = document.createElement('div')
	if (legend !== undefined) {
		let l = document.createElement('legend')
		l.innerText = legend
		l.style.fontSize = '18px'
		document.getElementById(append).appendChild(l)
	}
	tempObject.innerText = inner
	tempObject.style.fontSize = font
	document.getElementById(append).appendChild(tempObject)

}
// -- //

// -- //
// CAN USE THIS FUNCTION TO HIDE OR SHOW OBJECTS
function showObject(visibility, object) {
	document.getElementsByClassName('relative')[visibility].appendChild(object);
}
// -- //

// -- //
// UNIVERSAL CREATE DIALOG WINDOW:
function cDW(object, l, t, h, inner, scroll, id, visibility) {
	if (typeof visibility !== 'number') {
		visibility = 0
	}
	let name = object
	object = document.createElement('div')
	object.id = (name + "-window");
	object.className = "dialog";
	object.style.position = 'absolute';
	object.style.display = 'block';
	object.style.height = (h + 'px');
	object.style = `${scroll}`;
	if (object.id === 'verifyUserPrompt-window') {
		object.style.left = (l + 'px');
		object.style.top = (t + 'px');
	} else {
		object.style.Left = (l + 'px');
		object.style.Top = (t + 'px');
	}
	object.innerHTML = inner;
	if (id === null || id === undefined) {
		id = (name + "-window")
	}
	object.id = id
	document.getElementsByClassName('relative')[visibility].appendChild(object);
};
// -- //

// -- //
// UNIVERSAL CREATE BUTTONS:
function cB(object, l, t, i, visibility, num, loc) {
	if (typeof visibility !== 'number') {
		visibility = 0
	};
	let name = object
	object = document.createElement('div');
	object.id = (name + "-btn");
	object.className = 'ugly-button';
	object.style.position = 'absolute';
	object.style.left = (l + 'px');
	object.style.top = (t + 'px');
	object.innerHTML = i;
	object.onclick = () => {
		buttonClicked(object, num);
	};
	document.getElementsByClassName('relative')[visibility].appendChild(object);
};
// -- //

// -- //
// DO NOT CHANGE, THIS PREVENTS USER FROM SPAMMING SERVER WITH WEBSOCKET CONNECTION REQUESTS.
function clickBuffer() {
	clickable = false
	setTimeout(function () {
		clickable = true
	}, 30000);
}
// -- //


// -- //
// INFORMS PLAYER OF VERIFICATIONS STATUS
function informUser() {
	if (authenticationStatus === undefined || authenticationStatus === null) {
		stopDots = true
		connectingText.style.color = 'red';
		connectingText.innerHTML = "AUTHENTICATION FAILED. REASON: TIMEOUT";
		cancelButton.style.color = 'red';
		cancelButton.innerHTML = 'Failure!';
	}
	if (authenticationStatus === true) {
		stopDots = true
		connectingText.style.color = 'lime';
		connectingText.innerHTML = "AUTHENTICATION SUCCESS. IP TIED TO ID.";
		cancelButton.style.color = 'lime';
		cancelButton.innerHTML = 'Success!';
	}
	if (authenticationStatus === false) {
		stopDots = true
		connectingText.style.color = 'red';
		connectingText.innerHTML = "AUTHENTICATION FAILED. REASON: AUTHORIZATION CODE ERROR.";
		cancelButton.style.color = 'red';
		cancelButton.innerHTML = 'Failure!';
	}
}
// -- //

// -- //
let stopStatusDots
// DETERMINES STATUS OF MESSAGE:
function messageStatus(status, msgid) {
	let b = document.getElementsByClassName(`Sending_${msgid}`)[0]
	if (status === 'Sent') {
		b.className = `Sent_${msgid}`;
		stopStatusDots = true
		b.childNodes[1].innerHTML = 'Status: Sent';
		b.childNodes[1].style = 'text-align: right;font-size: 10px;color: lime;';
	}
	if (status === 'Not Sent') {
		b.className = `Not_Sent_${msgid}`;
		stopStatusDots = true
		b.childNodes[1].innerHTML = 'Status: Not Sent';
		b.childNodes[1].style = 'text-align: right;font-size: 10px;color: red;';
	}
	if (status === 'Saved') {
		b.className = `Saved_${msgid}`;
		stopStatusDots = true
		b.childNodes[1].innerHTML = 'Status: Saved';
		b.childNodes[1].style = 'text-align: right;font-size: 10px;color: orange;';
	}
	if (status === 'Sending') {
		s = document.createElement('div')
		b.appendChild(s)
		s.id = `status_${ownid}`
		s.style = 'text-align: right;font-size: 10px;';
		s.innerHTML = 'Status: Sending';
		var dots = window.setInterval(function () {
			if (s.innerHTML.length > 18) {
				if (stopStatusDots === true) { return }
				s.innerHTML = "Status: Sending";
			} else {
				if (stopStatusDots === true) { return }
				s.innerHTML += ".";
			}
		}, 1000);
	}
}
// -- //

// -- //
let msgs = [];
// CREATE MESSAGE POP UPS ON SCREEN
function createMessageOnScreen(id, msg, verify, color, window, msgid, i) {
	if (!msg.trim()) { return }
	console.log(window, msgid)
	// STORAGE TO INDEXDB
	let f
	let msngerWindow
	if (id === ownid) { f = window.split('_')[1] } else { f = id }
	if (!friends.includes(f)) { retrieveMessageNumber(f) }
	if (msgid === undefined) {
		if (messageIdIndex[`${f}_New`] !== true) {
			messageIdIndex[`${f}_Index`] = messageIdIndex[`${f}_Index`] + 1
		} else {
			messageIdIndex[`${f}_New`] = undefined
		}
		message = {
			msgid: messageIdIndex[`${f}_Index`],
			ID: f,
			message: msg,
			verify: verify,
			color: color
		}
	} else {
		message = {
			msgid: msgid,
			ID: f,
			message: msg,
			verify: verify,
			color: color
		}
	}
	console.log(message.message)
	// EXPERIMENTAL
	if (id === ownid) {
		msngerWindow = document.getElementById(window)
	} else {
		msngerWindow = document.getElementById(`msgWin_${id}`)
	}
	if (msngerWindow === null) {
		i = true
	}
	if (i) {
		let request = indexedDB.open(f)
		request.onupgradeneeded = e => {
			db = e.target.result
			db.createObjectStore(`${f}_Messages`, { keyPath: 'msgid', autoIncrement: true })
			console.log('New Database Created.')
		}
		request.onsuccess = e => {
			db = e.target.result
			const tx = db.transaction(`${f}_Messages`, "readwrite")
			const work = tx.objectStore(`${f}_Messages`)
			work.add(message)
		}
		request.onerror = e => {
			console.error(e.target.error)
		}
	}
	// EXPERIMENTAL

	//END
	if (msngerWindow === null || msngerWindow.style.visibility === 'hidden') {
		if (document.getElementById(`new_msg_${id}`) === null) {
			let i = document.getElementById(id)
			if (i !== null) {
				let j = document.createElement('div')
				i.appendChild(j)
				j.innerText = 'New Message!'
				j.id = `new_msg_${id}`
				j.style = 'text-align: right;font-size: 10px;color: white;'
			} else {
				console.log("Message from someone who isn't friend")
				if (document.getElementById('Unknown_message')) { document.getElementById('Unknown_message').remove() }
				let j = document.createElement('div')
				j.id = 'Unknown_message'
				j.className = 'notification classic';
				j.style = 'height: 292px;top: 33%;right: 36%;position: fixed;width: 500px;overflow-wrap: anywhere;overflow-y: scroll;background-color: rgb(255, 238, 170);'
				document.getElementsByClassName('relative')[0].appendChild(j)
				let x = document.createElement('div')
				x.innerHTML = 'Ⓧ'
				x.className = 'x'
				j.appendChild(x)
				let k = document.createElement('div')
				k.className = 'title'
				k.innerText = `MESSAGE FROM USER: ${id}`
				j.appendChild(k)
				let p = document.createElement('div')
				p.className = 'text'
				p.innerText = `You have received a message from ${window}(${id}) which is as follows: '${msg}'. In order to reply you must add them to friends.`
				p.style = 'font-size: 20px;color: black;'
				j.appendChild(p)
				x.addEventListener('click', () => {
					j.remove()
				})
				let w = document.createElement('div')
				w.className = 'ugly-button'
				w.innerText = 'Add Friend'
				w.style = 'top: 245px;left: 115px;position: absolute;'
				j.appendChild(w)
				w.addEventListener('click', () => {
					let friend = document.createElement("a")
					let bgcolor = color
					friend.innerHTML = window
					friend.id = id
					friend.setAttribute("style", `background-color: ${bgcolor};color: white;display: block;font-size: 12px;padding-bottom: 10px;padding-left: 10px;padding-right: 10px; `)
					document.getElementById('friendsWindow-window').appendChild(friend);
					let find = false
					for (let i = 0; i < friends.length; i++) {
						if (friends[i] === id) {
							find = true
						}
					}
					if (find === false) {
						friends.push(id)
					}
					document.cookie = (`*${id}=${id}; expires=${keepCookie}`)
					document.cookie = (`!${id}=${color}; expires=${keepCookie}`)
					document.cookie = (`#${id}=${window}; expires=${keepCookie}`)
					addClick(friend, id)
					sendMessage('update player')
					let f = MPP.client.ppl
					for (const property in f) {
						let j = Object.getOwnPropertyDescriptor(f[property], '_id')
						if (j) {
							if (j.value === id) {
								let p = f[property]
								if (p.scriptUser === undefined) {
									const cursor = p.cursorDiv.childNodes;
									p.cursorDiv.thatid = playerid
									cursor[0].innerHTML = `${p.name} (Friend)`
									objectf.innerHTML = 'Remove Friend'
									cursor[0].setAttribute("style", "color: lime;")
									let nameColor = p.nameDiv.style.backgroundColor.toString()
									cursor[0].style.backgroundColor = nameColor
									p.nameDiv.innerHTML = `${p.name} (Friend)`
									p.nameDiv.style.color = 'lime'
								}
							}
						}
					}
					j.remove()
				})
				let c = document.createElement('div')
				c.className = 'ugly-button'
				c.innerText = 'Block'
				c.style = 'top: 245px;left: 273px;position: absolute;'
				j.appendChild(c)
				c.addEventListener('click', () => {
					j.remove()
				})
			}
		}
	}
	if (msngerWindow === null) {
		msgs.push(`<SAVEDMESSAGE_${id}>`)
		msgs.push(msg)
		msgs.push(verify)
		msgs.push(color)
	} else {
		v = document.createElement('div')
		v.innerText = msg
		v.id = `msg_${id}`
		if (id === ownid) {
			document.getElementById(window).appendChild(v)
			let windowScroll = document.getElementById(window).scrollHeight
			document.getElementById(window).scrollBy(0, windowScroll)
		} else {
			let tempWindow = document.getElementById(`msgWin_${id}`)
			tempWindow.appendChild(v)
			let windowScroll = tempWindow.scrollHeight
			tempWindow.scrollBy(0, windowScroll)
		}
		if (id === ownid) {
			v.style = `background-color: ${owncolor};color: white;display: block;font-size: 12px;padding-bottom: 10px;padding-left: 10px;padding-right: 10px;user-select: text;`
		} else {
			v.style = `background-color: ${color};color: white;display: block;font-size: 12px;padding-bottom: 10px;padding-left: 10px;padding-right: 10px;user-select: text;`
		}
		if (verify === 'false') {
			let o = document.createElement('div')
			v.appendChild(o)

			o.style = 'text-align: right;font-size: 10px;color: grey;';
			o.innerHTML = 'This user is not verified. Messages may not be from the user.'
		}
		if (v.id === `msg_${ownid}`) {
			// EXPERIMENTAL
			v.className = `Sending_${messageIdIndex[`${f}_Index`].toString()}`
			messageStatus('Sending', messageIdIndex[`${f}_Index`].toString())
			// EXPERIMENTAL
		} else {
			// EXPERIMENTAL
			v.className = `Received_${messageIdIndex[`${f}_Index`].toString()}`;
			// EXPERIMENTAL
		}
	}
}
// -- //

// -- //
// READ DATASTORE DATA
function readMessage(playerid) {
	if (playerid === '-') { return }
	let request = indexedDB.open(playerid)
	request.onsuccess = e => {
		db = e.target.result
		if (!db.objectStoreNames.contains(`${playerid}_Messages`)) { return }
		const tx = db.transaction(`${playerid}_Messages`, "readonly")
		const stuff = tx.objectStore(`${playerid}_Messages`)
		const requestCursor = stuff.openCursor()
		requestCursor.onsuccess = e => {
			const cursor = e.target.result
			if (cursor) {
				createMessageOnScreen(playerid, cursor.value.message, cursor.value.verify, cursor.value.color, null, cursor.value.msgid, false)
				cursor.continue()
			}
		}
	}
	request.onupgradeneeded = e => {
		db = e.target.result
		db.createObjectStore(`${playerid}_Messages`, { keyPath: 'msgid', autoIncrement: true })
	}

	request.onerror = e => {
		console.log(e.target.error)
	}
}
// -- //

// -- //
// FUNCTION TO RETRIEVE MESSAGE NUMBERS
function retrieveMessageNumber(playerid) {
	let request = indexedDB.open(playerid)
	let messageIndex = 0
	let numbers = []
	messageIdIndex[`${playerid}_Index`] = 0
	messageIdIndex[`${playerid}_Created`] = true
	request.onsuccess = e => {
		db = e.target.result
		if (!db.objectStoreNames.contains(`${playerid}_Messages`)) { return }
		const tx = db.transaction(`${playerid}_Messages`, "readonly")
		const stuff = tx.objectStore(`${playerid}_Messages`)
		const requestCursor = stuff.openCursor()
		requestCursor.onsuccess = e => {
			const cursor = e.target.result
			if (cursor) {
				numbers.push(Number(cursor.value.msgid))
				cursor.continue()
			} else {
				messageIdIndex[`${playerid}_Index`] = Math.max(...numbers)
				if (messageIdIndex[`${playerid}_Index`] === -Infinity) { messageIdIndex[`${playerid}_Index`] = 0, messageIdIndex[`${playerid}_New`] = true }
			}
		}
	}
	request.onupgradeneeded = e => {
		db = e.target.result
		db.createObjectStore(`${playerid}_Messages`, { keyPath: 'msgid', autoIncrement: true })
		messageIdIndex[`${playerid}_New`] = true
		messageIdIndex[`${playerid}_Created`] = true
	}

	request.onerror = e => {
		console.log(e.target.error)
	}
}

// -- //

// -- //
// UPDATE PLAYER STATUS:
function updateFriendStatus(id, status) {
	if (document.getElementById(id) === null) { return }
	if (status === 'online') {
		let t = document.getElementById(id)
		if (document.getElementById(`friendOnlineStatus_${id}`) === null) {
			let j = document.createElement('div')
			j.id = `friendOnlineStatus_${id}`
			j.style = 'text-align: right;font-size: 10px;color: lime;';
			j.innerHTML = 'Status: Online';
			t.appendChild(j)
		} else {
			let j = document.getElementById(`friendOnlineStatus_${id}`)
			j.innerHTML = 'Status: Online';
			j.style = 'text-align: right;font-size: 10px;color: lime;';
		}
	} else if (status === 'offline') {
		let t = document.getElementById(id)
		if (document.getElementById(`friendOnlineStatus_${id}`) === null) {
			let j = document.createElement('div')
			j.id = `friendOnlineStatus_${id}`
			j.style = 'text-align: right;font-size: 10px;color: red;';
			j.innerHTML = 'Status: Offline';
			t.appendChild(j)
		} else {
			let j = document.getElementById(`friendOnlineStatus_${id}`)
			j.innerHTML = 'Status: Offline';
			j.style = 'text-align: right;font-size: 10px;color: red;';
		}
	} else if (status === 'unknown') {
		let t = document.getElementById(id)
		if (document.getElementById(`friendOnlineStatus_${id}`) === null) {
			let j = document.createElement('div')
			j.id = `friendOnlineStatus_${id}`
			j.style = 'text-align: right;font-size: 10px;color: white;';
			j.innerHTML = 'Status: Unknown';
			t.appendChild(j)
		} else {
			let j = document.getElementById(`friendOnlineStatus_${id}`)
			j.innerHTML = 'Status: unknown';
			j.style = 'text-align: right;font-size: 10px;color: white;';
		}
	}
}
// -- //

// -- //
// ALLOWS SENDING MESSAGE THROUGH WEBSOCKET:
let verifyRoom
let verifyCode
let authenticationStatus
let responseReceived = false
function sendMessage(param, msg, playerid, msgid) {
	if (ws === undefined) {
		ws = new WebSocket(`${WEBSOCKETLOCATION}`);
		addListener()
	} else if (ws.readyState == WebSocket.CLOSED) {
		ws = new WebSocket(`${WEBSOCKETLOCATION}`);
		addListener()
	} else if (ws.readyState == WebSocket.DISCONNECTING) {
		ws.addEventListener('close', function (e) {
			ws = new WebSocket(`${WEBSOCKETLOCATION}`);
			addListener()
		})
	}
	if (param === 'check timeout') {
		if (clickable === false) {
			console.log('DO NOT SPAM WEBSOCKET WITH REQUESTS.')
			if (document.getElementById('verifyUserPrompt-window')) {
				document.getElementById('verifyUserPrompt-window').remove()
				let j = document.createElement('div')
				j.className = 'notification classic';
				j.style = 'height: 292px;top: 33%;right: 36%;position: fixed;width: 500px;overflow-wrap: anywhere;overflow-y: scroll;background-color: rgb(255, 238, 170);'
				document.getElementsByClassName('relative')[0].appendChild(j)
				let x = document.createElement('div')
				x.innerHTML = 'Ⓧ'
				x.className = 'x'
				j.appendChild(x)
				let k = document.createElement('div')
				k.className = 'title'
				k.innerText = 'SPAM WARNING:'
				j.appendChild(k)
				let p = document.createElement('div')
				p.className = 'text'
				p.innerText = 'Please wait 30 seconds before sending another verification request. If it keeps failing the servers may be down or contact MajorH on discord: @MajorH#6304'
				j.appendChild(p)
				x.addEventListener('click', () => {
					j.remove()
				})
			}
			return
		}
		clickBuffer()

		if (ws.readyState === WebSocket.OPEN) {
			ws.send(`#${ownid}`);
			ws.send(`uDATAid-${ownid}`);
		} else {
			ws.addEventListener('open', function (e) {
				ws.send(`#${ownid}`);
				ws.send(`uDATAid-${ownid}`)
			})
		}
	}
	if (param === 'send message') {
		if (ws.readyState === WebSocket.OPEN) {
			ws.send(`%msg=${msg}; rid=${playerid}; tid=${ownid}; mid=${msgid}; name=${MPP.client.user.name}`)
		} else {
			ws.addEventListener('open', function (e) {
				ws.send(`#${ownid}`);
				ws.send(`%msg=${msg}; rid=${playerid}; tid=${ownid}; mid=${msgid}; name=${MPP.client.user.name}`)
			})
		}
	}
	if (param === 'update player') {
		if (ws.readyState === WebSocket.OPEN) {
			ws.send(`^uDATAid-${ownid}`);
		} else {
			ws.addEventListener('open', function (e) {
				ws.send(`#${ownid}`);
				ws.send(`^uDATAid-${ownid}`);
			})
		}
	}
	if (param === 'join room') {
		if (ws.readyState === WebSocket.OPEN) {
			ws.send(`join room-${playerid}-${ownid}`);
		} else {
			ws.addEventListener('open', function (e) {
				ws.send(`#${ownid}`);
				ws.send(`join room-${playerid}-${ownid}`);
			})
		}
	}
	if (param === 'update names') {
		if (ws.readyState === WebSocket.OPEN) {
			for (let i = 0; i < updateName.length; i++) {
				if (updateName[i].startsWith('!')) {
					ws.send(`updatename:${updateName[i]}`);
				}
			}
		} else {
			ws.addEventListener('open', function (e) {
				if (ws.readyState === 0) {
					ws.addEventListener('open', function (e) {
						for (let i = 0; i < updateName.length; i++) {
							if (updateName[i].startsWith('!')) {
								let name = updateName[i].substr(1)
								ws.send(`updatename:${updateName[i]}`);
							}
						}
					})
				} else {
					for (let i = 0; i < updateName.length; i++) {
						if (updateName[i].startsWith('!')) {
							let name = updateName[i].substr(1)
							ws.send(`updatename:${updateName[i]}`);
						}
					}
				}
			})
		}
	}
	if (param === 'script user') {
		if (ws.readyState === WebSocket.OPEN) {
			if (msg !== ownid) {
				ws.send(`script user:${msg}`);
			}
		} else {
			ws.addEventListener('open', function (e) {
				if (ws.readyState === 0) {
					ws.addEventListener('open', function (e) {
						if (msg !== ownid) {
							ws.send(`#${ownid}`);
							ws.send(`script user:${msg}`);
						}
					})
				} else {
					if (msg !== ownid) {
						ws.send(`#${ownid}`);
						ws.send(`script user:${msg}`);
					}
				}
			})
		}
	}
	if (param === 'send friend names') {
		if (ws.readyState === WebSocket.OPEN) {
			if (msg !== ownid) {
				ws.send(`friendname:${msg}:${playerid}`);
			}
		} else {
			ws.addEventListener('open', function (e) {
				if (ws.readyState === 0) {
					ws.addEventListener('open', function (e) {
						if (msg !== ownid) {
							ws.send(`#${ownid}`);
							ws.send(`friendname:${msg}:${playerid}`);
						}
					})
				} else {
					if (msg !== ownid) {
						ws.send(`#${ownid}`);
						ws.send(`friendname:${msg}:${playerid}`);
					}
				}
			})
		}
	}
}
// -- //

// -- //
// ADDS LISTENERS TO WEBSOCKET CONNECTIONS
function addListener() {
	ws.addEventListener('message', function (e) {
		responseReceived = true
		let ownName
		let friendsloc
		let nameloc = document.getElementsByClassName('name me')
		let ownerloc = document.getElementsByClassName('name me owner')
		if (nameloc === undefined || ownerloc === undefined) { return }
		if (nameloc !== undefined && nameloc !== null) { ownName = nameloc[0].innerText } else { ownName = ownerloc[0].innerText }
		if (friends === undefined) { } else {
			friendsloc = (friends.join('*'))
			friendsloc = `*${friendsloc}`
		}
		if (e.data === 'ID SAVED') {
			ws.send(`uDATAname-${ownName}`)
		}
		if (e.data === 'NAME AND IP SAVED') {
			ws.send(`uDATAfriends-${friendsloc}`)
		}
		if (e.data === 'FRIENDS SAVED') {
			ws.send(`uDATAcolor-${owncolor}`)
		}

		if (e.data.startsWith('AUTHENTICATION REQUEST')) {
			ws.send(`mSETUP-${ownid}`);
			setTimeout(function () {
				if (authenticationStatus == undefined || authenticationStatus == null) {
					console.log('TIMEOUT')
					document.cookie = (`&verificationStatus=false; expires=${keepCookie}`)
					timeout()
					client.stop();
				}
			}, 30000);
		}
		if (e.data.startsWith('*')) {
			verifyCode = e.data
			console.log(verifyCode)
			console.log('Verification Code received.')
		}
		if (e.data.startsWith('!')) {
			console.log('Verification Room received.')
			verifyRoom = e.data.substr(1, 26)
			console.log(verifyRoom)
			setTimeout(function () {
				var client = new Client('wss://www.multiplayerpiano.com:443');
				client.start();
				client.setChannel(verifyRoom);
				client.on('ch', () => {
					console.log('Sending Verification Code.')
					client.sendArray([{ m: 'a', message: `${verifyCode}` }]);
					client.on('a', msg => {
						if (msg.a.toString().toLowerCase().startsWith('user authenticated.')) {
							console.log('Authentication success!')
							authenticationStatus = true
							document.cookie = (`&verificationStatus=true; expires=${keepCookie}`)
							verificationConfirmed()
							let z = document.getElementById('manualVerify-btn')
							if (z) { z.innerText = 'Verified', z.style.color = 'lime' }
							client.stop();
						}
						if (msg.a.toString().toLowerCase().startsWith('could not authenticate.')) {
							console.log('Authentication failure.')
							authenticationStatus = false
							document.cookie = (`&verificationStatus=false; expires=${keepCookie}`)
							verificationFailed()
							client.stop();
						}
					});
				});
			}, 1000);
		}
		if (e.data.startsWith('IDENTITY VERIFIED')) {
			authenticationStatus = true
			alreadyVerified()
			console.log('Identity already verified')
			document.cookie = (`&verificationStatus=true; expires=${keepCookie}`)
			let z = document.getElementById('manualVerify-btn')
			if (z) { z.innerText = 'Verified', z.style.color = 'lime' }
			if (client !== undefined) { client.stop() };
		}
		if (e.data === '^ID SAVED') {
			ws.send(`^uDATAname-${ownName}`)
		}
		if (e.data === '^NAME AND IP SAVED') {
			ws.send(`^uDATAfriends-${friendsloc}`)
		}
		if (e.data === '^FRIENDS SAVED') {
			ws.send(`^uDATAcolor-${owncolor}`)
		}
		if (e.data.includes('Online:')) {
			let temp = e.data.split(' ')
			let tempfriend = temp[1]
			updateFriendStatus(tempfriend, 'online')
		}
		if (e.data.includes('Online:')) {
			let temp = e.data.split(' ')
			let tempfriend = temp[1]

			updateFriendStatus(tempfriend, 'online')
		}
		if (e.data.includes('Offline:')) {
			let temp = e.data.split(' ')
			let tempfriend = temp[1]
			updateFriendStatus(tempfriend, 'offline')
		}
		if (e.data.includes('Unknown:')) {
			let temp = e.data.split(' ')
			let tempfriend = temp[1]
			let status = temp[0]

			updateFriendStatus(tempfriend, 'unknown')
		}
		if (e.data.startsWith('@')) {
			let j = e.data.split(';').map((j => {
				const [key, ...v] = j.split('=');
				return [key, v.join('=')];
			}))


			var msg = j[0][1]
			var tid = j[1][1]
			console.log(tid)
			var verify = j[2][1]
			var tcolor = j[3][1]
			if (j[4]) {
				var tname = j[4][1]
			} else {
				var tname = 'Name Unknown (Player needs to update to latest version)'
			}

			createMessageOnScreen(tid, msg, verify, tcolor, tname, undefined, true)

		}
		if (e.data.startsWith('PLAYER NOT IN DATABASE. ASK THEM TO USE SCRIPT TO MESSAGE.')) {
			let data = e.data.split(',')
			createMessageOnScreen(data[1], data[0], 'true', 'rgb(0, 0, 0)', 'SERVER', undefined, true)
		}
		if (e.data.startsWith('SENT')) {
			let data = e.data.split(' ')
			messageStatus('Sent', data[1])
		}
		if (e.data.startsWith('NOT SENT')) {
			let data = e.data.split(' ')
			messageStatus('Not Sent', data[5])
		}
		if (e.data.startsWith('SAVED')) {
			let data = e.data.split(' ')
			messageStatus('Saved', data[1])
		}
		if (e.data.startsWith('<MSA>')) {
			let announcement = e.data.split(':')
			announcement = announcement[1]
			let j = document.createElement('div')
			j.className = 'notification classic';
			j.style = 'height: 292px;top: 33%;right: 36%;position: fixed;width: 500px;overflow-wrap: anywhere;overflow-y: scroll;background-color: rgb(255, 238, 170);'
			document.getElementsByClassName('relative')[0].appendChild(j)
			let x = document.createElement('div')
			x.innerHTML = 'Ⓧ'
			x.className = 'x'
			j.appendChild(x)
			let k = document.createElement('div')
			k.className = 'title'
			k.innerText = 'SERVER ANNOUNCEMENT FROM CHAT SCRIPT:'
			j.appendChild(k)
			let p = document.createElement('div')
			p.className = 'text'
			p.innerText = announcement
			j.appendChild(p)
			x.addEventListener('click', () => {
				j.remove()
			})

		}
		if (e.data.startsWith('room request')) {
			let i = e.data.split('-')
			let reqid = i[1]
			if (allowRoom === true) {
				console.log(`Room request from: ${reqid}`)
				if (friends.includes(reqid)) {
					console.log('ok its good its in friends')
					ws.send(`final-${window.MPP.client.channel._id}-${reqid}-${ownid}`)
				} else {
					console.log('not in friends list :(')
					ws.send(`request denied:${reqid}:This person does not have you friended.`)
				}
			} else {
				ws.send(`request denied:${reqid}:This person does allow friends to join their rooms.`)
			}
		}
		if (e.data.startsWith('request accepted')) {
			if (roomreq === true) {
				let i = e.data.split('-')
				let room = i[1]
				let reqid = i[2]
				if (friendRoomId.includes(reqid)) {
					window.MPP.client.setChannel(room)
					let k = friendRoomId.indexOf(reqid)
					friendRoomId.splice(k, 1)
					roomreq = false
				}
			} else {
				console.warn('WARNING: An attempt to connect to another room was made from an outside source. There was no request for this.')
			}
		}
		if (e.data.startsWith('request failed')) {
			if (roomreq === true) {
				let data = e.data.split(':')
				let error = data[1]
				errorJoinRoom(error)
				roomreq = false
			} else {
				console.warn('Unkown failed request message received.')
			}
		}
		if (e.data.startsWith('script user')) {
			let i = e.data.split(':')[1]
			scriptUser(i)
		}
		if (e.data.startsWith('newname:')) {
			let id = e.data.split(':')[2]
			let name = e.data.split(':')[1]
			let j = document.getElementById(id)
			if (j !== null) {
				let i = j.childNodes[1]
				j.innerText = name
				if (i !== undefined) {
					console.log(i)
					j.appendChild(i)
				}
				document.cookie = (`#${id}=${name}; expires=${keepCookie}`)
			}
		}
	});
}
// -- //

// -- //
// ERROR HANDLER FOR JOINING ROOM
function errorJoinRoom(error) {
	let i = document.getElementById('friendsWindow-window')
	let j = document.createElement('div')
	j.className = 'notification classic';
	j.style = 'height: 145px;background-color: rgb(255, 238, 170);width: 238px;font-size: 19px;top: 33%;right: 22%;padding-right: 24px;'
	let k = document.createElement('div')
	k.className = 'title'
	k.innerText = 'Could not join room:'
	j.appendChild(k)
	let p = document.createElement('div')
	p.className = 'text'
	p.innerText = error
	j.appendChild(p)
	let x = document.createElement('div')
	x.innerHTML = 'Ⓧ'
	x.className = 'x'
	x.addEventListener('click', () => {
		j.remove()
	})
	j.appendChild(x)
	i.appendChild(j)
}

// -- //

// -- //
let tempname
let tempcolor
// ADDS CLICK TO FRIEND PANEL
function addClick(object, playerid, p) {
	object.addEventListener('click', () => {
		if (document.getElementById(`${playerid}_btn1`) === null) {
			let button1 = document.createElement("div")
			button1.className = 'ugly-button';
			button1.id = `${playerid}_btn1`
			button1.style = "margin-top: 10px;top: 61px;left: 20px;z-index: 10;"
			button1.innerHTML = 'Message';
			document.getElementById(playerid).appendChild(button1);
			button1.addEventListener('click', () => {
				if (document.getElementById('verifyUserPrompt-window') === null) {
					if (document.cookie.includes('&verificationStatus=true') === false) {

						sendMessage('check timeout')

						cDW(verifyUserPrompt, settingsLeft, settingsTop, '400', 'Verify your player ID', 'visibility: visible;overflow-wrap: anywhere;height: 400px')

						cancelButton = document.createElement('div');
						cancelButton.id = ("cancelButton-btn");
						cancelButton.className = 'ugly-button';
						cancelButton.style.position = 'absolute';
						cancelButton.style.left = ('147px');
						cancelButton.style.top = ('372px');
						cancelButton.innerHTML = 'Cancel';


						messagingInfo = document.createElement('div');
						messagingInfo.id = ('messagingInfo');
						messagingInfo.style.position = 'absolute';
						messagingInfo.style.left = ('8px');
						messagingInfo.style.fontSize = ('large');
						messagingInfo.style.top = ('61px');
						messagingInfo.innerHTML = 'In order to enable direct messaging in MPP you must connect to an external socket. For security reasons you must verify your id. This is a one time process and will permanently assign your IP address to your ID to ensure that messages sent by your ID is actually you. Please wait for the script to connect to websocket.';

						connectingText = document.createElement('div');
						connectingText.id = ('connectingText');
						connectingText.style.position = 'absolute';
						connectingText.style.left = ('28px');
						connectingText.style.fontSize = ('large');
						connectingText.style.top = ('247px');
						connectingText.innerHTML = `Please wait, connecting to websocket`
						document.getElementById('verifyUserPrompt-window').appendChild(cancelButton);
						document.getElementById('verifyUserPrompt-window').appendChild(messagingInfo);
						document.getElementById('verifyUserPrompt-window').appendChild(connectingText);
						var dots = window.setInterval(function () {
							if (connectingText.innerHTML.length > 39) {
								if (stopDots === true) { return }
								connectingText.innerHTML = "Please wait, connecting to websocket";
							} else {
								if (stopDots === true) { return }
								connectingText.innerHTML += ".";
							}
						}, 100);

						cancelButton.onclick = () => {
							document.getElementById('verifyUserPrompt-window').remove()
						};
					} else {
						if (document.getElementById(`msgWin_${playerid}`) === null || document.getElementById(`msgWin_${playerid}`) === undefined) {
							msgWindowOpen = true
							document.getElementById('friendsWindow-window').style.visibility = 'hidden';
							cDW(messengerWindow, '0', '0', '400', '', `overflow: hidden scroll;visibility: visible;font-size: 20px;position: absolute;display: block;height: 421px;width: 421px;box-sizing: border-box;overflow-wrap: break-word;top: -319px;left: ${windowSize}px;color: rgb(171, 170, 160);border-bottom-width: 45px;border-top-width: 45px;`, `msgWin_${playerid}`);
							if (document.getElementById(`new_msg_${playerid}`) !== null) {
								document.getElementById(`new_msg_${playerid}`).remove()
							}
							// EXPERIMENTAL
							if (!messageIdIndex[`${playerid}_Created`]) {
								retrieveMessageNumber(playerid)
							}
							readMessage(playerid)

							// EXPERIMENTAL


							// let p = $('div[id^="msgWin_"]')
							// for (let k = 0; k < p.length; k++) {
							// 	if (p[k].id === `msgWin_${playerid}`) {
							// 		console.log('Found, adding event listeners.')
							// 		addListeners();
							// 		let mousedown
							// 		function addListeners() {
							// 			p[k].addEventListener('mousedown', mouseDown, false);
							// 			window.addEventListener('mouseup', mouseUp, false);

							// 		}
							// 		function mouseUp() {
							// 			mousedown = false
							// 			window.removeEventListener('mousemove', divMove, true);
							// 		}

							// 		function mouseDown(e) {
							// 			mousedown = true
							// 			window.addEventListener('mousemove', divMove, true);
							// 		}
							// 		function divMove(e) {
							// 			var div = p[k]
							// 			setTimeout(function () {
							// 				if (mousedown === true) {
							// 					div.style.position = 'absolute';
							// 					div.style.top = (e.clientY - draggable) + 'px';
							// 					div.style.left = (e.clientX) + 'px';
							// 				}
							// 			}, 100)
							// 		}

							// 	}
							// }

							let windowName = document.createElement("div")
							document.getElementById(`msgWin_${playerid}`).appendChild(windowName);
							windowName.id = `nameWindow_${playerid}`;
							windowName.style = `position: fixed;top: ${nameTop}px;left: ${nameLeft}px;`;
							windowName.innerText = tempname


							document.getElementById(`msgWin_${playerid}`).style.color = tempcolor;

							let xbutton = document.createElement("a")
							document.getElementById(`nameWindow_${playerid}`).appendChild(xbutton);
							xbutton.className = 'x';
							xbutton.innerText = 'Ⓧ';
							xbutton.id = `loc_${playerid}`;
							xbutton.style = 'color: red;position: absolute;left: 369px;bottom: -1px;';
							xbutton.onclick = () => {
								document.getElementById(`msgWin_${playerid}`).style.visibility = 'hidden';
								msgWindowOpen = true
								document.getElementById('friendsWindow-window').style.visibility = 'visible';
							};

							let testing = document.createElement("div")
							document.getElementById(`msgWin_${playerid}`).appendChild(testing);
							testing.className = 'notification classic';


							let holder = document.createElement("div")
							document.getElementById(`msgWin_${playerid}`).appendChild(holder);
							holder.style = `position: fixed;top: ${holderTop}px;left: ${holderLeft}px;width: 398px;height: 23px;`;
							holder.id = `sendMsgHolder_${playerid}`
							holder.className = 'dialog'


							let inputBox = document.createElement("input")
							document.getElementById(`msgWin_${playerid}`).appendChild(inputBox);
							inputBox.type = 'text';
							inputBox.name = 'name';
							inputBox.placeholder = 'Send a message';
							inputBox.maxLength = '256';
							inputBox.className = 'msgInputBox';
							inputBox.id = `msgInput_${playerid}`

							inputBox.addEventListener('focus', (event) => {
								currentInput = inputBox.id
							});

							inputBox.style = `position: fixed;top: ${inputTop}px;left: ${inputLeft}px;width: 258px;`;
							let msgopen = false
							document.onmousedown = (evt) => {
								if (evt.target === inputBox) {
									msgopen = true
									$("#chat input").focus();
									document.getElementById('chat').className = 'inputtingText';
								} else {
									msgopen = false
									currentInput = ''
									document.getElementById('chat').className = 'chat chatting';
									document.getElementById('chat').className = 'chat';
									document.getElementById('piano').childNodes[0].click()
								}
							}

							$(document).on("keydown", function (evt) {
								if (evt.keyCode == 13 && currentInput.startsWith('msgInput')) {
									let i = document.getElementById(currentInput)
									console.log(i.value)
									console.log('Send')
									$("#chat input").get(0).blur();
									$("#chat").removeClass("chatting");
									if (inputBox.value.trim()) {
										createMessageOnScreen(ownid, inputBox.value, 'true', owncolor, `msgWin_${playerid}`, undefined, true)
										sendMessage('send message', inputBox.value, playerid, messageIdIndex[`${playerid}_Index`].toString())
									}
									statusM = false
									inputBox.value = '';
									inputBox.focus()
									currentInput = inputBox.id
								}
							});


							let sendButton = document.createElement("div")
							document.getElementById(`msgWin_${playerid}`).appendChild(sendButton);
							sendButton.className = 'ugly-button';
							sendButton.innerText = 'Send';
							sendButton.id = `sendButt_${playerid}`
							sendButton.style = `display: block;position: fixed;color: white;top: ${buttonTop}px;left: ${buttonLeft}px;`;
							sendButton.onclick = () => {
								console.log('Send')
								// EXPERIMENTAL
								if (inputBox.value.trim()) {
									createMessageOnScreen(ownid, inputBox.value, 'true', owncolor, `msgWin_${playerid}`, undefined, true)
									sendMessage('send message', inputBox.value, playerid, messageIdIndex[`${playerid}_Index`].toString())
								}
								// EXPERIMENTAL
								statusM = false
								inputBox.value = '';
							};
						} else {
							document.getElementById(`msgWin_${playerid}`).style.visibility = 'visible';
							if (document.getElementById(`new_msg_${playerid}`) !== null) {
								document.getElementById(`new_msg_${playerid}`).remove()
							}
						}

					}
				}
			}, 24)
			let button2 = document.createElement("div")
			button2.className = 'ugly-button';
			button2.id = `${playerid}_btn2`
			button2.style = "margin-top: 10px;top: 61px;left: 143px;z-index: 10;"
			button2.innerHTML = 'Remove Friend';
			document.getElementById(playerid).appendChild(button2);
			button2.addEventListener('click', () => {

				if (document.getElementById('remove-friend')) { document.getElementById('remove-friend').remove() }
				let j = document.createElement('div')
				j.id = 'remove-friend'
				j.className = 'notification classic';
				j.style = 'height: 292px;top: 33%;right: 36%;position: fixed;width: 500px;overflow-wrap: anywhere;overflow-y: scroll;background-color: rgb(255, 238, 170);'
				document.getElementsByClassName('relative')[0].appendChild(j)
				let x = document.createElement('div')
				x.innerHTML = 'Ⓧ'
				x.className = 'x'
				j.appendChild(x)
				let k = document.createElement('div')
				k.className = 'title'
				k.innerText = `ARE YOU SURE YOU WANT TO REMOVE USER: ${playerid}`
				j.appendChild(k)
				let p = document.createElement('div')
				p.className = 'text'
				p.innerText = `Doing this will clear the message history and remove the friend from your friends list. Are you sure?`
				p.style = 'font-size: 20px;color: black;'
				j.appendChild(p)
				x.addEventListener('click', () => {
					j.remove()
				})
				let w = document.createElement('div')
				w.className = 'ugly-button'
				w.innerText = 'Remove Friend'
				w.style = 'top: 245px;left: 185px;position: absolute;'
				j.appendChild(w)
				w.addEventListener('click', () => {
					removeFromPanel(playerid)
					deleteFriendWindow(playerid)
					let bgcolor
					let name
					for (let i = 0; i < bgr.length; i++) {
						if (bgr[i].includes(playerid)) {
							bgcolor = bgr[i + 1]
						}
					}
					for (let j = 0; j < savname.length; j++) {
						if (savname[j].includes(playerid)) {
							name = savname[j + 1]
						}
					}
					document.cookie = (`!${playerid}=${bgcolor}; expires=${deleteCookie}`)
					document.cookie = (`*${playerid}=${playerid}; expires=${deleteCookie}`)
					document.cookie = (`#${playerid}=${name}; expires=${deleteCookie}`)
					for (let i = 0; i < friends.length; i++) {
						if (friends[i] === playerid) {
							friends.splice(i, 1)
						}
					}

					let i = MPP.client.ppl
					for (const property in i) {
						let j = Object.getOwnPropertyDescriptor(i[property], '_id')
						if (j) {
							if (j.value === playerid) {
								let p = i[property]
								if (p.scriptUser === true) {
									if (typeof p.cursorDiv === 'object') {
										const cursornorm = p.cursorDiv.childNodes;
										cursornorm[0].innerHTML = `${p.name} (Script User)`
										p.nameDiv.innerHTML = `${p.name} (Script User)`
										objectf.innerHTML = 'Add Friend'
										cursornorm[0].setAttribute("style", "color: orange;")
										let nameColor = p.nameDiv.style.backgroundColor.toString()
										cursornorm[0].style.backgroundColor = nameColor
										p.nameDiv.style.color = 'orange'
									}
								} else {
									let playersinroom = document.getElementById('names').children
									let t
									for (let g = 0; g < playersinroom.length; g++) {
										if (playersinroom[g].thatid === playerid) {
											t = playersinroom[g]
											t.innerHTML = name
											t.style.color = 'white'
										}
									}
									let cursorsinroom = document.getElementById('cursors').children
									for (let g = 0; g < cursorsinroom.length; g++) {
										if (cursorsinroom[g].thatid === playerid) {
											let p = cursorsinroom[g]
											p.children[0].innerText = name
											p.children[0].setAttribute("style", "color: white;")
											let nameColor = t.style.backgroundColor.toString()
											p.children[0].style.backgroundColor = nameColor
										}
									}
								}
							}
						}
					}
					console.log('Player Removed')
					sendMessage('update player')
					sendMessage('script user', playerid)
					j.remove()
					var req = indexedDB.deleteDatabase(playerid);
					req.onsuccess = function (e) {
						console.log("Deleted database successfully");
						console.log(e.target.error)
					};
					req.onerror = function (e) {
						console.log("Couldn't delete database");
						console.log(e.target.error)
					};
					req.onblocked = function (e) {
						console.log("Couldn't delete database due to the operation being blocked");
						console.log(e.target.error)
					};
				})
			}, 24)
			let button3 = document.createElement("div")
			button3.className = 'ugly-button';
			button3.id = `${playerid}_btn3`
			button3.style = "margin-top: 10px;top: 61px;left: 143px;z-index: 10;"
			button3.innerHTML = 'Join Room';
			document.getElementById(playerid).appendChild(button3);
			button3.addEventListener('click', () => {
				if (!friendRoomId.includes(playerid)) {
					friendRoomId.push(playerid)
				}
				sendMessage('join room', '', playerid)
				roomreq = true
				setTimeout(function () {
					if (roomreq === true) {
						console.log('Timeout, closing requests')
						roomreq = false
					}
				}, 30000)
			})

		} else {
			menuOpen = false
			tempname = document.getElementById(`${playerid}_btn1`).parentNode.innerHTML
			tempname = tempname.split('<')
			tempname = tempname[0]
			tempcolor = document.getElementById(`${playerid}_btn1`).parentNode.style.backgroundColor
			document.getElementById(`${playerid}_btn1`).remove()
			document.getElementById(`${playerid}_btn2`).remove()
			document.getElementById(`${playerid}_btn3`).remove()
		}
	}, 24)

}
// -- //

// -- //
// FUNCTIONS TO UPDATE VERIFICATION ON PAGE
function timeout() {
	if (authenticationStatus === undefined || authenticationStatus === null) {
		stopDots = true
		connectingText.style.color = 'red';
		connectingText.innerHTML = "AUTHENTICATION FAILED. REASON: TIMEOUT";
		cancelButton.style.color = 'red';
		cancelButton.innerHTML = 'Failure!';
		return
	}
}

function alreadyVerified() {
	stopDots = true
	connectingText.style.color = 'lime';
	connectingText.innerHTML = "YOU HAVE ALREADY BEEN VERIFIED.";
	cancelButton.style.color = 'lime';
	cancelButton.innerHTML = 'Success!';
}

function verificationConfirmed() {
	if (authenticationStatus === true) {
		stopDots = true
		connectingText.style.color = 'lime';
		connectingText.innerHTML = "AUTHENTICATION SUCCESS. IP TIED TO ID.";
		cancelButton.style.color = 'lime';
		cancelButton.innerHTML = 'Success!';
		counter = counter++
		return
	}
}
function verificationFailed() {
	if (authenticationStatus === false) {
		stopDots = true
		connectingText.style.color = 'red';
		connectingText.innerHTML = "AUTHENTICATION FAILED. REASON: AUTHORIZATION CODE ERROR.";
		cancelButton.style.color = 'red';
		cancelButton.innerHTML = 'Failure!';
		return
	}
}
// -- //

// -- //
// ADDS FRIENDS TO FRIENDS PANEL
function addToPanel(playerid, p) {
	if (nameDiv.includes(playerid)) {
		let checkfriend = (document.getElementById(playerid))
		if (checkfriend === null) {
			let index = nameDiv.indexOf(playerid)
			let friend = document.createElement("a")
			let bgcolor = nameDiv[index + 1].style.backgroundColor
			if (!p.scriptUser) {
				friend.innerHTML = nameDiv[index + 1].innerHTML
			} else {
				friend.innerHTML = p.tempName
			}
			let replaced = false
			for (let i = 0; i < updateName.length; i++) {
				if (updateName[i].includes(playerid)) {
					updateName.splice(i, 1, p.name)
					updateName.splice(i, 1, playerid)
					replaced = true
				}
			}
			if (!replaced) {
				updateName.push(`!${name}:${playerid}`)
			}
			friend.id = playerid
			friend.p = p
			friend.setAttribute("style", `background-color: ${bgcolor};color: white;display: block;font-size: 12px;padding-bottom: 10px;padding-left: 10px;padding-right: 10px; `)
			document.getElementById('friendsWindow-window').appendChild(friend);
			addClick(friend, playerid, friend.p)
		}
	}
	sendMessage('update names')
}
// -- //

// LOADS FRIENDS TO PANEL
function loadToPanel() {
	for (let k = 0; k < friends.length; k++) {
		let playerid = friends[k]
		let checkfriend = (document.getElementById(playerid))
		if (checkfriend === null) {
			let bgrcolor
			let name
			for (let i = 0; i < bgr.length; i++) {
				if (bgr[i].includes(playerid)) {
					bgrcolor = bgr[i + 1]
				}
			}
			for (let j = 0; j < savname.length; j++) {
				if (savname[j].includes(playerid)) {
					name = savname[j + 1]
					updateName.push(`!${name}:${playerid}`)
				}
			}
			let friend = document.createElement("a")
			friend.innerHTML = name
			friend.id = playerid
			friend.setAttribute("style", `background-color: ${bgrcolor};color: white;display: block;font-size: 12px;padding-bottom: 10px;padding-left: 10px;padding-right: 10px;`)
			document.getElementById('friendsWindow-window').appendChild(friend);
			addClick(friend, playerid)
		} else {
			console.log('Player Already in Window')
		}
	}
	sendMessage('update names')
}
// -- //

// -- //
// REMOVES FRIENDS FROM FRIEND PANEL
function removeFromPanel(playerid) {
	// EXTRA PRECAUTION WHEN CHECKING NAME REMOVED:
	if (nameDiv.includes(playerid)) {
		let index = nameDiv.indexOf(playerid)
		nameDiv.splice(index, 1)
		nameDiv.splice(index + 1, 1)
	}
	let names = document.getElementById('friendsWindow-window').children
	for (let j = 0; j < names.length; j++) {
		if (names[j].id === playerid) {
			names[j].remove()
			return
		}
	}
	deleteFriendWindow(playerid)
}

// -- //
let test
// -- //
// INITIALIZATION
(function () {
	// RESTARTS CLIENT TO UPDATE WEBAGE
	window.MPP.client[window.MPP.client.user == undefined ? 'start' : 'stop']();
	setTimeout(window.MPP.client['start'](), 1000)
	setTimeout(() => {
		loadToPanel()
	}, 1000);
	setTimeout(() => {
		test = document.getElementById('friendsWindow-window').childNodes
	}, 3000);
	// UPDATES CLIENT CONNECTION TO SERVER EVER 1 SECOND
	window.setInterval(function () {
		if (ws === undefined || ws === 'Websocket') {
			document.getElementById('socketConnection-btn').innerHTML = 'Not Connected';
			document.getElementById('socketConnection-btn').style.color = 'white';
		} else if (ws.readyState === WebSocket.CLOSED) {
			document.getElementById('socketConnection-btn').innerHTML = 'Disconnected';
			document.getElementById('socketConnection-btn').style.color = 'red';
			for (let i = 1; i < test.length; i++) {
				test[i].childNodes[1].innerHTML = '-'
				test[i].childNodes[1].style.color = 'black'
			}
		} else if (ws.readyState === WebSocket.OPEN) {
			document.getElementById('socketConnection-btn').innerHTML = 'Connected';
			document.getElementById('socketConnection-btn').style.color = 'lime';
		} else if (ws.readyState === WebSocket.CONNECTING) {
			document.getElementById('socketConnection-btn').innerHTML = 'Connecting';
			document.getElementById('socketConnection-btn').style.color = 'orange';
		} else if (ws.readyState === WebSocket.DISCONNECTING) {
			document.getElementById('socketConnection-btn').innerHTML = 'Disconnecting';
			document.getElementById('socketConnection-btn').style.color = 'indianred';
			for (let i = 1; i < test.length; i++) {
				test[i].childNodes[1].innerHTML = '-'
				test[i].childNodes[1].style.color = 'black'
			}
		}
	}, 1000)
	// UPDATES PLAYER INFO FILE EVERY 15 MINUTES
	window.setInterval(function () {
		if (ws === undefined || ws === 'Websocket') {
		} else if (ws.readyState === WebSocket.OPEN) {
			sendMessage('update player')
		}
	}, 900000)

	// CREATES FRIEND UI AND CONNECTION STATUS BUTTON
	cDW(friendsWindow, '0', '0', '400', 'Friends', `overflow: hidden scroll;visibility: visible;position: absolute;display: block;height: 400px;top: -319px;left: ${windowSize}px;`)
	cB(friendsButton, '660', '32', 'Friends', 0, 1);
	cB(socketConnection, '780', '32', 'Not Connected', 0, 2);
	cB(settingsButton, '779', '3', 'Settings', 0, 3);
	cB(miniGames, '900', '32', 'Minigames', 0, 4);
	window.addEventListener('resize', function () {
		holderLeft = ($(window).width() - 260).toString()
		holderTop = ($(window).height() - 7).toString()
		inputLeft = ($(window).width() - 449).toString()
		inputTop = ($(window).height() - 43).toString()
		buttonLeft = ($(window).width() - 174).toString()
		buttonTop = ($(window).height() - 46).toString()
		windowSize = ($(window).width() - 261)
		nameLeft = ($(window).width() - 453).toString();
		nameTop = ($(window).height() - 425).toString();
		settingsLeft = ($(window).width() / 2).toString();
		settingsTop = (($(window).height() / 2) - 200).toString();
		let j = ($(window).width() - 261)
		draggable = ($(window).height() + 10);
		let w = document.getElementById('settingsWindow-window')
		let z = document.getElementById('verifyUserPrompt-window')
		let score = document.getElementById('crownClickScore')
		if (score) {
			score.style.left = '38%'
		}
		if (w) {
			w.style.left = `${settingsLeft}px`
			w.style.top = `${settingsTop}px`
		}
		if (z) {
			z.style.left = `${settingsLeft}px`
			z.style.top = `${settingsTop}px`
		}
		document.getElementById('friendsWindow-window').style.left = `${j}px`
		let i = document.getElementsByClassName('relative')[0].childNodes
		if (i === undefined) {
			console.log(undefined)
			return
		} else {
			for (let k = 0; k < i.length; k++) {
				if (i[k].id !== undefined) {
					if (i[k].id.startsWith('msgWin')) {
						i[k].style.left = `${j}px`
						let childElements = i[k].childNodes
						for (let o = 0; o < childElements.length; o++) {
							if (childElements[o].id.startsWith('msgInput')) {
								childElements[o].style.left = `${inputLeft}px`
								childElements[o].style.top = `${inputTop}px`
							}
							if (childElements[o].id.startsWith('sendMsgHolder')) {
								childElements[o].style.left = `${holderLeft}px`
								childElements[o].style.top = `${holderTop}px`
							}
							if (childElements[o].id.startsWith('sendButt')) {
								childElements[o].style.left = `${buttonLeft}px`
								childElements[o].style.top = `${buttonTop}px`
							}
							if (childElements[o].id.startsWith('nameWindow')) {
								childElements[o].style.left = `${nameLeft}px`
								childElements[o].style.top = `${nameTop}px`
							}
						}
					}
				}
			}
		}

	})

	addListeners();
	let mousedown
	function addListeners() {
		document.getElementById('friendsWindow-window').addEventListener('mousedown', mouseDown, false);
		window.addEventListener('mouseup', mouseUp, false);

	}
	function mouseUp() {
		mousedown = false
		window.removeEventListener('mousemove', divMove, true);
	}

	function mouseDown(e) {
		mousedown = true
		window.addEventListener('mousemove', divMove, true);
	}
	function divMove(e) {
		var div = document.getElementById('friendsWindow-window');

		setTimeout(function () {
			if (mousedown === true) {
				div.style.position = 'absolute';
				div.style.top = (e.clientY - draggable) + 'px';
				div.style.left = (e.clientX) + 'px';
			}
		}, 100)
	}
	// UPDATE PLAYERDATA WHEN NAME CHANGED
	let submit = document.getElementsByClassName('submit')
	for (let i = 0; i < submit.length; i++) {
		if (submit[i].innerText === 'USER SET') {
			submit[i].addEventListener('click', () => {
				sendMessage('update player')
				setTimeout(function () {
					sendMessage('send friend names', 'null', ownid)
				}, 1000)
			})
		}
	}
	for (let i = 0; i < friends.length; i++) {
		retrieveMessageNumber(friends[i])
	}
})();
// -- //
