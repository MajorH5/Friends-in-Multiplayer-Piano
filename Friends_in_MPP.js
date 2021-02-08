// ==UserScript==
// @name         Multiplayer Piano ADD-ON
// @namespace    http://tampermonkey.net/
// @version      1.6
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
let verifyClient
let cleared
let hasdata
let fakeOwner = false
let sharedPermissions = []
let disablePopups
let currentlySharing
let gotVersionNo
let scriptWebsite = 'https://raw.githubusercontent.com/MajorH5/Friends-in-Multiplayer-Piano/main/Friends_in_MPP.js'
let versionNo = '1.6'
let authenticationStatus
let time
let fCrown = document.createElement('div')
fCrown.innerHTML = '<img src="https://i.imgur.com/Z6GELiE.png" style="position: absolute;top: -8px;left: 4px;">'
fCrown.id = 'thatFakeCrown'
let multiplayerScore = 0
let multiplayerCrownAmmount = 0
let multiplayerGameStatus = false
let allowGameRequest = true
let cursorClickerScore = '0'
let gameKey
let alreadySetup = false
let gameWasCanceled = false
let debuggingMode = false
let inGame = false
let scriptCreatorId = '60d7080bbfbaf5356c6fac89'
let currentInput
let mouseInInput
let playingMultiplayerCrownClicker = false
let currentlyPlaying = ''
let newsetup;
let cookies;
let join
let roomSetObserve
let friends = [];
let bgr = []
let savname = [];
let friendsWindow = 'friendsWindow';
let messengerWindow = 'messengerWindow';
let friendsButton = 'friendsButton';
let verifyUserPrompt = 'verifyUserPrompt';
let cancelButton = 'cancelButton';
let settingsButton = 'settingsButton';
let debugWindow = 'debugWindow'
let miniGames = 'miniGames';
let cookieFriendLocation;
let addFriend = 'addFriend';
let connectingText
let userVerifyCode
let messagingInfo;
let cookiesFound = false;
let WEBSOCKETLOCATION = 'wss://mppchatclient.info:8080/';
// WEBSOCKETLOCATION = 'ws://localhost:50/'
let clickable = true
let iloc;
let jloc;
let pendingRequest = false;
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
let addlisten;
let friendRoomId = [];
let roomreq
let allowRoom
let updateName = []
let allowGameInitation = false
let timerInterval
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
		ws.addEventListener('message', function (m) {
			const f = JSON.parse(m.data)
			switch (f.command) {
				case 'hasdata':
					hasdata = true
					break;
				case 'cleared':
					hasdata = true
					cleared = true
					sendMessage('get status')
					checkPeople()
					addListener()
					let z = $('#manualVerify-btn')[0]
					if (z) {
						z.style.color = 'lime', z.innerText = 'Verified'
					}
					break;
			}
		})
		setTimeout(function () {
			(!hasdata) ? (sendMessage('update player'), addListener()) : (undefined);
			(!cleared) ? (sendMessage('check timeout'), addListener()) : (undefined);
		}, 3000)
	})
}, 3000);
let stopDots;
let counter = 1;
let msgWindowOpen = false;

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

function checkPeople() {
	for (const property in MPP.client.ppl) sendMessage('script user', MPP.client.ppl[property]._id);
}

// -- //
// HANDLES ADDING PLAYER ID TO COOKIES AND TO LOCAL ARRAY
function addNewFriend(playerid, p) {
	for (let i = 0; i < friends.length; i++) {
		if (friends[i] === playerid) {
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
// ATTACH MESSAGE TO DEBUG WINDOW
function debug(data) {
	let debugWindow = document.getElementById('debugWindow-window')
	if (debuggingMode && debugWindow !== null) {
		let message = document.createElement('div')
		message.style = 'background-color: white;color: black;display: block;font-size: 12px;padding-bottom: 10px;padding-left: 10px;padding-right: 10px;'
		message.innerText = data
		debugWindow.appendChild(message)
	}
}
// -- //

function checkRoomOwner(p) {
	if (sharedPermissions.includes(p._id) && MPP.client.channel.crown.userId == MPP.client.getOwnParticipant()._id) {
		if (!p.nameDiv.innerHTML.includes('thatFakeCrown')) {
			p.nameDiv.appendChild(fCrown)
		}
	}
}

MPP.client.on('participant update', (p) => {
	checkFriendHTML(p._id, p)
})
// -- //
// SETS INNER HTML BUTTON TEXT AND PLAYER TEXT COLOR
function checkFriendHTML(playerid, p) {
	if (p.tag && (p._id !== MPP.client.getOwnParticipant()._id)) {
		switch (p.tag) {
			case 'owner':
				p.tempName = p.name
				const cursornorm = p.cursorDiv.childNodes;
				cursornorm[0].innerHTML = `${p.name} (SCRIPT OWNER)`
				p.nameDiv.innerHTML = `${p.name} (SCRIPT OWNER)`
				cursornorm[0].setAttribute("style", "color: red;")
				let nameColor = p.nameDiv.style.backgroundColor.toString()
				cursornorm[0].style.backgroundColor = nameColor
				p.nameDiv.style.color = 'red'
				break;
			case 'betatester':
				p.tempName = p.name
				const cursornormt = p.cursorDiv.childNodes;
				cursornormt[0].innerHTML = `${p.name} (BETA TESTER)`
				p.nameDiv.innerHTML = `${p.name} (BETA TESTER)`
				cursornormt[0].setAttribute("style", "color: blue;")
				let nameColort = p.nameDiv.style.backgroundColor.toString()
				cursornormt[0].style.backgroundColor = nameColort
				p.nameDiv.style.color = 'blue'
				break;
		}
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
				checkRoomOwner(p)
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
				checkRoomOwner(p)
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
					checkRoomOwner(p)
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
		inGame = true
		document.getElementById('minigamesWindow-window').style.visibility = 'hidden'
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
			let time = 30
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
					if (cursorChance === 7) {
						let curRandomX = Math.floor(Math.random() * (ranxmax - ranxmin) + ranxmin);
						let curRandomY = Math.floor(Math.random() * (ranymax - ranymin) + ranymin);
						let cursor = document.createElement('a')
						cursor.innerHTML = '<img width="100" src="https://www.multiplayerpiano.com/cursor.png" style="-webkit-user-drag: none;">'
						cursor.style = `position: fixed;top: ${curRandomY}px;left: ${curRandomX}px;`
						document.getElementsByClassName('relative')[0].appendChild(cursor)
						cursor.className = 'cursorClick'
						cursor.addEventListener('click', function () {
							cursor.remove()
							score = score + 10
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
								cursorClickerScore = score.toString()
								let newHighScore = document.createElement('div')
								document.getElementsByClassName('relative')[0].appendChild(newHighScore)
								newHighScore.id = 'newHighScore'
								newHighScore.innerText = `NEW HIGH SCORE: ${score.toString()}`
								newHighScore.style = 'top: 67%;left: 28%;position: fixed;color: #3ebdbd;font-size: 73px;font-weight: bolder;opacity: 1;'
								var fade = window.setInterval(function () {
									let opacity = Number(newHighScore.style.opacity)
									if (opacity > 0) {
										opacity = opacity - 0.1
										newHighScore.style.opacity = opacity.toString()
									} else {
										newHighScore.remove()
										clearInterval(fade)
									}
								}, 500)
								break
							} else {
								let newHighScore = document.createElement('div')
								document.getElementsByClassName('relative')[0].appendChild(newHighScore)
								newHighScore.id = 'newHighScore'
								newHighScore.innerText = `NO NEW HIGH SCORE: ${score.toString()}`
								newHighScore.style = 'top: 67%;left: 23%;position: fixed;color: red;font-size: 73px;font-weight: bolder;opacity: 1;'
								var fade = window.setInterval(function () {
									let opacity = Number(newHighScore.style.opacity)
									if (opacity > 0) {
										opacity = opacity - 0.1
										newHighScore.style.opacity = opacity.toString()
									} else {
										newHighScore.remove()
										clearInterval(fade)
									}
								}, 500)
							}
						}
					}
					if (!savedData) {
						cursorClickerScore = score.toString()
						document.cookie = `crownClickerHighScore=${score}; expires=${keepCookie}`
					}
					clearInterval(goTime)
					clearInterval(gameTime)
					clearInterval(full)
					inGame = false
					$('.crownClick').remove()
					$('.cursorClick').remove()
					sendMessage('update leaderboards', score, 'crownclicker')
				}
			}, 550)
		}, 3500)
	}
}
// -- //

function createPopup(title, text, id) {
	let j = document.createElement('div')
	j.className = 'notification classic';
	(id) ? (j.id = id) : (undefined);
	j.style = 'height: 292px;top: 33%;right: 36%;position: fixed;width: 500px;overflow-wrap: anywhere;overflow-y: scroll;background-color: rgb(255, 238, 170);'
	document.getElementsByClassName('relative')[0].appendChild(j)
	let x = document.createElement('div')
	x.innerHTML = 'Ⓧ'
	x.className = 'x'
	j.appendChild(x)
	let k = document.createElement('div')
	k.className = 'title'
	k.innerText = title
	j.appendChild(k)
	let p = document.createElement('div')
	p.className = 'text'
	p.innerText = text
	j.appendChild(p)
	x.addEventListener('click', () => {
		j.remove()
	})
	return ({ popup: j, xbutton: x })
}

// -- //
// SETS INNER HTML BUTTON TEXT AND PLAYER TEXT COLOR
function scriptUser(playerid, hsa, tag, sound) {
	let p
	let i = MPP.client.ppl
	for (const property in i) {
		let j = Object.getOwnPropertyDescriptor(i[property], '_id')
		if (j) {
			if (j.value === playerid) {
				p = i[property]
				p.scriptUser = true
				if (sound) {
					p.soundSelection = sound
				}
				switch (tag) {
					case 'owner':
						p.tempName = p.name
						const cursornorm = p.cursorDiv.childNodes;
						cursornorm[0].innerHTML = `${p.name} (SCRIPT OWNER)`
						p.nameDiv.innerHTML = `${p.name} (SCRIPT OWNER)`
						cursornorm[0].setAttribute("style", "color: red;")
						let nameColor = p.nameDiv.style.backgroundColor.toString()
						cursornorm[0].style.backgroundColor = nameColor
						p.nameDiv.style.color = 'red'
						p.tag = 'owner'
						return;
					case 'betatester':
						p.tempName = p.name
						const cursornormt = p.cursorDiv.childNodes;
						cursornormt[0].innerHTML = `${p.name} (BETA TESTER)`
						p.nameDiv.innerHTML = `${p.name} (BETA TESTER)`
						cursornormt[0].setAttribute("style", "color: blue;")
						let nameColort = p.nameDiv.style.backgroundColor.toString()
						cursornormt[0].style.backgroundColor = nameColort
						p.nameDiv.style.color = 'blue'
						p.tag = 'betatester'
						return;
					default:
						if (!friends.includes(playerid)) {
							if (typeof p.cursorDiv === 'object') {
								p.tempName = p.name
								const cursornormf = p.cursorDiv.childNodes;
								cursornormf[0].innerHTML = `${p.name} (Script User)`
								p.nameDiv.innerHTML = `${p.name} (Script User)`
								objectf.innerHTML = 'Add Friend'
								cursornormf[0].setAttribute("style", "color: orange;")
								let nameColor = p.nameDiv.style.backgroundColor.toString()
								cursornormf[0].style.backgroundColor = nameColor
								p.nameDiv.style.color = 'orange'
							}
						}
						return;
				}
			}
		}
	}
	// (hsa) ? (p.appendChild(fCrown)) : (undefined);
}
// -- //

// -- //
// ADD FRIEND MENU ITEM:
MPP.client.on('participant added', (p) => {
	ownid = (MPP.client.getOwnParticipant()._id)
	if (MPP.client.channel.crown) {
		if (sharedPermissions.includes(p._id) && MPP.client.channel.crown.userId == MPP.client.getOwnParticipant()._id) {
			if (!p.nameDiv.innerHTML.includes('thatFakeCrown')) {
				p.nameDiv.appendChild(fCrown)
			}
		}
	}
	checkFriendHTML(p._id, p)
	if (ws !== undefined && ws.readyState === WebSocket.OPEN) {
		sendMessage('script user', p._id)
	}
	setTimeout(() => {
		p.nameDiv.addEventListener('mousedown', (e) => {
			let kickban = document.createElement('div')
			kickban.style.backgroundColor = p.nameDiv.backgroundColor
			kickban.className = 'menu-item'
			kickban.innerText = 'Kickban'
			let sound
			if (p.soundSelection) {
				sound = document.createElement('div')
				sound.style.backgroundColor = p.nameDiv.backgroundColor
				sound.className = 'menu-item'
				sound.innerText = `Using: ${p.soundSelection}`
			}
			PT = p
			selectedFriend = p._id;
			setTimeout(() => {
				objectf.className = 'menu-item'
				checkFriendHTML(p._id, p)
				if (p._id !== ownid && e.target.parentNode.id !== 'thatFakeCrown') { // PREVENTS CONSOLE ERROR IF PLAYER LEAVES ROOM
					if (fakeOwner == true && !(MPP.client.channel.crown.userId == MPP.client.getOwnParticipant()._id)) {
						document.getElementsByClassName('participant-menu')[0].appendChild(kickban);
						kickban.addEventListener('click', function () {
							var minutes = prompt("How many minutes? (0-60)", "30");
							if (minutes === null) return;
							minutes = parseFloat(minutes) || 0;
							var ms = minutes * 60 * 1000;
							sendMessage('kick user', p._id, MPP.client.channel.crown.userId, ms)
						})
					}
					document.getElementsByClassName('participant-menu')[0].appendChild(objectf);
					if (sound) {
						document.getElementsByClassName('participant-menu')[0].appendChild(sound);
					}
				} else if (e.target.parentNode.id == 'thatFakeCrown') {
					if (sharedPermissions.includes(p._id) && MPP.client.channel.crown.userId == MPP.client.getOwnParticipant()._id) {
						let i = sharedPermissions.indexOf(p._id)
						sharedPermissions.splice(i, 1)
						for (let i = 0; i < p.nameDiv.childNodes.length; i++) {
							if (p.nameDiv.childNodes[i].id == 'thatFakeCrown') {
								p.nameDiv.childNodes[i].remove()
							}
						}
						sendMessage('remove permissions', p._id)
					}
				}
			}, 24);
		});
	}, 24)
});
// -- //

// -- //
// LISTENS FOR ROOM JOIN AND CHECK IF CROWN TO ADD CROWN THING
MPP.client.on('ch', function () {
	if (currentlySharing) {
		if (!MPP.client.channel.crown) { return (removeRoomSettings()) }
		if (MPP.client.channel.crown.userId == MPP.client.getOwnParticipant()._id) { return }
		if (currentlySharing !== MPP.client.channel.crown.userId) { return (removeRoomSettings()) } else {
			fakeOwner = true
			makeRoomSettings()
		}
	} else {
		removeRoomSettings()
	}
	if ((MPP.client.channel.crown) && MPP.client.channel.crown.userId == MPP.client.getOwnParticipant()._id) {
		if (document.getElementById('shareRoomOwnershipCrown') !== null) {
			document.getElementById('shareRoomOwnershipCrown').remove()
			generatePseudoCrown()
		} else {
			generatePseudoCrown()
		}
	} else {
		if (document.getElementById('shareRoomOwnershipCrown') !== null) {
			document.getElementById('shareRoomOwnershipCrown').remove()
		}
	}
	if (fakeOwner) {
		let nameThing = MPP.client.getOwnParticipant().nameDiv
		nameThing.appendChild(fCrown)
	}
})
// -- //

function gatherParse() {
	const a = $("#room-settings .checkbox[name=visible]").prop("checked");
	const b = $("#room-settings .checkbox[name=chat]").prop("checked");
	const c = $("#room-settings .checkbox[name=crownsolo]").prop("checked");
	const d = $("#room-settings input[name=color]").val()
	const obj = {
		color: d,
		chat: b,
		crownsolo: c,
		visible: a
	}
	return (obj)
}

function makeRoomSettings() {
	function openModal(selector, focus) {
		$(document).on("keydown");
		$("#modal #modals > *").hide();
		$("#modal").fadeIn(250);
		$(selector).show();
		setTimeout(function () {
			$(selector).find(focus).focus();
		}, 100);
	};
	$("#room-settings-btn").show();
	$("#room-settings-btn").click(function () {
		openModal("#room-settings");
	});
	let j
	let x = $('.submit')
	for (let i = 0; i < x.length; i++) { (x[i].innerText == 'APPLY') ? (j = x[i]) : (undefined) }
	j.addEventListener('click', ferfe)
	var element = document.querySelector('#room-settings-btn');
	roomSetObserve = new MutationObserver(function (mutations) {
		mutations.forEach(function (mutation) {
			if (mutation.type == "attributes" && fakeOwner) {
				$('#room-settings-btn').show();
			}
		});
	});
	roomSetObserve.observe(element, {
		attributes: true
	});
}

function ferfe() {
	sendMessage('change room set', gatherParse())
}

function removeRoomSettings() {
	fakeOwner = false
	if (!roomSetObserve) { return }
	if (!MPP.client.channel.crown) { return }
	roomSetObserve.disconnect();
	let j
	let x = $('.submit')
	for (let i = 0; i < x.length; i++) { (x[i].innerText == 'APPLY') ? (j = x[i]) : (undefined) }
	j.removeEventListener('click', ferfe)
	if (MPP.client.getOwnParticipant()._id !== MPP.client.channel.crown.userId) {
		$('#room-settings-btn').hide();
	}
}

// -- //
// LISTENS FOR CLICK ADD FRIEND
objectf.addEventListener('click', () => {
	if (objectf.innerHTML === 'Add Friend') {
		addNewFriend(selectedFriend, PT)
		checkFriendHTML(selectedFriend, PT)
		sendMessage('update friends')
		sendMessage('get status')

	} else if (objectf.innerHTML === 'Remove Friend') {
		removeFriend(selectedFriend, PT)
		checkFriendHTML(selectedFriend, PT)
		sendMessage('update friends')
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
		cursorClickerScore = cookies[i][1]
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
// RESTORES SAVED DISABLE POPUP STATUS FOR SETTINGS WINDOW
let thingFound
if (newsetup === false) {
	for (let i = 0; i < cookies.length; i++) {
		if (cookies[i][0].includes('%')) {
			if (cookies[i][1] === 'true') {
				disablePopups = true
				thingFound = true
			} else if (cookies[i][1] === 'false') {
				disablePopups = false
				thingFound = true
			}
		};
	}
}
if (!thingFound) {
	document.cookie = '%disablePopups=false'
}
// -- //

// -- //
// HIDES OTHER WINDOWS WHEN NEW ONE IS OPEN
function hideWindows(i) {
	let settingwin = document.getElementById('settingsWindow-window')
	let crownmul = document.getElementById('crownClickerMultiplayer-window')
	let mulplaty = document.getElementById('minigamesWindow-window')
	let crownLeader = document.getElementById('crownClickerLeaderboardWindow-window')
	if (settingwin !== null && settingwin.style.visibility == 'visible' && i !== 'settings') {
		settingwin.style.visibility = 'hidden'
	}
	if (crownmul !== null && crownmul.style.visibility == 'visible' && i !== 'crownmul') {
		crownmul.style.visibility = 'hidden'
	}
	if (mulplaty !== null && mulplaty.style.visibility == 'visible' && i !== 'mulplaty') {
		mulplaty.style.visibility = 'hidden'
	}
	if (crownLeader !== null && crownLeader.style.visibility == 'visible' && i !== 'crownLeader') {
		crownLeader.style.visibility = 'hidden'
	}
}
// -- //

function createWebsocketError(e) {
	if ($('#errorFromWebsocket')[0]) { $('#errorFromWebsocket')[0].remove() }
	let j = document.createElement('div')
	j.id = 'errorFromWebsocket'
	j.className = 'notification classic';
	j.style = 'opacity: 1;height: 115px;top: -12%;right: 36%;position: fixed;width: 500px;overflow-wrap: anywhere;overflow-y: scroll;background-color: rgb(255, 238, 170);'
	document.getElementsByClassName('relative')[0].appendChild(j)
	let x = document.createElement('div')
	x.innerHTML = 'Ⓧ'
	x.className = 'x'
	j.appendChild(x)
	let k = document.createElement('div')
	k.className = 'title'
	k.innerText = 'Error from server:'
	j.appendChild(k)
	let p = document.createElement('div')
	p.className = 'text'
	p.innerText = e
	j.appendChild(p)
	x.addEventListener('click', () => {
		j.remove()
	})
	j.addEventListener('click', () => {
		j.remove()
	})
	var animation = 0
	let animate = window.setInterval(function () {
		if (animation == 13) {
			clearInterval(animate)
			setTimeout(function () {
				let fade = 0
				let fadeout = window.setInterval(function () {
					if (fade == 10) { clearInterval(fadeout) }
					let opacity = Number(j.style.opacity)
					const newop = opacity - 0.1
					if (j !== null) {
						j.style.opacity = newop.toString()
					}
					fade++
				}, 10)
			}, 5000)
		}
		let c = Number(j.style.top.split('%')[0])
		const f = c + 1
		if (j !== null) {
			j.style.top = `${f.toString()}%`
		}
		animation++
	}, 10)

	return ({ popup: j, xbutton: x })
}

function sendCrownPermissions(node) {
	let g = []
	function divMove(e) {
		var div = document.getElementById('fakeCrownClone');
		if (mousedown === true) {
			addCrownAnimation(div)
			div.style.position = 'absolute';
			div.style.top = (e.clientY - 923) + 'px';
			div.style.left = (e.clientX - 15) + 'px';
		}
	}
	window.removeEventListener('mousemove', divMove, true)
	// FUNCTION FROM GITHUB.
	// CREDITS: https://gist.github.com/jtsternberg/c272d7de5b967cec2d3d
	function detect(div1, div2) {
		// Div 1 data
		var d1_offset = $(div1).offset();
		var d1_height = $(div1).outerHeight(true);
		var d1_width = $(div1).outerWidth(true);
		var d1_distance_from_top = d1_offset.top + d1_height;
		var d1_distance_from_left = d1_offset.left + d1_width;
		// Div 2 data
		var d2_offset = $(div2).offset();
		var d2_height = $(div2).outerHeight(true);
		var d2_width = $(div2).outerWidth(true);
		var d2_distance_from_top = d2_offset.top + d2_height;
		var d2_distance_from_left = d2_offset.left + d2_width;
		var not_colliding = (d1_distance_from_top < d2_offset.top || d1_offset.top > d2_distance_from_top || d1_distance_from_left < d2_offset.left || d1_offset.left > d2_distance_from_left);
		// Return whether it IS colliding
		return !not_colliding;
	};
	function removeExtraCrowns(element) {
		let f = MPP.client.ppl
		for (const property in f) {
			let j = f[property]
			if (element !== j && (j.nameDiv.innerHTML.includes('thatFakeCrown'))) {
				for (let i = 0; i < j.nameDiv.childNodes.length; i++) {
					if (j.nameDiv.childNodes[i].id === 'thatFakeCrown') {
						j.nameDiv.childNodes[i].remove()
					}
				}
			}
		}
	}
	let f = MPP.client.ppl
	for (const property in f) {
		let j = f[property]
		if (detect(node, j.nameDiv)) {
			let object = { j }
			g.push(object)
		}
	}
	if (g.length > 1 && document.getElementById('crownPermissionFailed') === null) {
		let j = document.createElement('div')
		j.id = 'crownPermissionFailed'
		j.className = 'notification classic';
		j.style = 'height: 292px;top: 33%;right: 36%;position: fixed;width: 500px;overflow-wrap: anywhere;overflow-y: scroll;background-color: rgb(255, 238, 170);'
		document.getElementsByClassName('relative')[0].appendChild(j)
		let x = document.createElement('div')
		x.innerHTML = 'Ⓧ'
		x.className = 'x'
		j.appendChild(x)
		let k = document.createElement('div')
		k.className = 'title'
		k.innerText = 'FAILED TO SHARE PERMISSIONS:'
		j.appendChild(k)
		let p = document.createElement('div')
		p.className = 'text'
		p.innerText = 'You can not share room ownership with more than one persons in one drop. Please select one user at a time.'
		j.appendChild(p)
		x.addEventListener('click', () => {
			j.remove()
		})
		removeExtraCrowns(undefined)
	} else if (g.length == 1 && g[0].j._id !== MPP.client.user._id) {
		removeExtraCrowns(g[0].j)
		let crownOwner = MPP.client.channel.crown.userId
		if (crownOwner == ownid) {
			if (!sharedPermissions.includes(g[0].j._id)) {
				sharedPermissions.push(g[0].j._id)
				sendMessage('share permissions', g[0].j._id)
			} else {
				let j = document.createElement('div')
				j.id = 'crownPermissionFailed'
				j.className = 'notification classic';
				j.style = 'height: 292px;top: 33%;right: 36%;position: fixed;width: 500px;overflow-wrap: anywhere;overflow-y: scroll;background-color: rgb(255, 238, 170);'
				document.getElementsByClassName('relative')[0].appendChild(j)
				let x = document.createElement('div')
				x.innerHTML = 'Ⓧ'
				x.className = 'x'
				j.appendChild(x)
				let k = document.createElement('div')
				k.className = 'title'
				k.innerText = 'FAILED TO SHARE PERMISSIONS:'
				j.appendChild(k)
				let p = document.createElement('div')
				p.className = 'text'
				p.innerText = "You've already shared permissions with this person."
				j.appendChild(p)
				x.addEventListener('click', () => {
					j.remove()
				})
				removeExtraCrowns(undefined)
			}
		} else {
			let j = document.createElement('div')
			j.id = 'crownPermissionFailed'
			j.className = 'notification classic';
			j.style = 'height: 292px;top: 33%;right: 36%;position: fixed;width: 500px;overflow-wrap: anywhere;overflow-y: scroll;background-color: rgb(255, 238, 170);'
			document.getElementsByClassName('relative')[0].appendChild(j)
			let x = document.createElement('div')
			x.innerHTML = 'Ⓧ'
			x.className = 'x'
			j.appendChild(x)
			let k = document.createElement('div')
			k.className = 'title'
			k.innerText = 'FAILED TO SHARE PERMISSIONS:'
			j.appendChild(k)
			let p = document.createElement('div')
			p.className = 'text'
			p.innerText = 'You are not the room owner.'
			j.appendChild(p)
			x.addEventListener('click', () => {
				j.remove()
			})
			removeExtraCrowns(undefined)
		}
	} else if (g.length == 1 && g[0].j._id === MPP.client.user._id) {
		if (document.getElementById('crownPermissionFailed') == null) {
			let j = document.createElement('div')
			j.id = 'crownPermissionFailed'
			j.className = 'notification classic';
			j.style = 'height: 292px;top: 33%;right: 36%;position: fixed;width: 500px;overflow-wrap: anywhere;overflow-y: scroll;background-color: rgb(255, 238, 170);'
			document.getElementsByClassName('relative')[0].appendChild(j)
			let x = document.createElement('div')
			x.innerHTML = 'Ⓧ'
			x.className = 'x'
			j.appendChild(x)
			let k = document.createElement('div')
			k.className = 'title'
			k.innerText = 'FAILED TO SHARE PERMISSIONS:'
			j.appendChild(k)
			let p = document.createElement('div')
			p.className = 'text'
			p.innerText = 'You can not share permissions with yourself!'
			j.appendChild(p)
			x.addEventListener('click', () => {
				j.remove()
			})
			removeExtraCrowns(undefined)
		}
	}
}

function addCrownAnimation(node) {
	if (node) {
		// FUNCTION FROM GITHUB.
		// CREDITS: https://gist.github.com/jtsternberg/c272d7de5b967cec2d3d
		function detect(div1, div2) {
			// Div 1 data
			var d1_offset = $(div1).offset();
			var d1_height = $(div1).outerHeight(true);
			var d1_width = $(div1).outerWidth(true);
			var d1_distance_from_top = d1_offset.top + d1_height;
			var d1_distance_from_left = d1_offset.left + d1_width;
			// Div 2 data
			var d2_offset = $(div2).offset();
			var d2_height = $(div2).outerHeight(true);
			var d2_width = $(div2).outerWidth(true);
			var d2_distance_from_top = d2_offset.top + d2_height;
			var d2_distance_from_left = d2_offset.left + d2_width;
			var not_colliding = (d1_distance_from_top < d2_offset.top || d1_offset.top > d2_distance_from_top || d1_distance_from_left < d2_offset.left || d1_offset.left > d2_distance_from_left);
			// Return whether it IS colliding
			return !not_colliding;
		};
		let crown = document.createElement('div')
		crown.innerHTML = '<img src="https://i.imgur.com/Z6GELiE.png" style="position: absolute;top: -8px;left: 4px;">'
		crown.id = 'thatFakeCrown'
		let f = MPP.client.ppl
		for (const property in f) {
			let j = f[property]
			if (detect(node, j.nameDiv) && !(j.nameDiv.innerHTML.includes('thatFakeCrown')) && j._id !== MPP.client.user._id) {
				j.nameDiv.appendChild(crown)
			} else if (!detect(node, j.nameDiv)) {
				for (let i = 0; i < j.nameDiv.childNodes.length; i++) {
					if (j.nameDiv.childNodes[i].id === 'thatFakeCrown') {
						j.nameDiv.childNodes[i].remove()
					}
				}
			}
		}
	}
}

function generatePseudoCrown() {
	let kf = document.getElementById('shareRoomOwnershipCrown')
	if (kf === null) {
		let crownOwner = MPP.client.channel.crown.userId
		if (crownOwner === ownid) {
			let pseudoCrown = document.createElement('a')
			pseudoCrown.id = 'shareRoomOwnershipCrown'
			pseudoCrown.innerHTML = '<img width="36" src="https://i.imgur.com/Z6GELiE.png" style="-webkit-user-drag: none;">'
			pseudoCrown.style = 'position: absolute;'
			pseudoCrown.style.left = `${($(window).width() - 190)}px`
			pseudoCrown.style.top = `${($(window).height() - 59) * -1}px`
			document.getElementsByClassName('relative')[0].appendChild(pseudoCrown)

			pseudoCrown.addEventListener('mousedown', function () {
				let newNode = pseudoCrown.cloneNode(true)
				newNode.id = 'fakeCrownClone'
				document.getElementsByClassName('relative')[0].appendChild(newNode)
				addListeners();
				let mousedown
				function addListeners() {
					document.getElementById('shareRoomOwnershipCrown').addEventListener('mousedown', mouseDown, false);
					window.addEventListener('mouseup', mouseUp, false);

				}
				function mouseUp() {
					if (newNode !== null) {
						sendCrownPermissions(newNode)
						newNode.remove()
					}
					mousedown = false
					window.removeEventListener('mousemove', divMove, true);
					pseudoCrown.childNodes[0].src = 'https://i.imgur.com/Z6GELiE.png'
				}

				function mouseDown(e) {
					mousedown = true
					window.addEventListener('mousemove', divMove, true);
					pseudoCrown.childNodes[0].src = 'https://i.imgur.com/7uQxCgk.png'
				}
				function divMove(e) {
					var div = document.getElementById('fakeCrownClone');
					if (mousedown === true && div !== null && !(div.style.left > $(window).width()) && !(div.style.top > $(window).height())) {
						addCrownAnimation(div)
						div.style.position = 'absolute';
						div.style.top = (e.clientY - 923) + 'px';
						div.style.left = (e.clientX - 15) + 'px';
					}
				}
			})

		}
	}
}

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
			if (!hasdata) {
				sendMessage('update player')
				setTimeout(function () {
					sendMessage('check timeout')
				}, 5000)
			}
			if (cleared) {
				sendMessage('get status')
			} else {
				sendMessage('check timeout')
			}
		} else if (ws.readyState === WebSocket.OPEN) {
			ws.close()
		} else if (ws.readyState === WebSocket.CONNECTING) {
		}
	}
	if (num === 3) {
		let s = document.getElementById('settingsWindow-window')
		if (s === null) {
			hideWindows('settings')
			s = document.createElement('div')
			s.id = 'settingsWindow-window'
			s.className = 'dialog';
			s.style.visibility = 'visible'
			s.style.height = '400px'
			settingsLeft = ($(window).width() / 2).toString();
			settingsTop = (($(window).height() / 2) - 200).toString();
			s.style.top = `${settingsTop}px`
			s.style.left = `${settingsLeft}px`
			s.style.overflow = 'hidden scroll'
			s.style.overflowWrap = 'anywhere'
			document.getElementsByClassName('relative')[0].appendChild(s)
			let u = document.createElement('div')
			u.id = 'versionNumber'
			u.style = 'font-size: 16px;color: grey;padding-bottom: 11px;'
			u.innerText = '>Script By MajorH. v1.6'
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
			s.appendChild(u)
			s.appendChild(a)
			createDiv('This button enables/disables your friends from joining your rooms.', s.id, '15px', 'ALLOW FRIENDS TO JOIN')
			let z = document.createElement('div')
			z.id = 'manualVerify-btn'
			z.className = 'ugly-button'
			let found
			if ((ws == undefined || ws.readyState == WebSocket.CLOSED) && (!cleared)) {
				z.innerText = 'Connect First', z.style.color = 'orange'
			} else if (cleared) {
				z.innerText = 'Verified', z.style.color = 'lime'
			} else if (ws.readyState == WebSocket.OPEN && (!cleared)) {
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
							sendMessage('update friends')
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
			let debugButton = document.createElement('div')
			debugButton.id = 'debugMode-btn'
			debugButton.className = 'ugly-button'
			debugButton.innerText = 'Debug Mode'
			debugButton.style.color = 'white'
			s.appendChild(debugButton)
			createDiv('This button enables debugging mode. No need to use this unless your interested in communications between the server and client.', s.id, '15px', 'DEBUGGING MODE')
			debugButton.addEventListener('click', function () {
				if (document.getElementById('debugWindow-window') === null) {
					debuggingMode = true
					debugButton.style.color = 'lime'
					cDW(debugWindow, '0', '0', '400', 'CLIENT SERVER COMMUNICATIONS', `overflow: hidden scroll;visibility: visible;position: absolute;display: block;overflow-wrap: anywhere;height: 400px;top: -784px;left: ${windowSize}px;`)
					addListeners();
					let mousedown
					function addListeners() {
						document.getElementById('debugWindow-window').addEventListener('mousedown', mouseDown, false);
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
						var div = document.getElementById('debugWindow-window');

						setTimeout(function () {
							if (mousedown === true) {
								div.style.position = 'absolute';
								div.style.top = (e.clientY - draggable) + 'px';
								div.style.left = (e.clientX) + 'px';
							}
						}, 100)
					}
				} else {
					let s = document.getElementById('debugWindow-window')
					if (s.style.visibility === 'hidden') {
						s.style.visibility = 'visible';
						debugButton.style.color = 'lime'
						debuggingMode = true
					} else {
						s.style.visibility = 'hidden';
						debugButton.style.color = 'white'
						debuggingMode = false
					}
				}
			})
			let updatesButton = document.createElement('div')
			updatesButton.id = 'checkUpdate-btn'
			updatesButton.className = 'ugly-button'
			updatesButton.innerText = 'Check for Update'
			updatesButton.style = 'color: white;width: 112px;'
			s.appendChild(updatesButton)
			createDiv('Check for a new version. Make sure to check frequently for updates', s.id, '15px', 'CHECK FOR UPDATES')
			updatesButton.addEventListener('click', function () {
				updatesButton.innerText = 'Checking...'
				updatesButton.style.color = 'orange'
				sendMessage('version check', versionNo)
				setTimeout(function () {
					if (!gotVersionNo) {
						updatesButton.innerText = 'Failed'
						updatesButton.style.color = 'red'
					}
				}, 10000)
			})


			let disablePopup = document.createElement('div')
			disablePopup.id = 'disablePopups-btn'
			disablePopup.className = 'ugly-button'
			if (disablePopups) {
				disablePopup.innerText = 'Enabled'
				disablePopup.style = 'color: lime;'
			} else {
				disablePopup.innerText = 'Disabled'
				disablePopup.style = 'color: red;'
			}
			s.appendChild(disablePopup)
			disablePopup.addEventListener('click', function () {
				if (disablePopups) {
					document.cookie = `%disablePopups=false; expires=${keepCookie}`
					disablePopups = false
					disablePopup.innerText = 'Disabled'
					disablePopup.style = 'color: red;'
				} else {
					document.cookie = `%disablePopups=true; expires=${keepCookie}`
					disablePopups = true
					disablePopup.innerText = 'Enabled'
					disablePopup.style = 'color: lime;'
				}
			})
			createDiv('Clicking this will enable/disable the popup warning from appearing when you open the site. It also removes messages like "You can play the piano"', s.id, '15px', 'REMOVE POPUPS.')

			let aboutButton = document.createElement('div')
			aboutButton.id = 'about-btn'
			aboutButton.className = 'ugly-button'
			aboutButton.innerText = 'About'
			let github = 'https://github.com/MajorH5/Friends-in-Multiplayer-Piano'
			aboutButton.href = github
			aboutButton.style = 'color: white;'
			aboutButton.target = '_blank'
			s.appendChild(aboutButton)
			aboutButton.addEventListener('click', function () {
				var win = window.open(github, '_blank');
				win.focus();
			})
			createDiv('This will open to the script github where you can see update logs and read about the script.', s.id, '15px', 'ABOUT THIS SCRIPT.')
		} else {
			let a = document.getElementById('allowFriendJoin-btn')
			let z = $('#manualVerify-btn')[0]
			if (s.style.visibility === 'hidden' && (document.getElementById('verifyUserPrompt-window') === null && document.getElementById('delete-Site-DataWarning') === null)) {
				if ((ws == undefined || ws.readyState == WebSocket.CLOSED) && (!cleared)) {
					z.innerText = 'Connect First', z.style.color = 'orange'
				} else if (cleared) {
					z.innerText = 'Verified', z.style.color = 'lime'
				} else if (ws.readyState == WebSocket.OPEN && (!cleared)) {
					z.innerText = 'Not verified', z.style.color = 'red'
				}
				if (allowRoom === true) { a.innerText = 'Enabled', a.style.color = 'lime' } else if (allowRoom === false) { a.innerText = 'Disabled', a.style.color = 'red' } else { a.innerText = '-', a.style.color = 'black' }
				s.style.visibility = 'visible';
				hideWindows('settings')
			} else {
				s.style.visibility = 'hidden';
			}
		}
	}
	if (num === 4) {
		if (document.getElementById('minigamesWindow-window') === null && inGame === false) {
			hideWindows('mulplaty')
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
					e.style = 'margin-top: 10px;margin-bottom: 10px;'
					b.appendChild(e)
					e.addEventListener('click', function () {
						if (!inGame) {
							startSinglePlayerCrownClicker()
						} else {
							if (document.getElementById('inGameAlready') === null) {
								let j = document.createElement('div')
								j.className = 'notification classic';
								j.id = 'inGameAlready'
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
					f.style = 'margin-top: 10px;margin-bottom: 10px;'
					f.addEventListener('click', function () {
						if (document.getElementById('crownClickerMultiplayer-window') == null) {
							hideWindows('crownmul')
							let h = document.createElement('div')
							h.id = 'crownClickerMultiplayer-window'
							h.className = 'dialog';
							h.style = 'visibility: visible;height: 400px;top: 284.5px;left: 960px;overflow: hidden scroll;color: black;'
							h.style.visibility = 'visible'
							h.style.height = '400px'
							settingsLeft = ($(window).width() / 2).toString();
							settingsTop = (($(window).height() / 2) - 200).toString();
							h.style.top = `${settingsTop}px`
							h.style.left = `${settingsLeft}px`
							a.style.visibility = 'hidden'
							h.style.color = 'black'
							document.getElementsByClassName('relative')[0].appendChild(h)
							h.innerText = 'Multiplayer Crownclicker'
							let x = document.createElement('a')
							x.innerHTML = 'Ⓧ'
							x.className = 'x'
							x.style = 'color: red;position: absolute;top: 0px;left: 373px;'
							x.addEventListener('click', function () {
								h.remove()
								a.style.visibility = 'visible'
							})
							h.appendChild(x)
							let g = document.getElementById('friendsWindow-window').childNodes
							let l = document.createElement('div')
							l.innerText = `Select friend to play with.`
							h.appendChild(l)
							for (let i = 0; i < g.length; i++) {
								let k = g[i].cloneNode(true)
								h.appendChild(k)

								$("#crownClickerMultiplayer-window").children().each(function (i, e) {
									for (let i = 0; i < e.childNodes.length; i++) {
										if (e.childNodes[i].className === 'ugly-button') {
											e.childNodes[i].remove()
										}
									}
								})
								k.addEventListener('click', function () {
									let friendId = k.id
									if (!pendingRequest && document.getElementById('pendingRequest-window') == null) {
										if (ws !== undefined && ws.readyState !== WebSocket.CLOSED && ws.readyState !== WebSocket.CLOSING && ws.readyState !== WebSocket.CONNECTING) {
											let q = document.createElement('div')
											allowGameInitation = true
											gameWasCanceled = false
											h.style.visibility = 'hidden'
											a.style.visibility = 'hidden'
											q.innerHTML = (`<div id="pendingRequest-window" class="dialog" style="visibility: visible;height: 34px;position: fixed;top: ${($(window).height() - 12.5).toString()}px;left: ${($(window).width() - 691).toString()}px;font-size: 11px;color: black;width: 331px;">Pending Request<div id="cancelPendingRequest" class="ugly-button" style="position: absolute;left: 8px;top: 28px;color: white;">Cancel</div><div id="pendingRequestTimer" style="position: absolute;top: 6px;left: 240px;font-size: 11px;color: black;">Sending Request...</div><div style="position: absolute;top: 26px;left: 152px;font-size: 15px;">Crownclicker Multiplayer</div><img width="30" src="https://www.multiplayerpiano.com/crown.png" style="position: absolute;top: 2px;left: 201px;"></div>`)
											document.getElementsByClassName('relative')[0].appendChild(q)
											currentlyPlaying = k.id
											let cancel = document.getElementById('cancelPendingRequest')
											cancel.addEventListener('click', function () {
												q.remove()
												gameWasCanceled = true
												pendingRequest = false
												currentlyPlaying = ''
												allowGameInitation = false
											})
											sendMessage('multiplayer', `crownclicker`, friendId)
										} else {
											if (document.getElementById('websocketNotReadyWarning') == null) {
												let j = document.createElement('div')
												j.className = 'notification classic';
												j.id = 'websocketNotReadyWarning'
												j.style = 'height: 292px;top: 33%;right: 36%;position: fixed;width: 500px;overflow-wrap: anywhere;overflow-y: scroll;background-color: rgb(255, 238, 170);'
												document.getElementsByClassName('relative')[0].appendChild(j)
												let x = document.createElement('div')
												x.innerHTML = 'Ⓧ'
												x.className = 'x'
												j.appendChild(x)
												let k = document.createElement('div')
												k.className = 'title'
												k.innerText = 'ERROR:'
												j.appendChild(k)
												let p = document.createElement('div')
												p.className = 'text'
												p.innerText = 'Please connect to the websocket first before attempting to play a multiplayer game.'
												j.appendChild(p)
												x.addEventListener('click', () => {
													j.remove()
												})
												debug('Websocket is not ready.')
											}
										}
									}
								})
							}
						} else {
							let w = document.getElementById('crownClickerMultiplayer-window')
							if (w.style.visibility == 'hidden') {
								hideWindows('crownmul')
								w.style.visibility = 'visible'
							} else {
								w.style.visibility = 'hidden'
							}
						}
					})
					let g = document.createElement('div')
					g.className = 'ugly-button'
					g.innerText = 'Leaderboard'
					g.id = 'leaderboards-crownClicker'
					g.style = 'margin-top: 10px;margin-bottom: 10px;'
					b.appendChild(g)
					g.addEventListener('click', function () {
						if (document.getElementById('crownClickerLeaderboardWindow-window') == null) {
							let h = document.createElement('div')
							h.id = 'crownClickerLeaderboardWindow-window'
							hideWindows('crownLeader')
							h.className = 'dialog';
							h.style.visibility = 'visible'
							h.style.height = '400px'
							settingsLeft = ($(window).width() / 2).toString();
							settingsTop = (($(window).height() / 2) - 200).toString();
							h.style.top = `${settingsTop}px`
							h.style.left = `${settingsLeft}px`
							a.style.visibility = 'hidden'
							document.getElementsByClassName('relative')[0].appendChild(h)
							h.innerText = 'Crownclicker Leaderboard'
							for (let j = 1; j < 11; j++) {
								let i = document.createElement('a')
								i.id = `rank_${j}`
								i.innerText = '-'
								i.style = 'background-color: black;color: white;display: block;font-size: 12px;padding-bottom: 10px;padding-left: 10px;padding-right: 10px;'
								h.appendChild(i)
							}
							let j = document.createElement('div')
							j.className = 'ugly-button'
							j.innerText = 'Refresh Leaderboard'
							j.id = 'refreshLeaderboard-crownClicker'
							j.style = 'margin-top: 10px;margin-bottom: 10px;top: 363px;position: absolute;width: 127px;'
							h.appendChild(j)
							j.addEventListener('click', function () {
								j.innerText = 'Refreshing...'
								j.style.color = 'orange'
								sendMessage('get leaderboard data', 'crownclicker')
							})
							let i = document.createElement('div')
							i.className = 'ugly-button'
							i.innerText = 'Submit Highscore'
							i.id = 'submitHighscore-crownClicker'
							i.style = 'margin-top: 10px;margin-bottom: 10px;width: 108px;position: absolute;top: 363px;left: 281px;'
							h.appendChild(i)
							i.addEventListener('click', function () {
								if (MPP.client.user._id) {
									i.innerText = 'Submitting...'
									i.style.color = 'orange'
									sendMessage('update leaderboards', cursorClickerScore, 'crownclicker')
								}
							})
							let k = document.createElement('div')
							h.appendChild(k)
							k.innerHTML = '<img width="25" src="https://www.multiplayerpiano.com/crown.png" style="position: absolute;top: 14px;left: 362px;">'
							let x = document.createElement('a')
							x.innerHTML = 'Ⓧ'
							x.className = 'x'
							x.style = 'color: red;position: absolute;top: 0px;left: 389px;'
							x.addEventListener('click', function () {
								h.remove()
								a.style.visibility = 'visible'
							})
							h.appendChild(x)
							let l = document.createElement('a')
							l.innerText = `Your highscore: ${cursorClickerScore}`
							h.appendChild(l)
							sendMessage('get leaderboard data', 'crownclicker')
						} else {
							let w = document.getElementById('crownClickerLeaderboardWindow-window')
							if (w.style.visibility == 'hidden') {
								hideWindows('crownLeader')
								w.style.visibility = 'visible'
							} else {
								w.style.visibility = 'hidden'
							}
						}
					})

				} else {
					document.getElementById('singlePlayer-crownClicker').remove()
					document.getElementById('multiPlayer-crownClicker').remove()
					document.getElementById('leaderboards-crownClicker').remove()
				}
			})
		} else {
			let i = document.getElementById('minigamesWindow-window')
			if (i.style.visibility === 'visible') {
				i.style.visibility = 'hidden'
			} else if (i.style.visibility === 'hidden' && inGame === false) {
				hideWindows('mulplaty')
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
					sendMessage('get status')
					let f = MPP.client.ppl
					for (const property in f) {
						let j = Object.getOwnPropertyDescriptor(f[property], '_id')
						if (j) {
							if (j.value === id) {
								let p = f[property]
								if (p.scriptUser === undefined) {
									const cursor = p.cursorDiv.childNodes;
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
			v.style = `background-color: ${MPP.client.getOwnParticipant().color};color: white;display: block;font-size: 12px;padding-bottom: 10px;padding-left: 10px;padding-right: 10px;user-select: text;`
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
// STRING UP FINAL FILE
function stringUp(command, payload) {
	if (!payload) { payload = 'undefined' }
	let x = {
		key: 'mppwebsocket',
		command: command,
		data: payload
	}
	return JSON.stringify(x)
}
// -- //

// -- //
// ALLOWS SENDING MESSAGE THROUGH WEBSOCKET:
let verifyRoom
let verifyCode
let responseReceived = false
function sendMessage(param, msg, playerid, msgid) {
	if (ws === undefined) {
		ws = new WebSocket(`${WEBSOCKETLOCATION}`);
		// addListener()
	} else if (ws.readyState == WebSocket.CLOSED) {
		ws = new WebSocket(`${WEBSOCKETLOCATION}`);
		// addListener()
	} else if (ws.readyState == WebSocket.DISCONNECTING) {
		ws.addEventListener('close', function (e) {
			ws = new WebSocket(`${WEBSOCKETLOCATION}`);
			// addListener()
		})
	}
	let payload = {}
	let x

	switch (param) {
		case 'update player':
			let y = (MPP.client.getOwnParticipant())
			payload = {
				uDATAid: y._id,
				uDATAcolor: y.color,
				uDATAname: y.name,
				uDATAfriends: friends
			}
			x = stringUp('udata', payload)
			if (ws.readyState === WebSocket.OPEN) {
				ws.send(x);
				debug(x)
			} else {
				ws.addEventListener('open', function (e) {
					ws.send(x);
					debug(x)
				})
			}
			break;
		case 'update sound':
			payload = {
				sound: msg
			}
			x = stringUp('updatesound', payload)
			if (ws.readyState === WebSocket.OPEN) {
				ws.send(x);
				debug(x)
			} else {
				ws.addEventListener('open', function (e) {
					ws.send(x);
					debug(x)
				})
			}
			break;
		case 'script user':
			payload = {
				scriptuser: msg
			}
			x = stringUp('scriptuser', payload)
			if (msg !== MPP.client.getOwnParticipant()._id) {
				if (ws.readyState === WebSocket.OPEN) {
					ws.send(x);
					debug(x)
				} else {
					ws.addEventListener('open', function (e) {
						ws.send(x);
						debug(x)
					})
				}
			}
			break
		case 'update name':
			setTimeout(function () {
				let xy = (MPP.client.getOwnParticipant())
				payload = {
					name: xy.name
				}
				x = stringUp('updatename', payload)
				if (ws.readyState === WebSocket.OPEN) {
					ws.send(x);
					debug(x)
				} else {
					ws.addEventListener('open', function (e) {
						ws.send(x);
						debug(x)
					})
				}
			}, 3000)
			break;
		case 'update friends':
			payload = {
				friends: friends
			}
			x = stringUp('updatefriend', payload)
			if (ws.readyState === WebSocket.OPEN) {
				ws.send(x);
				debug(x)
			} else {
				ws.addEventListener('open', function (e) {
					ws.send(x);
					debug(x)
				})
			}
			break;
		case 'join room':
			payload = {
				rid: playerid
			}
			x = stringUp('joinroom', payload)
			if (ws.readyState === WebSocket.OPEN) {
				ws.send(x);
				debug(x)
			} else {
				ws.addEventListener('open', function (e) {
					ws.send(`#${ownid}`);
					ws.send(x);
					debug(x)
				})
			}
			break;
		case 'send message':
			payload = {
				msg: msg,
				rid: playerid,
				mid: msgid,
				name: MPP.client.getOwnParticipant().name
			}
			x = (stringUp('message', payload))
			if (ws.readyState === WebSocket.OPEN) {
				ws.send(x)
				debug(x)
			} else {
				ws.addEventListener('open', function (e) {
					ws.send(x)
					debug(x)
				})
			}
			break;
		case 'version check':
			payload = {
				versionno: versionNo
			}
			x = (stringUp('version', payload))
			if (ws.readyState === WebSocket.OPEN) {
				ws.send(x)
				debug(x)
			} else {
				ws.addEventListener('open', function (e) {
					ws.send(x)
					debug(x)
				})
			}
			break;
		case 'check timeout':
			let internal = 'Please wait 30 seconds before sending another verification request. If it keeps failing the servers may be down or contact MajorH on discord: @MajorH#6304'
			let title = 'SPAM WARNING'
			if (clickable === false) {
				if (document.getElementById('verifyUserPrompt-window')) {
					document.getElementById('verifyUserPrompt-window').remove()
					createPopup(title, internal, 'verifySpamWarning')
				}
				return
			}
			if (!cleared) {
				clickBuffer()
				x = stringUp('verify')
				if (ws.readyState === WebSocket.OPEN) {
					ws.send(x);
					debug(x)
				} else {
					ws.addEventListener('open', function (e) {
						ws.send(x);
						debug(x)
					})
				}
			} else {
				setTimeout(function () {
					stopDots = true
					let h = $('#cancelButton-btn')[0]
					h.style.color = 'lime'
					h.innerText = 'Verified.'
					let hg = $('#connectingText')[0]
					hg.innerText = 'You have been confirmed verified.'
					hg.style.color = 'lime'
				}, 1000)
			}
			break;
		case 'get status':
			payload = {
				friends: {},
				sound: MPP.soundSelector.soundSelection
			}
			for (let i = 0; i < friends.length; i++) {
				payload.friends[friends[i]] = $(`#${friends[i]}`)[0].childNodes[0].nodeValue
			}
			x = stringUp(`getstatus`, payload)
			if (ws.readyState === WebSocket.OPEN) {
				ws.send(x);
				debug(x)
			} else {
				ws.addEventListener('open', function (e) {
					ws.send(x);
					debug(x)
				})
			}
			break;
		case 'update leaderboards':
			payload = {
				game: playerid,
				score: msg
			}
			x = stringUp('gamescore', payload)
			if (ws.readyState === WebSocket.OPEN) {
				ws.send(x);
				debug(x)
			} else {
				ws.addEventListener('open', function (e) {
					ws.send(x);
					debug(x)
				})
			}
			let f = document.getElementById('submitHighscore-crownClicker')
			if (f) {
				f.innerText = 'Submitted!'
				f.style.color = 'lime'
				setTimeout(function () {
					f.innerText = 'Submit Highscore'
					f.style.color = 'white'
				}, 1000)
			}
			break;
		case 'get leaderboard data':
			payload = {
				game: msg
			}
			x = stringUp('requestleaderboard', payload)
			if (ws.readyState === WebSocket.OPEN) {
				ws.send(x);
				debug(x)
			} else {
				ws.addEventListener('open', function (e) {
					ws.send(x);
					debug(x)
				})
			}
			break;
		case 'multiplayer':
			payload = {
				friend: playerid,
				game: msg
			}
			x = stringUp('multiplayer', payload)
			pendingRequest = true
			if (ws.readyState === WebSocket.OPEN) {
				ws.send(x);
				debug(x)
			} else {
				ws.addEventListener('open', function (e) {
					ws.send(x);
					debug(x)
				})
			}
			break;
		case 'remove permissions':
			payload = {
				id: msg
			}
			x = stringUp('removepermissions', payload)
			if (ws.readyState === WebSocket.OPEN) {
				ws.send(x);
				debug(x)
			} else {
				ws.addEventListener('open', function (e) {
					ws.send(x);
					debug(x)
				})
			}
			break;
		case 'share permissions':
			payload = {
				id: msg
			}
			x = stringUp('sharepermissions', payload)
			if (ws.readyState === WebSocket.OPEN) {
				ws.send(x);
				debug(x)
			} else {
				ws.addEventListener('open', function (e) {
					ws.send(x);
					debug(x)
				})
			}
			break;
		case 'kick user':
			payload = {
				kick: msg,
				crownowner: playerid,
				time: msgid
			}
			x = stringUp('kickuser', payload)
			if (ws.readyState === WebSocket.OPEN) {
				ws.send(x);
				debug(x)
			} else {
				ws.addEventListener('open', function (e) {
					ws.send(x);
					debug(x)
				})
			}
			break;
		case 'change room set':
			if (!MPP.client.channel.crown) { return }
			payload = {
				roomsettings: msg,
				crownowner: MPP.client.channel.crown.userId
			}
			x = (stringUp('changeroomset', payload))
			if (ws.readyState === WebSocket.OPEN) {
				ws.send(x)
				debug(x)
			} else {
				ws.addEventListener('open', function (e) {
					ws.send(x)
					debug(x)
				})
			}
			break;
	}

	return;
}
// -- //

// -- //
// SHUTDOWN MULTIPLAYER GAME
function clearAllGameStatus() {
	playingMultiplayerCrownClicker = false
	pendingRequest = false
	alreadySetup = false
	allowGameInitation = false
	inGame = false
	currentlyPlaying = ''
	gameKey = ''
	multiplayerGameStatus = false
	multiplayerCrownAmmount = 0
	multiplayerScore = 0
}
// -- //

// -- //
// CHECK IF FILE CAN BE PARSED
function IsJsonString(str) {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}
// -- //

// -- //
// ADDS LISTENERS TO WEBSOCKET CONNECTIONS
function addListener() {
	ws.addEventListener('message', function (e) {
		let sendback = {}
		let m
		let a
		try {
			a = JSON.parse(e.data)
		} catch (error) {
			console.log(`Invalid payload data. ${error}`)
		}
		if (a) {
			switch (a.key) {
				case 'mppwebsocket':
					switch (a.command) {
						case 'error':
							switch (a.data.errortype) {
								case 'joinroom':
									errorJoinRoom(a.data.error)
									break;
								case 'msgerr':
									switch (a.data.num) {
										case '5':
											createWebsocketError(a.data.error.failure)
											messageStatus('Not Sent', a.data.error.mid)
											break;
										case '6':
											createWebsocketError('This person does not use the script.')
											createMessageOnScreen(a.data.error.rid, 'This player is not in the script database. Ask them to use the script to message them.', 'true', 'rgb(0, 0, 0)', 'SERVER', undefined, true)
											messageStatus('Not Sent', a.data.error.mid)
											break;
									}
									break;
								case 'permshare':
									sharedPermissions.splice(sharedPermissions.indexOf(a.data.error.id), 1)
									let ref = Object.getOwnPropertyDescriptor(MPP.client.ppl, a.data.id).nameDiv
									for (let i = 0; i < ref.childNodes.length; i++) {
										if (ref.childNodes[i].id == 'thatFakeCrown') {
											ref.childNodes[i].remove()
										}
									}
									createWebsocketError(a.data.error.reason)
									break;
								default:
									createWebsocketError(a.data.error)
									break;
							}
							break;
						case 'msgsent':
							messageStatus('Sent', a.data.mid)
							break;
						case 'msgsaved':
							messageStatus('Saved', a.data.mid)
							break;
						case 'verifydata':
							ws.close()
							createPopup('AUTOVERIFYING', 'The server is automatically verifying your ID. The websocket will momentarily disconnect while the server verifies your ID.', 'autoVerify-popup')
							setTimeout(function () {
								verifyCode = a.data.verifycode;
								verifyRoom = a.data.verifyroom;
								verifyClient = new Client('wss://www.multiplayerpiano.com:443');
								verifyClient.start();
								verifyClient.setChannel(a.data.verifyroom);
								setTimeout(function () {
									if (!authenticationStatus) {
										verifyClient.stop()
										console.log('Timeout.')
										timeout()
									}
								}, 40000)
								debug('Sending Verification Code.', a.data.verifyroom)
								verifyClient.on('ch', () => {
									if (!cleared) {
										verifyClient.sendArray([{ m: 'a', message: `*${a.data.verifycode}` }]);
										verifyClient.on('a', msg => {
											if (msg.a.toString().toLowerCase().startsWith('user authenticated.')) {
												authenticationStatus = true
												document.cookie = (`&verificationStatus=true; expires=${keepCookie}`)
												let z = document.getElementById('manualVerify-btn')
												if (z) { z.innerText = 'Verified', z.style.color = 'lime' }
												cleared = true
												if (ws.readyState == WebSocket.CLOSED) {
													ws = new WebSocket(`${WEBSOCKETLOCATION}`);
													addListener()
													sendMessage('get status')
												}
												if (document.getElementById('autoVerify-popup')) {
													document.getElementById('autoVerify-popup').remove()
													createPopup('VERIFICATION SUCCESS!', 'ID verified. Because the server code has been re-written this is now a one time process')
												} else {
													createPopup('VERIFICATION SUCCESS!', 'ID verified. Because the server code has been re-written this is now a one time process')
												}
												verifyClient.stop();
												verificationConfirmed()
											}
											if (msg.a.toString().toLowerCase().startsWith('could not authenticate user')) {
												authenticationStatus = false
												document.cookie = (`&verificationStatus=false; expires=${keepCookie}`)
												if (ws.readyState == WebSocket.CLOSED) {
													ws = new WebSocket(`${WEBSOCKETLOCATION}`);
													addListener()
												}
												verifyClient.stop();
												verificationFailed()
												createWebsocketError('There was an error verifying. This could be due to running multiple MPP users on one PC.')
											}
										});
									}
								})
							}, 3000)
							break;
						case 'hasdata':
							hasdata = true
							break;
						case 'cleared':
							cleared = true
							break;
						case 'verifystatus':
							switch (a.data.status) {
								case 'identityverified':
									break;
								case 'identityfailed':
									verifyClient.stop()
									break;
							}
							break;
						case 'reqjoinroom':
							let reqid = a.data.tid
							if (allowRoom === true) {
								if (friends.includes(reqid)) {
									let fed = {
										rid: reqid,
										room: window.MPP.client.channel._id
									}
									let j = stringUp('acceptjoinroom', fed)
									ws.send(j)
									debug(`final-${window.MPP.client.channel._id}-${reqid}-${ownid}`)
								} else {
									let fede = {
										rid: reqid,
										reason: 'This person does not have you friended'
									}
									let je = stringUp('denyjoinroom', fede)
									ws.send(je)
									debug(`request denied:${reqid}:This person does not have you friended.`)
								}
							} else {
								let feded = {
									rid: reqid,
									reason: 'This person does allow friends to join their rooms.'
								}
								let jed = stringUp('denyjoinroom', feded)
								ws.send(jed)
								debug(`request denied:${reqid}:This person does allow friends to join their rooms.`)
							}
							break;
						case 'denyjoinroom':
							if (roomreq === true) {
								errorJoinRoom(a.data.reason)
								roomreq = false
								if (friendRoomId.includes(a.data.tid)) {
									let oxa = friendRoomId.indexOf(a.data.tid)
									friendRoomId.splice(oxa, 1)
								}
							} else {
								console.warn('Unkown failed request message received.')
							}
							break;
						case 'scriptuser':
							scriptUser(a.data.scriptuser, a.data.hasSharedPermissions, a.data.tag, a.data.sound)
							break;
						case 'finaljoinroom':
							if (roomreq === true) {
								if (friendRoomId.includes(a.data.tid)) {
									window.MPP.client.setChannel(a.data.room)
									let k = friendRoomId.indexOf(a.data.tid)
									friendRoomId.splice(k, 1)
									roomreq = false
								}
							} else {
								console.warn('WARNING: An attempt to connect to another room was made from an outside source. There was no request for this.')
							}
							break;
						case 'statusupdate':
							for (const [id, info] of Object.entries(a.data)) {
								for (const [key, value] of Object.entries(info)) {
									if (key == 'status') {
										updateFriendStatus(id, value)
									} else {
										let j = document.getElementById(id)
										let q = $(`#nameWindow_${id}`)[0]
										document.cookie = (`#${id}=${value}; expires=${keepCookie}`)
										if (j !== null && j !== undefined) {
											let i = j.childNodes[1]
											j.innerText = value
											if (i !== undefined) {
												j.appendChild(i)
											}
										}
										if (q !== null && q !== undefined) {
											q.childNodes[0].nodeValue = value
										}
									}
								}
							}
							break;
						case 'updatename':
							let j = document.getElementById(a.data.playerid)
							let q = $(`#nameWindow_${a.data.playerid}`)[0]
							document.cookie = (`#${a.data.playerid}=${a.data.name}; expires=${keepCookie}`)
							if (j !== null && j !== undefined) {
								let i = j.childNodes[1]
								j.innerText = a.data.name
								if (i !== undefined) {
									j.appendChild(i)
								}
							}
							if (q !== null && q !== undefined) {
								q.childNodes[0].nodeValue = a.data.name
							}
							break;
						case 'playeroffline':
							updateFriendStatus(a.data.playerid, 'offline')
							break;
						case 'playeronline':
							updateFriendStatus(a.data.playerid, 'online')
							break;
						case 'message':
							createMessageOnScreen(a.data.tid, a.data.msg, 'true', a.data.color, a.data.name, undefined, true)
							break;
						case 'updatesound':
							let ife = MPP.client.ppl
							for (const property in ife) {
								let j = Object.getOwnPropertyDescriptor(ife[property], '_id')
								if (j) {
									if (j.value === a.data.id) {
										ife[property].soundSelection = a.data.sound
									}
								}
							}
							break;
						case 'version':
							if (a.data.status == 'outdated') {
								createPopup('YOUR RUNNING AN OUTDATED VERSION OF THE SCRIPT:', `Please go to the link below and use the new script in your tampermonkey window. Newest version: ${a.data.version}`, 'outdatedPopup');
								let o = document.createElement('a')
								o.innerText = 'Newest Version'
								o.style = 'color: blue;font-size: 19px;'
								o.href = scriptWebsite
								o.target = '_blank'
								document.getElementById('outdatedPopup').appendChild(o)
								let updatesButton = document.getElementById('checkUpdate-btn');
								if (updatesButton !== null) {
									updatesButton.style = 'color: red; width: 112px;'
									updatesButton.innerText = 'Outdated!'
									gotVersionNo = true
									setTimeout(function () {
										updatesButton.style = 'color: white; width: 112px;'
										updatesButton.innerText = 'Check for updates'
									}, 3000)
								}
							} else {
								createPopup('Your running the latest version of this script!', 'LATEST VERSION CONFIRMED.')
								let updatesButton = document.getElementById('checkUpdate-btn')
								if (updatesButton !== null) {
									updatesButton.style = 'color: lime; width: 112px;'
									updatesButton.innerText = 'Latest!'
									gotVersionNo = true
									setTimeout(function () {
										updatesButton.style = 'color: white; width: 112px;'
										updatesButton.innerText = 'Check for updates'
									}, 3000)
								}
							}
							break;
						case 'leaderboarddata':
							let i = a.data.data
							for (let j = 1; j < 11; j++) {
								let rank = document.getElementById(`rank_${j}`)
								let properties = Object.keys(i[j - 1])
								let name
								let id
								let color
								let score
								let blank = 'EMPTY'
								for (let o = 0; o < properties.length; o++) {
									if (properties[o] === 'name') {
										name = i[j - 1]['name']
									} else if (properties[o] === 'color') {
										color = i[j - 1]['color']
									} else {
										id = properties[o]
										score = i[j - 1][id]
									}
								}
								if (id.length === 24) {
									if (rank !== null) {
										rank.innerText = `Rank${j} - ${name} - ${id} - ${score}`
										rank.style.backgroundColor = color
									}
								} else {
									if (rank !== null) {
										rank.innerText = `Rank${j} - ${blank} - ${blank} - ${blank}`
									}
								}
								let q = document.getElementById('refreshLeaderboard-crownClicker')
								if (q) {
									q.innerText = 'Refreshed!'
									q.style.color = 'lime'
								}
								setTimeout(function () {
									q.innerText = 'Refresh Leaderboard'
									q.style.color = 'white'
								}, 1000)
							}
							break;
						case 'multiplayerrequest':
							function denyGame(reason) {
								sendback = {
									game: a.data.game,
									friend: a.data.requestid,
									reason: reason
								}
								m = stringUp(`multiplayerfail`, sendback)
								ws.send(m)
							}
							if (allowGameRequest) {
								if (!friends.includes(a.data.requestid)) {
									denyGame('Player not on friends list.')
								} else {
									if (document.getElementById('multiplayerGameRequest') == null) {
										const multiplayerpop = createPopup(`You have a game request from ${a.data.name}:`, `${a.data.requestid}:${a.data.name}, has requested to play a game of ${a.data.game} with you. Accept or Deny?`, 'denyMultiplayerRequest')
										let e = document.createElement('div')
										e.className = 'ugly-button'
										e.innerText = 'Accept'
										e.id = 'acceptMultiplayerRequest'
										e.style = 'margin-top: 10px;margin-bottom: 10px;'
										e.style.color = 'lime'
										multiplayerpop.popup.appendChild(e)
										let o = document.createElement('div')
										o.className = 'ugly-button'
										o.innerText = 'Deny'
										o.style = 'margin-top: 10px;margin-bottom: 10px;'
										o.style.color = 'red'
										multiplayerpop.popup.appendChild(o)
										e.addEventListener('click', function () {
											multiplayerpop.popup.remove()
											currentlyPlaying = a.data.requestid
											sendback = {
												game: a.data.game,
												friend: a.data.requestid,
											}
											m = stringUp(`initiatemultiplayer`, sendback)
											ws.send(m)
											allowGameInitation = true
											setTimeout(function () {
												if (allowGameInitation) {
													allowGameInitation = false
												}
											}, 10000)
										})
										o.addEventListener('click', function () {
											multiplayerpop.popup.remove()
											denyGame('Player declined the request.')
										})
										multiplayerpop.xbutton.addEventListener('click', () => {
											multiplayerpop.popup.remove()
											denyGame('Player declined the request.')
										})
									}
								}
							} else {
								denyGame('Player does not accept game requests.')
							}
							break;
						case 'multiplayersent':
							if (pendingRequest) {
								let requestWindow = document.getElementById('pendingRequest-window')
								requestWindow.innerHTML = `<div id="pendingRequest-window" class="dialog" style="visibility: visible;height: 34px;position: fixed;top: ${($(window).height() - 12.5).toString()}px;left: ${($(window).width() - 691).toString()}px;font-size: 
								11px;color: lime;width: 331px;">Request Sent!<div id="cancelPendingRequest" class="ugly-button" style="position: absolute;left: 8px;top: 28px;color: white;">Cancel</div><div id="pendingRequestTimer" style="position: absolute;top: 6px;left: 
								240px;font-size: 17px;color: lime;">30 Sec Left</div><div style="position: absolute;top: 26px;left: 152px;font-size: 15px;">Crownclicker Multiplayer</div><img width="30" src="https://www.multiplayerpiano.com/crown.png" style="position: absolute;top: 
								2px;left: 201px;"></div>`
								let timer = document.getElementById('pendingRequestTimer')
								document.getElementById('cancelPendingRequest').addEventListener('click', function () {
									clearInterval(timerInterval)
									pendingRequest = false
									gameWasCanceled = true
									requestWindow.remove()
									currentlyPlaying = ''
									allowGameInitation = false
								})
								if (requestWindow !== null) {
									let time = 30
									timerInterval = window.setInterval(function () {
										if (!gameWasCanceled) {
											timer.innerText = `${time.toString()} Sec Left`
											time--
											if (timer.innerText === '20 Sec Left') {
												timer.style.color = 'orange'
											} else if (timer.innerText === '10 Sec Left') {
												timer.style.color = 'red'
											}
											if (time === 0) {
												clearInterval(timerInterval)
												pendingRequest = false
												requestWindow.remove()
												currentlyPlaying = ''
												allowGameInitation = false
											}
										} else {
											clearInterval(timerInterval)
											pendingRequest = false
											requestWindow.remove()
											currentlyPlaying = ''
											allowGameInitation = false
										}
									}, 1000)
								}
							}
							break;
						case 'multiplayerfail':
							if (pendingRequest) {
								if (friends.includes(a.data.friend)) {
									pendingRequest = false
									currentlyPlaying = ''
									allowGameInitation = false
									let requestWindow = document.getElementById('pendingRequest-window')
									if (requestWindow !== null) {
										clearInterval(timerInterval)
										requestWindow.innerHTML = `<div id="pendingRequest-window" class="dialog" style="visibility: visible;height: 34px;position: fixed;top: ${($(window).height() - 12.5).toString()}px;left: ${($(window).width() - 691).toString()}px;font-size: 11px;color: red;width: 331px;">Request Denied!<div id="closePendingRequest" class="ugly-button" style="position: absolute;left: 8px;top: 28px;color: white;">Close</div><div id="pendingRequestTimer" style="position: absolute;top: 6px;left: 240px;font-size: 13px;color: red;">Request Failed</div><div style="position: absolute;top: 26px;left: 152px;font-size: 15px;">Crownclicker Multiplayer</div><img width="30" src="https://www.multiplayerpiano.com/crown.png" style="position: absolute;top: 2px;left: 201px;"></div>`
										let cancel = document.getElementById('closePendingRequest')
										cancel.addEventListener('click', function () {
											requestWindow.remove()
										})
										setTimeout(function () {
											if (requestWindow !== null) {
												requestWindow.remove()
											}
										}, 5000)
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
										k.innerText = `Your request to play '${a.data.game}' failed:`
										j.appendChild(k)
										let p = document.createElement('div')
										p.className = 'text'
										p.innerText = `${a.data.reason} : Player: ${a.data.friend}`
										j.appendChild(p)
										x.addEventListener('click', () => {
											j.remove()
										})

									}
								} else {
									console.warn('A failed multiplayer request was received, however The user was not on the friends list, how?')
								}
							} else {
								console.warn('A failed multiplayer request was received, however no request to play with friend was made.')
							}
							break;
						case 'beginmultiplayer':
							if (allowGameInitation) {
								if (friends.includes(a.data.friend)) {
									if (currentlyPlaying === a.data.friend) {
										switch (a.data.game) {
											case 'crownclicker':
												let tim = document.getElementById('pendingRequest-window')
												let mulcrown = document.getElementById('crownClickerMultiplayer-window')
												let friend = document.getElementById('friendsWindow-window')
												if (tim !== null) {
													tim.remove()
												}
												if (mulcrown !== null) {
													mulcrown.style.visibility = 'hidden'
												}
												if (friend !== null) {
													friend.style.visibility = 'hidden'
												}
												playingMultiplayerCrownClicker = true
												inGame = true
												allowGameInitation = false
												multiplayerGameStatus = true
												gameKey = a.data.gamekey
												multiplayerCrownAmmount = 0
												break;
										}
									} else {
										console.warn('A multiplayer initiate request was received, however there was not any pending request for this user.')
										// ws.send('initiatefailed:There is no pending request for this user.')
										debug('initiatefailed:There is no pending request for this user.')
										debug('A multiplayer initiate request was received, however there was not any pending request for this user.')
									}
								} else {
									console.warn('A multiplayer initiate request was received, however The user was not on the friends list, how?')
									// ws.send('initiatefailed:The playerid given is not on the friends list')
									debug('initiatefailed:The playerid given is not on the friends list')
									debug('A multiplayer initiate request was received, however The user was not on the friends list, how?')
								}
							} else {
								console.warn('A multiplayer initiate request was received, however The status to play was false.')
								// ws.send('initiatefailed:A multiplayer initiate request was received, however The status to play was false.')
								debug('initiatefailed:A multiplayer initiate request was received, however The status to play was false.')
								debug('A multiplayer initiate request was received, however The status to play was false.')
							}
							break;
						case 'ingame':
							switch (a.data.ingame) {
								case 'crownclicker':
									let returnpayload = {}
									// if (!playingMultiplayerCrownClicker) { return }
									let command = a.data.command
									switch (command) {
										case 'setup':
											if (!alreadySetup) {
												let i = document.getElementsByClassName('relative')[0]
												let ownscore = document.createElement('div')
												ownscore.style = 'top: 0px;left: 13%;position: fixed;font-weight: bold;font-size: 100px;color: lime;'
												ownscore.innerText = 'Score: 0'
												ownscore.id = 'ownscoreScoreMultiplayerCrownClicker'
												i.appendChild(ownscore)

												let friendscore = document.createElement('div')
												friendscore.style = 'top: 0px;left: 63%;position: fixed;font-weight: bold;font-size: 100px;color: red;'
												friendscore.innerText = 'Score: 0'
												friendscore.id = 'friendScoreMultiplayerCrownClicker'
												i.appendChild(friendscore)

												let globalTimer = document.createElement('div')
												globalTimer.id = 'multiplayerGlobalTimer'
												globalTimer.innerText = 'Time: 30'
												globalTimer.style = 'top: 4%;left: 43%;position: fixed;font-weight: bold;font-size: 47px;color: white;'
												i.appendChild(globalTimer)
												returnpayload = {
													game: 'crownclicker',
													command: 'ROOM SETUP'
												}
												ws.send(stringUp('ingame', returnpayload))
												debug(`ingame:crownclicker:ROOM SETUP:${currentlyPlaying}:${ownid}`)
												alreadySetup = true
											} else {
												returnpayload = {
													game: 'crownclicker',
													command: 'SHUTDOWNGAME',
													reason: `Server requested to setup timers multiple times.`,
													gamekey: gameKey
												}
												ws.send(stringUp('ingame', returnpayload))
												debug(`ingame:crownclicker:SHUTDOWNGAME:${gameKey}:Server requested to setup timers multiple times.`)
											}
											break;
										case 'time':
											let tempTime = a.data.time
											let globalTimer = document.getElementById('multiplayerGlobalTimer')
											if (globalTimer !== null) {
												globalTimer.innerText = `Time: ${tempTime}`
											} else {
												returnpayload = {
													game: 'crownclicker',
													command: 'SHUTDOWNGAME',
													reason: `Could not generate timers.`,
													gamekey: gameKey
												}
												ws.send(stringUp('ingame', returnpayload))
												debug(`ingame:crownclicker:SHUTDOWNGAME:${gameKey}:Could not generate timers.`)
											}
											break;
										case 'score':
											$('.crownClick').remove()
											multiplayerGameStatus = false
											let ownscore = document.getElementById('ownscoreScoreMultiplayerCrownClicker').innerText.split(' ')[1]
											let friendscore = document.getElementById('friendScoreMultiplayerCrownClicker').innerText.split(' ')[1]
											setTimeout(function () {
												returnpayload = {
													game: 'crownclicker',
													command: 'SCORE',
													ownscore: ownscore,
													friendscore: friendscore
												}
												ws.send(stringUp('ingame', returnpayload))
												debug(`ingame:crownclicker:SCORE:${ownscore}:${friendscore}`)
											}, 1000)

											break;

										case 'friendscore':
											let score = a.data.score
											let tempFriendscore = document.getElementById('friendScoreMultiplayerCrownClicker')
											if (tempFriendscore !== null) {
												tempFriendscore.innerText = `Score: ${score}`
											} else {
												returnpayload = {
													game: 'crownclicker',
													command: 'SHUTDOWNGAME',
													reason: `Could not set friend score.`,
													gamekey: gameKey
												}
												ws.send(stringUp('ingame', returnpayload))
												debug(`ingame:crownclicker:SHUTDOWNGAME:${gameKey}:Could not generate set friend score.`)
											}
											break;
										case 'crownpos':
											if (multiplayerCrownAmmount < 8 && multiplayerGameStatus === true) {
												let randomX = (Number(a.data.x) * ($(window).width())).toString()
												let randomY = (Number(a.data.y) * ($(window).height())).toString()
												let crown = document.createElement('a')
												crown.innerHTML = '<img width="50" src="https://www.multiplayerpiano.com/crown.png" style="-webkit-user-drag: none;">'
												crown.style = `position: fixed;top: ${randomY}px;left: ${randomX}px;`
												document.getElementsByClassName('relative')[0].appendChild(crown)
												crown.className = 'crownClick'
												crown.addEventListener('click', function () {
													crown.remove()
													multiplayerCrownAmmount--
													multiplayerScore++
													if (document.getElementById('ownscoreScoreMultiplayerCrownClicker') !== null) {
														document.getElementById('ownscoreScoreMultiplayerCrownClicker').innerText = `Score: ${multiplayerScore.toString()}`
													}
													returnpayload = {
														game: 'crownclicker',
														command: 'CROWNCLICKED',
														gamekey: gameKey,
														score: multiplayerScore.toString()
													}
													ws.send(stringUp(`ingame`, returnpayload))
												})
												multiplayerCrownAmmount++
											} else {
												debug('No more crown positions left')
											}
											break;
										case 'cursorpos':

											break;
										case 'gameover':
											$('.crownClick').remove()
											let od = document.getElementById('ownscoreScoreMultiplayerCrownClicker')
											let fd = document.getElementById('friendScoreMultiplayerCrownClicker')
											let time = document.getElementById('multiplayerGlobalTimer')
											if (od !== null && fd !== null) {
												fd.remove()
												od.remove()
											}
											time.remove()
											if (a.data.winnerid.length === 24) {
												let winner = a.data.winnerid
												if (winner === MPP.client.getOwnParticipant()._id) {
													let a = document.createElement('div')
													a.innerText = `You have won the game!`
													let sl = (($(window).width() / 2) - 300).toString();
													let st = (($(window).height() / 2) - 90).toString();
													a.style = `top: ${st}px;left: ${sl}px;position: fixed;font-weight: bold;font-size: 100px;color: #ffdd00;`
													document.getElementsByClassName('relative')[0].appendChild(a)
													clearAllGameStatus()
													setTimeout(function () {
														a.remove()
													}, 5000)
												} else {
													let e = document.createElement('div')
													e.innerText = `You lost. ${a.data.winnername} has won the game!`
													let sl = (($(window).width() / 2) - 300).toString();
													let st = (($(window).height() / 2) - 90).toString();
													e.style = `top: ${st}px;left: ${sl}px;position: fixed;font-weight: bold;font-size: 100px;color: #ffdd00;`
													document.getElementsByClassName('relative')[0].appendChild(e)
													clearAllGameStatus()
													setTimeout(function () {
														e.remove()
													}, 5000)
												}
											} else {
												let a = document.createElement('div')
												a.innerText = 'There was a tie!'
												let sl = (($(window).width() / 2) - 300).toString();
												let st = (($(window).height() / 2) - 90).toString();
												a.style = `top: ${st}px;left: ${sl}px;position: fixed;font-weight: bold;font-size: 100px;color: #ffdd00;`
												document.getElementsByClassName('relative')[0].appendChild(a)
												clearAllGameStatus()
												setTimeout(function () {
													a.remove()
												}, 5000)
											}
										case 'shutdowngame':
											let serverGameKey = a.data.gamekey
											let reason = a.data.reason
											if (gameKey === serverGameKey) {
												$('.crownClick').remove()
												multiplayerGameStatus = false
												clearAllGameStatus()
												let od = document.getElementById('ownscoreScoreMultiplayerCrownClicker')
												let fd = document.getElementById('friendScoreMultiplayerCrownClicker')
												let ti = document.getElementById('multiplayerGlobalTimer')
												if (od !== null) {
													fd.remove()
													ti.remove()
													od.remove()
												} else {
													debug('Failed to remove multiplayer score DIV elements.')
												}
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
												k.innerText = 'MULTIPLAYER GAME SHUTDOWN.'
												j.appendChild(k)
												let p = document.createElement('div')
												p.className = 'text'
												p.innerText = `The game was shut down because "${reason}"`
												j.appendChild(p)
												x.addEventListener('click', () => {
													j.remove()
												})
												setTimeout(function () {
													j.remove()
												}, 10000)
											} else {
												debug(`THE SERVER GIVEN GAME KEY ${gameKey}: THE GAME INVALID GAME KEY ${serverGameKey}`)
												debug('A game key was received to shutdown the server but the key was invalid.')
											}
											break;
									}
									break;
							}
							break;
						case 'serverannouncement':
							createPopup('ANNOUNCEMENT FROM SERVER:', a.data.announcement, 'serverAnnouncement-popup')
							break;
						case 'permissionshare':
							if (!MPP.client.channel.crown) { return }
							if (MPP.client.channel.crown.userId !== MPP.client.getOwnParticipant()._id)
								if (MPP.client.channel.crown.userId == a.data.id) {
									fakeOwner = true
									let f = MPP.client.ppl
									for (const property in f) {
										let j = Object.getOwnPropertyDescriptor(f[property], '_id')
										if (j) {
											if (j.value === MPP.client.user._id) {
												let p = f[property]
												let crown = document.createElement('div')
												crown.innerHTML = '<img src="https://i.imgur.com/Z6GELiE.png" style="position: absolute;top: -8px;left: 4px;">'
												crown.id = 'thatFakeCrown'
												p.nameDiv.appendChild(crown)
											}
										}
									}
									makeRoomSettings()
									currentlySharing = a.data.id
									createPopup('NOTIFICATION:', 'The Roomowner has shared permissions with you! You can now kick people, change room color, and adjust other settings.')
								}

							break;
						case 'kickuser':
							if (sharedPermissions.includes(a.data.id)) {
								const cr = MPP.client.channel.crown.userId
								const ow = MPP.client.getOwnParticipant()._id
								if ((a.data.roomowner == cr) && (cr == ow)) {
									if (a.data.kick !== ow) {
										MPP.client.sendArray([{ m: "kickban", _id: a.data.kick, ms: a.data.time }]);
									}
								} else {
									debug(`The roomowner id from the kick request is not the current roomowner from req.`)
								}
							} else {
								debug(`Kick user attempt from unknown user: ${reqid}`)
							}
							break;
						case 'changeroomset':
							if (sharedPermissions.includes(a.data.id)) {
								const cr = MPP.client.channel.crown.userId
								const ow = MPP.client.getOwnParticipant()._id
								if (cr == ow) {
									MPP.client.sendArray([{ m: "chset", set: a.data.roomsettings }]);
								} else {
									debug(`The roomowner id from the change request is not the current roomowner from req.`)
								}
							}
							break;
						case 'permissionremove':
							if (a.data.crownowner == MPP.client.channel.crown.userId) {
								let p = MPP.client.getOwnParticipant().nameDiv
								for (let i = 0; i < p.childNodes.length; i++) {
									if (p.childNodes[i].id == 'thatFakeCrown') {
										p.childNodes[i].remove()
									}
								}
								fakeOwner = false
								currentlySharing = false
								removeRoomSettings()
								createPopup('NOTIFICATION:', 'The roomowner has revoked your shared permissions.')
							} else {
								debug('Remove permissions but person was not roomowner.')
							}
							break;
						default:
							createWebsocketError(`Message not caught: ${a}`)
							break;
					}
					break;
				default:
					createWebsocketError(`Unexpected server key received: ${key}`)
					break;
			}
			if (debuggingMode) {
				let debugWindow = document.getElementById('debugWindow-window')
				if (debugWindow !== null) {
					let message = document.createElement('div')
					message.style = 'background-color: black;color: white;display: block;font-size: 12px;padding-bottom: 10px;padding-left: 10px;padding-right: 10px;'
					message.innerText = e.data
					debugWindow.appendChild(message)
				}
			}
		}
	});
	ws.addEventListener('close', function (e) {
		if (playingMultiplayerCrownClicker) {
			clearAllGameStatus()
			$('.crownClick').remove()
			multiplayerGameStatus = false
			let od = document.getElementById('ownscoreScoreMultiplayerCrownClicker')
			let fd = document.getElementById('friendScoreMultiplayerCrownClicker')
			let ti = document.getElementById('multiplayerGlobalTimer')
			if (od !== null) {
				fd.remove()
				ti.remove()
				od.remove()
			} else {
				debug('Failed to remove multiplayer score DIV elements.')
			}
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
			k.innerText = 'MULTIPLAYER GAME SHUTDOWN.'
			j.appendChild(k)
			let p = document.createElement('div')
			p.className = 'text'
			p.innerText = `The game was shut down because you disconnected from the websocket.`
			j.appendChild(p)
			x.addEventListener('click', () => {
				j.remove()
			})
			setTimeout(function () {
				j.remove()
			}, 10000)
		}

	})
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
									$("#chat input").get(0).blur();
									$("#chat").removeClass("chatting");
									if (inputBox.value.trim()) {
										createMessageOnScreen(ownid, inputBox.value, 'true', MPP.client.getOwnParticipant().color, `msgWin_${playerid}`, undefined, true)
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
								// EXPERIMENTAL
								if (inputBox.value.trim()) {
									createMessageOnScreen(ownid, inputBox.value, 'true', MPP.client.getOwnParticipant().color, `msgWin_${playerid}`, undefined, true)
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
					sendMessage('update friends')
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
						if (friendRoomId.includes(playerid)) {
							let x = friendRoomId.indexOf(playerid)
							friendRoomId.splice(x, 1)
						}
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
	if (authenticationStatus === undefined || authenticationStatus === null && (connectingText && cancelButton)) {
		stopDots = true
		connectingText.style.color = 'red';
		connectingText.innerHTML = "AUTHENTICATION FAILED. REASON: TIMEOUT";
		cancelButton.style.color = 'red';
		cancelButton.innerHTML = 'Failure!';
		return
	}
}

function alreadyVerified() {
	if (connectingText && cancelButton) {
		stopDots = true
		connectingText.style.color = 'lime';
		connectingText.innerHTML = "YOU HAVE ALREADY BEEN VERIFIED.";
		cancelButton.style.color = 'lime';
		cancelButton.innerHTML = 'Success!';
	}
}

function verificationConfirmed() {
	if (authenticationStatus === true && connectingText && cancelButton) {
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
	if (authenticationStatus === false && connectingText && cancelButton) {
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
		}
	}
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
		// sendMessage('update names')
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
				if (test[i].childNodes[1] !== undefined) {
					test[i].childNodes[1].innerHTML = '-'
					test[i].childNodes[1].style.color = 'black'
				}
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
	// AUTO CONNECT
	window.setInterval(function () {
		if (ws === undefined || ws === 'Websocket') {
		} else if (ws.readyState === WebSocket.CLOSED) {
			ws = new WebSocket(`${WEBSOCKETLOCATION}`);
			sendMessage('get status')
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
		let fakeCrown = document.getElementById('shareRoomOwnershipCrown')
		if (score) {
			score.style.left = '38%'
		}
		if (fakeCrown) {
			fakeCrown.style.left = `${($(window).width() - 190)}px`
			fakeCrown.style.top = `${($(window).height() - 59) * -1}px`
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
				let nmedv = MPP.client.getOwnParticipant().nameDiv
				setTimeout(function () {
					if (nmedv) {
						(fakeOwner) ? (nmedv.appendChild(fCrown)) : (undefined)
					}
				}, 100)
				sendMessage('update name')
			})
		}
	}
	for (let i = 0; i < friends.length; i++) {
		retrieveMessageNumber(friends[i])
	}
	let soundWarning = document.getElementById('sound-warning')
	if (disablePopups) {
		if (soundWarning !== null) {
			soundWarning.click()
		}
		let observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (!mutation.addedNodes) return
				for (let i = 0; i < mutation.addedNodes.length; i++) {
					let node = mutation.addedNodes[i]
					if (node.id === 'Notification-MIDI-Connections') {
						$('#Notification-MIDI-Connections').remove()
						setTimeout(function () {
							observer.disconnect()
						}, 1000)
					}
				}
			})
		})

		observer.observe(document.body, {
			childList: true
			, subtree: true
			, attributes: false
			, characterData: false
		})
		setTimeout(function () {
			for (let i = 0; i < 2; i++) {
				$("#crownClickerMultiplayer-window").children().each(function (i, e) { for (let i = 0; i < e.childNodes.length; i++) { if (e.childNodes[i].className === 'ugly-button') { e.childNodes[i].remove() } } })
			}
			observer.disconnect()
		}, 10000)
	}
	$('.text')[1].addEventListener('keydown', (evt) => {
		(evt.keyCode == 13) ? (sendMessage('update name'),
			setTimeout(function () {
				if (nmedv) {
					(fakeOwner) ? (MPP.client.getOwnParticipant().nameDiv.appendChild(fCrown)) : (undefined)
				}
			}, 100)
		) : (undefined)
	})
	const jex = document.getElementById('sound-btn')
	jex.addEventListener('click', function () {
		setTimeout(function () {
			let x = document.getElementById('Notification-Sound-Selector')
			if (x) {
				for (let i = 0; i < x.childNodes.length; i++) {
					x.childNodes[i].addEventListener('click', function () {
						console.log('updating public sound')
						sendMessage('update sound', MPP.soundSelector.soundSelection)
					})
				}
			}
		}, 1000)
	})
})();
// -- //



