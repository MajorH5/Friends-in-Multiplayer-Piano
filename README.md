
# Multiplayer Piano Script
###### Server is being hosted @ https://mppchatclient.info/
(404 error is expexted behavior.)


Hello! This is a script I've been working on about a week. It allows friends in MPP by storing data in browser cookies and indexDB. It also allows for direct communcation between two users via a websocket.


<p align="center">
Client side
</p>


You can add friends by clicking their name and selecting 'Add Friend'. This turns their name and cursor name green making it easily identifiable in crowded rooms. To remove a friend, click their name again and select 'Remove friend'.

<p align="center">
  <img  width="100" src="https://i.imgur.com/psWFH8T.gif">
</p>


When a friend is added, their **name, ID, and color information** is stored locally to the PC in the websites cookie data. This data is retrieved everytime the site is accessed.
<p align="center">
<img src="https://i.imgur.com/lschSbh.png" width="500">
</p>

In addition their name is pushed into a new tab on the screen called the friends tab:
<p align="center">
<img src="https://i.imgur.com/HmEiz2U.png" width="500">
</p>

From this tab you can either 'Remove Friend' or 'Message'. Removing friends obviously removes them from your friends list. Message allows you to have direct messaging between you and the friend. This is done by connecting to an external websocket (https://mppchatclient.info/). The chrome console supports Websockets natively so this should work in chrome just fine.


You can also join the friends room by selecting 'Join Room'. A request will be sent to the friends client and if they have 'Allow Friends Join' true, then the user will be granted access to the room. Here is an example of the different errors that can result from trying to join a room.

1. The user does not allow friends to join their rooms.
2. The user is not using this script.
3. The user is not online.

<p align="center">
<img src="https://i.imgur.com/3akRYrR.gif" width="500">
</p>


Other users of the script are easily identifiable because their names will be orange and tagged with 'Script user'. This will allow you to know who uses the script and who does not.

<p align="center">
<img src="https://i.imgur.com/RlondxG.png" width="500">
</p>

## Note:

- **The websocket that is used has no relation to MPP and was made by me and is hosted by me.**
- **Do not send any private/sensitive information over this websocket if that isn't obvious.**
- **Do not attempt to spoof your ID to send messages as someone else.**
- **The server stores and saves IP address to prevent ID spoofing, this is explained further down.**

Here's what messaging looks like:

<p align="center">
<img src="https://i.imgur.com/43g2BKK.gif" width="500">
</p>

`This is communication between two users from different computers stitched together.`

If you receive a message from someone who is not in your friends list you get the follow popup:

<p align="center">
<img src="https://i.imgur.com/5DMiSjr.png" width="500">
</p>

The user can accept the request and add them to friends or deny by clicking the X. They can also block further messages from that client by clicking 'Block'.

Here is what the announcement system looks like:

<p align="center">
<img src="https://i.imgur.com/Q6U5QFI.png" width="500">
</p>

This message is dispatched to all clients. This feature is used to announce when servers are going offline or a new update/fix is released.

Now one obvious issue with messaging in MPP would be using someone elses ID to message. It wouldn't be hard to edit the code to add a different IP instead of your own, so to combat this I added a verification system. When a new message window is opened for the first time a popup appears:


<p align="center">
<img src="https://i.imgur.com/euCZshf.png" width="500">
</p>

The popup explains reason for verification and automatically saves the players ID and IP together. To do this, the client connects to the websocket and request a verification. In response the server creates a verification key or randomly generated string of numbers and characters which is sent back along with a room name that is also randomly generated. When the client receives the room name it creates a new MPP client, connects to it, and automatically pastes the verification key into the chat. If the ID of the player who sent the key matches the ID that was sent in the request, the user is verified. This process only needs to be completed once.

Unverified users have a tag with their messages:

<p align="center">
<img src="https://i.imgur.com/lRWXleS.png" width="500">
</p>


Another feature introduced in the script is the ability to see if your friends are online or not. When the client is connected to the server, under the friends name will be a status which can have 1 of 4 states, Online, Offline, Unknown, or Disconnected. If the user is online the status is online and if they're offline, the status is offline. Online and offline status are only for players which have ran the script atleast once and have generated a player file on the websocket. If no data is found, the friend status is Unknown. The last status is if the user is disconnected from the websocket, in which case the status is blank. Of course a player can be online and their status will be displayed as offline if they're not connected to the websocket, there is no way around this.

<p align="center">
<img src="https://i.imgur.com/KmvgGeP.png" width="500">
</p>

Currently there are three extra buttons which I have added. The first one hides or shows the friend tab, and the second one displays the status of the connection to the websocket. Clicking it while disconnected will connnect to the websocket and clicking while connected will disconnect. Finally the settings button opens a settings window where you can allow or dissallow friends from joining your room or manually verify your ID.

<p align="center">
<img src="https://i.imgur.com/CYwAlqa.png" width="500">
</p>

<p align="center">
<img src="https://i.imgur.com/ByPKtZo.png" width="500">
</p>

<p align="center">
Server Side
</p>


Currently the server side code is not too complicated. When a connection is made the client automatically sends over playerdata. This is the information that is collected:

```
userDATAid
userDATAname
userDATAip
userDATAfriends
userDATAcolor
userDATAverify
```

Example of stored data:

<p align="center">
<img src="https://i.imgur.com/hjlZrcI.png" width="500">
</p>


ID, name, color, and ip are stored to handle communications between users. When a request is made to send a message to another user, the client generates a random msgID that is assigned to the message and sends that information to the server along with ownID, friendID and the message. The server then looks up the friends data file to grab their IP address. From there it searches through the connected webclients to see if the IP matches, if so the data is transferred over along with the players verification status.

The players serverside data file is updated every 15 minutes or upon every connection. This ensures that the friend array stored on the server side always has updated information.

This is useful when handling connects and disconnects. Currently, when a player connects, a message is brodcasted to all friends found online from the players list of friends. The message instructs the client to switch the player's connection status to Online for their friends. A similar thing happens when they disconnect

<p align="center">
<img src="https://i.imgur.com/VXy1J41.gif" width="500">
</p>

# HOW TO INSTALL:

**STEP 1:**
```
Goto: https://bit.ly/3nC3o2T
Select 'Add to Chrome'.
```

<p align="center">
<img src="https://i.imgur.com/3u7mpOy.png" width="500">
</p>


**STEP 2:**
```
Select the extension plugin icon in the top right of your browser window.
Select the Pin Icon Next to 'TamperMonkey':
```

<p align="center">
<img src="https://i.imgur.com/tsyNgK8.png" width="500">
</p>


**STEP 3:**
```
Click the TamperMonkey extention icon and select 'Dashboard':
```

<p align="center">
<img src="https://i.imgur.com/XS9ar7n.png" width="500">
</p>

**STEP 4:**
```
Click the plus icon:
```

<p align="center">
<img src="https://i.imgur.com/Asdmgha.png" width="500">
</p>

**STEP 5:**
```
Goto:
```
https://raw.githubusercontent.com/MajorH5/Friends-in-Multiplayer-Piano/main/Friends_in_MPP.js
```
And copy the entire code.
```

**STEP 6:**
```
Go back to TamperMonkey and paste the code and press 'CTRL + S'
```

<p align="center">
<img src="https://i.imgur.com/Kh9CMQb.gif" width="500">
</p>

**THAT'S ALL.**
> Make sure to lookout for future updates to fix the many bugs. This is a very early script and concept. Messages are deleted upon refresh currently. Feel free to give any suggestions for the script. Most importantly send me any bug reports that you have. When there is a new update just paste the new code over the old one in TamperMonkey to replace the old script.



# UPDATE LOG:
*1/12/2021 (v1.2)*

**UPDATES:**

- Added server announcements (I can now message everyone online about anything important. This will only be used when necessary) :white_check_mark:
- Friend window is now draggable. (NOTE: Messenger window is not draggable as of yet. This is a bit more complicated):white_check_mark:
- Added settings button. :white_check_mark:
- Can now see who else uses the script. (They're names will be orange and they will have a tag next to their name) :white_check_mark:
- Error handler for joining friends room :white_check_mark:
- Can now allow or disallow friends from joining rooms (NOTE: In order to join a room, you both must be mutual friends. One person can not friend someone and then just join their room. The request will be automatically denied) :white_check_mark:
- Users can receive messages from someone their not friends with and can accept or deny  :white_check_mark:
- Status of player is now grabbed immediately when they're added to friends list :white_check_mark:
- Names in panel now update with players new name ONLY if they are in the database (This feature is still a little buggy. Work in progress but kind of works.) :x:
- Message window now auto scrolls when you send a message :white_check_mark:
- Added Version Number :white_check_mark:
- Added ability to manually verify ID:white_check_mark:
- Verification system now works.(NOTE: **THE SETTINGS MAY SAY YOU ARE VERIFIED BUT YOU'RE  PROBABLY NOT.** This is because that data is stored locally on your PC's and i cant edit that. So when you use this new build make sure to go into settings and click 'verified' even if it says you are verified just to make sure.) :white_check_mark:

*1/15/2021 (v1.3)*

**UPDATES:**

- This is just a short update. Messages are now stored in computer so, messages are now saved.
- Fixed Enable and Disable friend button stuck showing 'Try Again'
- Fixed blank verification button for some users and button now updates to proper status when verified
- Get new script form:

*1/16/2021 (v1.3.1)*

**UPDATES:**

- Messages to offline players are now stored server sided and sent when the player comes online.
- Fixed bug where if you received a message and the window was not open, the message was lost.
- Fixed messages from someone who is not friend being deleted
- When receiving message from someone who isn't friend, database is now created automatically so message is not lost.
- Added warning message when removing friend
- Can now send messages using the 'Enter' key
- Added a clear data button which will delete all site data that the script uses. This clears all friend data, message data, button status, etc (NOTE: As of right now, it does not clear out messages. Still working that out.)


# Things to add:
 - **See friends rooms and join them**
 
 - **Store messages in chrome indexDB (currently messages are deleted on refresh)**
 
 - **Fix UI glitches and bugs**
 
 - **Ability to search for friend to add**
 
 - **Group chats are in the works**
 
 - **Draggable messenger window**

/*  THIS IS NOT YET COMPLETED. 1/7/2021*/
